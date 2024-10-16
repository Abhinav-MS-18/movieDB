from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydb']
users_collection = db['users']  # Users collection

# Movies endpoint


@app.route('/movies', methods=['GET'])
def get_movies():
    # Exclude _id from the response
    movies = list(db['sample'].find({}, {'_id': 0}))
    return jsonify(movies)

# Signup endpoint


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("Received Data:", data)  # Log the incoming data

    name = data.get('name')
    email = data.get('email')
    age = data.get('age')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    # Basic validation
    if not (name and email and age and password and confirm_password):
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Email format validation
    email_regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400

    # Age validation
    if not str(age).isdigit() or int(age) <= 0:
        return jsonify({"error": "Invalid age"}), 400

    # Insert user into the database
    users_collection.insert_one({
        "name": name,
        "email": email,
        "age": int(age),
        "password": password  # In a real-world app, you should hash the password!
    })

    return jsonify({"message": "User registered successfully!"}), 201

# Sign In endpoint


@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["password"] != password:
        return jsonify({"error": "Invalid password"}), 403

    return jsonify({
        "message": "Sign in successful!",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "genres": user.get("genres", []),  # Retrieve existing genres
        }
    }), 200

# Endpoint to update user genres

@app.route('/update-genres', methods=['POST'])
def update_genres():
    data = request.get_json()
    email = data.get('email')
    genres = data.get('genres')

    # Check if the user exists
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the user's preferred genres
    users_collection.update_one({"email": email}, {"$set": {"genres": genres}})

    return jsonify({"message": "Genres updated successfully!"}), 200


if __name__ == '__main__':
    app.run(debug=True)

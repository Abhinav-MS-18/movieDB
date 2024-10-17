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
collection = db['sample1']
# Movies endpoint


@app.route('/movies', methods=['GET'])
def get_movies():
    movies = list(collection.find({}, {'_id': 0}))
    return jsonify(movies)

# Genres endpoint


@app.route('/genres', methods=['GET'])
def get_genres():
    genres = collection.distinct('genres')
    return jsonify(genres), 200

# Sign Up endpoint


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
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

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the user's preferred genres
    users_collection.update_one({"email": email}, {"$set": {"genres": genres}})

    return jsonify({"message": "Genres updated successfully!"}), 200

# Endpoint to fetch user genres


@app.route('/user-genres', methods=['POST'])
def get_user_genres():
    data = request.get_json()
    email = data.get('email')

    user = users_collection.find_one({"email": email})
    if user:
        return jsonify(user.get("genres", [])), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Endpoint to fetch user watchlist


@app.route('/user-watchlist', methods=['POST'])
def get_user_watchlist():
    data = request.get_json()
    email = data.get('email')

    user = users_collection.find_one(
        {"email": email}, {"_id": 0, "watchlist": 1})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"watchlist": user.get("watchlist", [])}), 200

# Endpoint to add movie to watchlist


@app.route('/add-to-watchlist', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    email = data.get('email')
    movie = data.get('movie')

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    users_collection.update_one(
        {"email": email}, {"$addToSet": {"watchlist": movie}})
    return jsonify({"message": "Movie added to watchlist!"}), 200

# Endpoint to remove movie from watchlist


@app.route('/remove-from-watchlist', methods=['POST'])
def remove_from_watchlist():
    data = request.get_json()
    email = data.get('email')
    movie = data.get('movie')

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    users_collection.update_one(
        {"email": email}, {"$pull": {"watchlist": {"title": movie["title"]}}})
    return jsonify({"message": "Movie removed from watchlist!"}), 200


if __name__ == '__main__':
    app.run(debug=True)

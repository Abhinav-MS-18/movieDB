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

# Movies endpoint (for existing movie functionality)
@app.route('/movies', methods=['GET'])
def get_movies():
    movies = list(db['sample'].find({}, {'_id': 0}))  # Exclude _id from the response
    return jsonify(movies)

# Signup endpoint
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("Received Data:", data)  # Add this line to log the incoming data

    name = data.get('name')
    email = data.get('email')
    age = data.get('age')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

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

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import re
from flask import Flask, jsonify, send_from_directory, request, render_template, redirect, url_for, flash, session
from bson import ObjectId

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
        return jsonify({"error": "User not found signin"}), 404

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
        return jsonify({"error": "User not found update genre"}), 404

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
        return jsonify({"error": "User not found user genre"}), 404

# Endpoint to fetch user watchlist


@app.route('/user-watchlist', methods=['POST'])
def get_user_watchlist():
    data = request.get_json()
    email = data.get('email')

    user = users_collection.find_one(
        {"email": email}, {"_id": 0, "watchlist": 1})
    if not user:
        return jsonify({"error": "User not found user watchlist"}), 404

    return jsonify({"watchlist": user.get("watchlist", [])}), 200

# Endpoint to add movie to watchlist


@app.route('/add-to-watchlist', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    email = data.get('email')
    movie = data.get('movie')

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found add watchlist"}), 404

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
        return jsonify({"error": "User not found remove watchlist"}), 404

    users_collection.update_one(
        {"email": email}, {"$pull": {"watchlist": {"title": movie["title"]}}})
    return jsonify({"message": "Movie removed from watchlist!"}), 200


@app.route('/analysis')
def analysis_redirect():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/analysis')
def api_analysis():

    genre_revenue = list(collection.aggregate([
        {"$unwind": "$genres"},
        {"$group": {"_id": "$genres", "totalRevenue": {"$sum": "$revenue"}}},
        {"$sort": {"totalRevenue": -1}}
    ]))

    average_genre_revenue = list(collection.aggregate([
        {"$unwind": "$genres"},
        {"$group": {"_id": "$genres", "averageRevenue": {"$avg": "$revenue"}}},
        {"$sort": {"averageRevenue": -1}}
    ]))

    top_actors = list(collection.aggregate([
        {"$unwind": "$cast"},
        {"$group": {"_id": "$cast.name", "totalRevenue": {"$sum": "$revenue"}}},
        {"$sort": {"totalRevenue": -1}},
        {"$limit": 10}
    ]))

    roi_data = list(collection.aggregate([
        {"$match": {"budget": {"$gt": 0}, "revenue": {"$gt": 0}}},
        {"$project": {"title": 1, "budget": 1, "revenue": 1,
                      "roi": {"$divide": ["$revenue", "$budget"]}}},
        {"$sort": {"roi": -1}},
        {"$limit": 10}
    ]))

    movies_per_year = list(collection.aggregate([
        {"$match": {"release_date": {"$ne": "", "$exists": True}}},
        {"$addFields": {"releaseDateFormatted": {"$toDate": "$release_date"}}},
        {"$group": {"_id": {"year": {"$year": "$releaseDateFormatted"}}, "count": {"$sum": 1}}},
        {"$sort": {"_id.year": -1}},
        {"$limit": 30},

    ]))

    revenue_per_year = list(collection.aggregate([
        {"$match": {"release_date": {"$ne": "", "$exists": True}}},
        {"$addFields": {"releaseDateFormatted": {"$toDate": "$release_date"}}},
        {"$group": {"_id": {"year": {"$year": "$releaseDateFormatted"}},
                    "totalRevenue": {"$sum": "$revenue"}}},
        {"$sort": {"_id.year": -1}},
        {"$limit": 30}
    ]))

    def convert_object_id(data):
        if isinstance(data, list):
            return [convert_object_id(item) for item in data]
        elif isinstance(data, dict):
            return {k: convert_object_id(v) for k, v in data.items()}
        elif isinstance(data, ObjectId):
            return str(data)
        else:
            return data

    response_data = {
        "genreRevenue": convert_object_id(genre_revenue),
        "averageGenreRevenue": convert_object_id(average_genre_revenue),
        "topActors": convert_object_id(top_actors),
        "roiData": convert_object_id(roi_data),
        "moviesPerYear": convert_object_id(movies_per_year),
        "revenuePerYear": convert_object_id(revenue_per_year)
    }

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)

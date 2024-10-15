from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydb']
collection = db['sample']

@app.route('/movies', methods=['GET'])
def get_movies():
    movies = list(collection.find({}, {'_id': 0}))  # Exclude _id from the response
    return jsonify(movies)

if __name__ == '__main__':
    app.run(debug=True)

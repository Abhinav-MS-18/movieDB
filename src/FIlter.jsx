// Filter.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Filter = () => {
  const [availableGenres, setAvailableGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  // Fetch available genres from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/genres")
      .then((response) => {
        setAvailableGenres(response.data); // Set the genres from backend
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  }, []);

  // Handle genre selection
  const handleGenreChange = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  // Handle filtering and updating genres in DB
  const handleFilter = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      // Update user's genres in the database
      axios
        .post("http://localhost:5000/update-genres", {
          email: user.email,
          genres: selectedGenres,
        })
        .then(() => {
          // Navigate to Movies page with selected genres as state
          navigate("/", { state: { selectedGenres } });
        })
        .catch((error) => {
          console.error("Error updating genres:", error);
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Filter by Genre</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {availableGenres.map((genre, index) => (
          <label
            key={index}
            className="flex items-center space-x-2 bg-gray-100 p-2 rounded shadow"
          >
            <input
              type="checkbox"
              value={genre}
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreChange(genre)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-lg">{genre}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleFilter}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default Filter;

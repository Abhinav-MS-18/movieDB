import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [genres, setGenres] = useState([]); // State for user-selected genres
  const [availableGenres, setAvailableGenres] = useState([]); // State for available genres
  const [isGenreSelection, setIsGenreSelection] = useState(false); // State for showing genre selection
  const navigate = useNavigate(); // For redirection

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

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle genre selection
  const handleGenreChange = (genre) => {
    setGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  // Handle form submission (sign-in logic)
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/signin", formData)
      .then((response) => {
        console.log("Sign in successful:", response.data);
        setIsGenreSelection(true); // Show genre selection after successful sign-in
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data to localStorage
      })
      .catch((error) => {
        console.error(
          "Error during sign in:",
          error.response?.data?.error || "Something went wrong"
        );
      });
  };

  // Handle genre save and redirection to movies page
  const handleSaveGenres = () => {
    // Save genres to the backend
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      axios
        .post("http://localhost:5000/update-genres", {
          email: user.email,
          genres: genres,
        })
        .then(() => {
          // After saving, redirect to the movies page
          navigate("/movies"); // Navigate to the movies page
        })
        .catch((error) => {
          console.error("Error updating genres:", error);
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Sign In</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded"
        >
          Sign In
        </button>
      </form>

      {/* Genre selection after sign-in */}
      {isGenreSelection && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4">
            Select Your Preferred Genres
          </h2>
          <div className="flex flex-wrap">
            {availableGenres.map((genre, index) => (
              <label key={index} className="mr-4 mb-4">
                <input
                  type="checkbox"
                  value={genre}
                  checked={genres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="mr-2"
                />
                {genre}
              </label>
            ))}
          </div>

          {/* Add Save Genres Button */}
          <button
            onClick={handleSaveGenres}
            className="mt-4 p-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Genres and View Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default SignIn;

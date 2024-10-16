import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [genres, setGenres] = useState([]); // State for genres
  const [isGenreSelection, setIsGenreSelection] = useState(false); // State for showing genre selection
  const navigate = useNavigate(); // Use navigate for redirection

  // List of available genres
  const availableGenres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Thriller", "Sci-Fi"];

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit form data to backend
    axios
      .post("http://localhost:5000/signin", formData)
      .then((response) => {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        // Prompt user to select genres
        setIsGenreSelection(true);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "Something went wrong");
      });
  };

  // Handle genre selection
  const handleGenreChange = (genre) => {
    setGenres((prevGenres) => 
      prevGenres.includes(genre) ? prevGenres.filter(g => g !== genre) : [...prevGenres, genre]
    );
  };

  // Handle genre submission
  const handleGenreSubmit = () => {
    axios
      .post("http://localhost:5000/update-genres", {
        email: formData.email,
        genres: genres,
      })
      .then(() => {
        navigate("/"); // Redirect to the home page
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "Something went wrong");
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Sign In</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
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
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>

      {/* Link to signup if the user does not have an account */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Genre Selection */}
      {isGenreSelection && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-center mb-4">Select Your Preferred Genres</h2>
          <div className="flex flex-wrap justify-center">
            {availableGenres.map((genre) => (
              <label key={genre} className="mr-4">
                <input
                  type="checkbox"
                  value={genre}
                  onChange={() => handleGenreChange(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
          <button
            onClick={handleGenreSubmit}
            className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Genres
          </button>
        </div>
      )}
    </div>
  );
};

export default SignIn;

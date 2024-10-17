import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleToggleWatchlist } from "./Moviecard";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // Assuming you already have the user stored in localStorage
  const userEmail = user?.email; // Get the user's email

  useEffect(() => {
    if (userEmail) {
      axios
        .post("http://localhost:5000/user-watchlist", { email: userEmail }) // Send email in request body
        .then((response) => {
          setMovies(response.data.watchlist || []); // Set movies from response
        })
        .catch((error) => {
          console.error("Error fetching watchlist:", error);
        });
    }
  }, [userEmail]);

  // Handle movie removal
  const handleRemoveMovie = async (movie) => {
    try {
      await handleToggleWatchlist(movie, userEmail, () => {}, true); // Set inWatchlist to true for deletion
      setMovies((prevMovies) => prevMovies.filter((m) => m.title !== movie.title)); // Remove from local state
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    }
  };

  return (
    <div className="p-10">
      <div className="text-4xl font-bold text-center mb-8">Watchlist</div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Poster</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Title</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-300">
                  <div
                    style={{
                      backgroundImage: `url(${movie.poster_url})`,
                    }}
                    className="h-[20vh] w-[15vh] rounded-xl bg-cover bg-center"
                  ></div>
                </td>
                <td className="py-2 px-4 border-b border-gray-300">{movie.title}</td>
                <td
                  onClick={() => handleRemoveMovie(movie)} // Call remove function
                  className="text-red-600 font-bold text-lg cursor-pointer hover:scale-105 duration-300"
                >
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {movies.length === 0 && (
          <div className="text-center text-lg text-gray-500">No movies in your watchlist.</div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

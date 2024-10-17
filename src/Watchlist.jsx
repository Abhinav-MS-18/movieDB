import React, { useEffect, useState } from "react";
import axios from "axios";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      axios
        .post("http://localhost:5000/user-watchlist", { email: user.email }) // Send email in request body
        .then((response) => {
          setMovies(response.data.watchlist || []); // Set movies from response
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching watchlist:", error);
        });
    }
  }, []);

  return (
    <div className="p-10">
      <div className="text-4xl font-bold text-center mb-8">Watchlist</div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-300">Poster</th>
            <th className="py-2 px-4 border-b-2 border-gray-300">Title</th>
            <th className="py-2 px-4 border-b-2 border-gray-300">Actions</th>
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
                <td className="py-2 px-4 border-b border-gray-300">
                  {movie.title}
                </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {/* Add any actions you want here, e.g., remove from watchlist */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;

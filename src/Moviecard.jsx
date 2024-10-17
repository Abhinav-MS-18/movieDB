import React, { useState, useEffect } from "react";
import axios from "axios";

const Card = ({ movie, userEmail }) => {
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (userEmail) {
      axios
        .post("http://localhost:5000/user-watchlist", { email: userEmail })
        .then((response) => {
          const watchlist = response.data.watchlist || [];
          const isMovieInWatchlist = watchlist.some(
            (watchlistMovie) => watchlistMovie.title === movie.title
          );
          setInWatchlist(isMovieInWatchlist);
        })
        .catch((error) => {
          console.error("Error fetching watchlist:", error);
        });
    }
  }, [userEmail, movie.title]);

  const handleToggleWatchlist = () => {
    const endpoint = inWatchlist ? "remove-from-watchlist" : "add-to-watchlist";

    console.log("User email:", userEmail);
    console.log("Movie to add:", {
      title: movie.title,
      genres: movie.genres,
      poster_url: movie.poster_url,
    });

    axios
      .post(`http://localhost:5000/${endpoint}`, {
        email: userEmail,
        movie: {
          title: movie.title,
          genres: movie.genres,
          poster_url: movie.poster_url,
        },
      })
      .then((response) => {
        console.log(response.data.message);
        setInWatchlist(!inWatchlist);
      })
      .catch((error) => {
        console.error(
          "Error updating watchlist:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${movie.poster_url})`,
      }}
      className="h-[50vh] w-[40vh] rounded-xl bg-cover bg-center hover:scale-110 duration-500 flex items-end flex-col justify-between"
    >
      <div
        onClick={handleToggleWatchlist}
        className="flex justify-center items-center text-xl mx-2 my-2 p-1 rounded-lg bg-gray-900/60 hover:cursor-pointer"
      >
        <div className="text-2xl">{inWatchlist ? "❌" : "➕"}</div>
      </div>
      <div className="text-xl text-white bg-gray-900/60 text-center w-full p-2 rounded-b-xl">
        {movie.title}
      </div>
    </div>
  );
};

export default Card;

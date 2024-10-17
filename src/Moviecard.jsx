import React, { useState, useEffect } from "react";
import { useWatchlist } from "./WatchlistContext";

const Card = ({ movie }) => {
  const { watchlist, addMovieToWatchlist, removeMovieFromWatchlist } =
    useWatchlist();
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    setInWatchlist(watchlist.some((m) => m.title === movie.title));
  }, [watchlist, movie.title]);

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeMovieFromWatchlist(movie);
    } else {
      addMovieToWatchlist(movie);
    }
    setInWatchlist(!inWatchlist);
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

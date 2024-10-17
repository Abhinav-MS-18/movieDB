import React from "react";
import { useWatchlist } from "./WatchlistContext";

const Watchlist = () => {
  const { watchlist, removeMovieFromWatchlist } = useWatchlist();

  return (
    <div className="p-10">
      <div className="text-4xl font-bold text-center mb-8">Watchlist</div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left w-1/3">
                Poster
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left w-1/3">
                Title
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left w-1/3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((movie, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-300 w-1/3">
                  <div
                    style={{
                      backgroundImage: `url(${movie.poster_url})`,
                    }}
                    className="h-[20vh] w-[15vh] rounded-xl bg-cover bg-center"
                  ></div>
                </td>
                <td className="font-bold py-2 px-4 border-b border-gray-300 w-1/3">
                  {movie.title}
                </td>
                <td
                  onClick={() => removeMovieFromWatchlist(movie)}
                  className="py-2 px-4 border-b border-gray-300 w-1/3 text-red-600 font-bold text-lg cursor-pointer hover:scale-95 duration-300"
                >
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {watchlist.length === 0 && (
          <div className="text-center text-lg text-gray-500">
            No movies in your watchlist.
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

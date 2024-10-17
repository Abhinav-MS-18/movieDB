import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  useEffect(() => {
    if (userEmail) {
      // Fetch the watchlist once and store it globally
      axios
        .post("http://localhost:5000/user-watchlist", { email: userEmail })
        .then((response) => {
          setWatchlist(response.data.watchlist || []);
        })
        .catch((error) => {
          console.error("Error fetching watchlist:", error);
        });
    }
  }, [userEmail]);

  const addMovieToWatchlist = async (movie) => {
    try {
      await axios.post("http://localhost:5000/add-to-watchlist", {
        email: userEmail,
        movie,
      });
      setWatchlist((prev) => [...prev, movie]);
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
    }
  };

  const removeMovieFromWatchlist = async (movie) => {
    try {
      await axios.post("http://localhost:5000/remove-from-watchlist", {
        email: userEmail,
        movie,
      });
      setWatchlist((prev) => prev.filter((m) => m.title !== movie.title));
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addMovieToWatchlist, removeMovieFromWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

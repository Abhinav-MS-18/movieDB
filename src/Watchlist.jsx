import React, { useEffect, useState } from "react";
import axios from "axios";

const Watchlist = ({ userEmail }) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (userEmail) {
      axios.post("http://localhost:5000/user-watchlist", { email: userEmail })
        .then((response) => {
          setWatchlist(response.data.watchlist || []);
        })
        .catch((error) => {
          console.error("Error fetching watchlist:", error);
        });
    }
  }, [userEmail]);

  return (
    <div>
      <h1>Your Watchlist</h1>
      <ul>
        {watchlist.map((movie) => (
          <li key={movie.title}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;

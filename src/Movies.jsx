import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from "./Moviecard";
import Pagination from "./Pagination";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const userEmail = JSON.parse(localStorage.getItem("user"))?.email;
  const [userGenres, setUserGenres] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const moviesPerPage = 30;
  const location = useLocation();
  const selectedGenres = location.state?.selectedGenres || []; // Get selected genres from state

  const prevPage = () => {
    if (pageNo !== 1) {
      setPageNo(pageNo - 1);
    }
  };

  const nextPage = () => {
    if (pageNo < Math.ceil(filteredMovies.length / moviesPerPage)) {
      setPageNo(pageNo + 1);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      axios
        .post("http://localhost:5000/user-genres", { email: user.email })
        .then((response) => {
          setUserGenres(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user genres:", error);
        });
    }

    axios
      .get("http://localhost:5000/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  const filteredMovies =
    selectedGenres.length > 0
      ? movies.filter((movie) =>
          movie.genres.some((genre) => selectedGenres.includes(genre))
        )
      : movies;

  const indexOfLastMovie = pageNo * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  return (
    <div className="p-10">
      <div className="text-5xl font-bold text-center mb-8">Movies</div>
      <div className="flex flex-wrap gap-10 justify-evenly">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie, index) => (
            <Card key={index} movie={movie} userEmail={userEmail} />
          ))
        ) : (
          <div>No movies available for the selected genres.</div>
        )}
      </div>
      <Pagination prevPage={prevPage} nextPage={nextPage} pageNo={pageNo} />
    </div>
  );
};

export default Movies;

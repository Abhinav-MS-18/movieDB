import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Moviecard"; // Adjust import according to your structure
import Pagination from "./Pagination"; // Adjust import according to your structure

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [userGenres, setUserGenres] = useState([]); // To store the user's selected genres
  const [pageNo, setPageNo] = useState(1);
  const moviesPerPage = 30; // Set the number of movies per page to 30

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
    // Fetch the user's genres from the backend
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      axios
        .post("http://localhost:5000/user-genres", { email: user.email })
        .then((response) => {
          setUserGenres(response.data); // Set the user's genres
        })
        .catch((error) => {
          console.error("Error fetching user genres:", error);
        });
    }

    // Fetch all movies
    axios
      .get("http://localhost:5000/movies")
      .then((response) => {
        setMovies(response.data); // Store all movies
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  // Filter movies based on user's genres
  const filteredMovies =
    userGenres.length > 0
      ? movies.filter((movie) =>
          movie.genres.some((genre) => userGenres.includes(genre))
        )
      : movies;

  // Calculate the movies to display based on the current page
  const indexOfLastMovie = pageNo * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div className="p-10">
      <div className="text-5xl font-bold text-center mb-8">Movies</div>

      <div className="flex flex-wrap gap-10 justify-evenly">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie, index) => (
            <Card
              key={index}
              movieName={movie.title}
              moviePoster={movie.poster_url}
            />
          ))
        ) : (
          <div>No movies available for the selected genres.</div> // Fallback UI if no movies
        )}
      </div>

      <Pagination prevPage={prevPage} nextPage={nextPage} pageNo={pageNo} />
    </div>
  );
};

export default Movies;

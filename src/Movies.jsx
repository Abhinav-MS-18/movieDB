import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Moviecard";
import Pagination from "./Pagination";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const moviesPerPage = 30; // Set the number of movies per page to 30

  const prevPage = () => {
    if (pageNo !== 1) {
      setPageNo(pageNo - 1);
    }
  };

  const nextPage = () => {
    if (pageNo < Math.ceil(movies.length / moviesPerPage)) {
      setPageNo(pageNo + 1);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  // Calculate the movies to display based on current page
  const indexOfLastMovie = pageNo * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <>
      <div className="p-10">
        <div className="text-5xl font-bold text-center mb-8">Movies</div>
        <div className="flex flex-wrap gap-10 justify-evenly">
          {currentMovies.map((movie, index) => (
            <Card
              key={index}
              movieName={movie.title}
              moviePoster={movie.poster_url}
            />
          ))}
        </div>
        <Pagination prevPage={prevPage} nextPage={nextPage} pageNo={pageNo} />
      </div>
    </>
  );
};

export default Movies;

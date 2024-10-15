import React from "react";

const Card = ({ movieName, moviePoster }) => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${moviePoster})`,
        }}
        className="h-[50vh] w-[40vh] rounded-xl bg-cover bg-center hover:scale-105 duration-300 flex items-end flex-row justify-between"
      >
        <div className="text-xl text-white bg-gray-900/60 text-center w-full p-2 rounded-b-xl">
          {movieName}
        </div>
      </div>
    </>
  );
};

export default Card;

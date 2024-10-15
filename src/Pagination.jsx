import React from "react";

function Pagination({ prevPage, nextPage, pageNo }) {
  return (
    <div className="flex justify-center text-2xl bg-gray-800/60 mt-5 p-3">
      <div
        onClick={prevPage}
        className="px-10 hover:cursor-pointer hover:scale-150 duration-200"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </div>
      <div className="font-bold">{pageNo}</div>
      <div
        onClick={nextPage}
        className="px-10 hover:cursor-pointer hover:scale-150 duration-200"
      >
        <i className="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  );
}

export default Pagination;

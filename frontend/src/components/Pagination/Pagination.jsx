import { useState, useEffect } from "react";
import "./Pagination.scss";

const Pagination = ({ page, pages, method }) => {
  const [pageValue, setPageValue] = useState(page ? page : "");

  const askPage = (e) => {
    setPageValue(e.target.value);
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      method(e.target.value);
    }, 1000);
  };

  return (
    <div className="pagination mb-5 positon-absolute justify-content-center align-items-center d-flex ">
      <button
        disabled={page === 1 ? true : false}
        className="prev button d-flex justify-content-center align-items-center shadow-sm mx-2"
      >
        <span className="material-symbols-outlined m-2">arrow_back_ios</span>
      </button>
      <div className="current d-flex align-items-center shadow-sm p-2 mx-2">
        <input
          type="text"
          className="current-page text-center"
          value={pageValue}
          onChange={askPage}
        />
        <p className="m-0 ps-2">/ {pages}</p>
      </div>
      <button
        className="next button d-flex justify-content-center align-items-center shadow-sm mx-2"
        disabled={page === pages ? true : false}
      >
        <span className="material-symbols-outlined m-2">arrow_forward_ios</span>
      </button>
    </div>
  );
};

export default Pagination;

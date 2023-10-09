import "./Pagination.scss";

const Pagination = () => {
  return (
    <div className="pagination mb-5 positon-absolute justify-content-center align-items-center d-flex ">
      <div className="prev d-flex justify-content-center align-items-center shadow-sm mx-2">
        <span className="material-symbols-outlined m-2">arrow_back_ios</span>
      </div>
      <div className="current d-flex align-items-center shadow-sm p-2 mx-2">
        <input type="text" className="current-page" />
        <p className="m-0 ps-2">/ 5</p>
      </div>
      <div className="next d-flex justify-content-center align-items-center shadow-sm mx-2">
        <span className="material-symbols-outlined m-2">arrow_forward_ios</span>
      </div>
    </div>
  );
};

export default Pagination;

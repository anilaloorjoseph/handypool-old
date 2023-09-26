import "./Header.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import Work from "../Work/Work";

const Header = ({ handleShow }) => {
  const [work, setWork] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);

  const switchPopup = () => {
    setWork(!work);
  };

  return (
    <>
      <div className="header w-100 d-flex justify-content-between position-absolute p-3">
        {userInfo && handleShow && (
          <div className="lines" onClick={handleShow}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        )}
        <div className="brand">
          <img src={logo} className="logo" />
        </div>
        <div className="button-group d-flex align-items-center">
          {!userInfo && location.pathname == "/" && (
            <a className="me-4" onClick={() => navigate("/login")}>
              Login
            </a>
          )}
          {userInfo === null || userInfo?.isWorker === false ? (
            <button
              className="button button-submit shadow me-2"
              onClick={switchPopup}
            >
              POST A WORK
            </button>
          ) : null}
        </div>
      </div>
      {work && <Work switchPopup={switchPopup} />}
    </>
  );
};

export default Header;

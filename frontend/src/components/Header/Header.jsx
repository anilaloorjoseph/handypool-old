import "./Header.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import WorkPost from "../WorkPost/WorkPost";

const Header = ({ handleShow }) => {
  const [work, setWork] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);

  const switchPopup = () => {
    setWork(!work);
    document.body.style.overflow = work === false ? "hidden" : "auto";
  };

  return (
    <>
      <div className="header w-100 d-flex justify-content-between p-3">
        {userInfo && handleShow && (
          <div className="lines" onClick={handleShow}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        )}
        <div className="brand">
          <a className="me-4" onClick={() => navigate("/")}>
            <img src={logo} className="logo" />
          </a>
        </div>
        <div className="button-group d-flex align-items-center">
          {!userInfo && location.pathname == "/" && (
            <a className="me-4 d-flex" onClick={() => navigate("/login")}>
              <span className="material-symbols-outlined pe-1">login</span>Login
            </a>
          )}
          {userInfo && location.pathname == "/" && (
            <a
              className="me-4 d-flex"
              onClick={() =>
                userInfo.isWorker
                  ? navigate("/worker/profile")
                  : navigate("/customer/profile")
              }
            >
              <span className="material-symbols-outlined pe-1">person</span>
              Account
            </a>
          )}
          {userInfo === null || userInfo?.isWorker === false ? (
            <button
              className="button shadow me-2 d-flex align-items-center"
              onClick={switchPopup}
            >
              POST A WORK
            </button>
          ) : null}
        </div>
      </div>
      {work && <WorkPost switchPopup={switchPopup} />}
    </>
  );
};

export default Header;

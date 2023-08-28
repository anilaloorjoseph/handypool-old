import "./Header.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = ({ handleShow }) => {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
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
          {!userInfo && (
            <button
              className="button  shadow-sm me-2"
              onClick={() => navigate("/login")}
            >
              login / register
            </button>
          )}
          {userInfo === null || userInfo?.isWorker === false ? (
            <button className="button button-submit shadow me-2">
              POST A WORK
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Header;

import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useEffect, useState } from "react";
import SideNav from "./components/SideNav/SideNav";
import { useSelector } from "react-redux";
import Nav from "./components/Nav/Nav";

function App() {
  const [show, setShow] = useState(false);
  const [aboveTabScreen, setAboveTabScreen] = useState(() =>
    window.innerWidth > 768 ? true : false
  );

  const { userInfo } = useSelector((state) => state.auth);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resizeWindow = () => {
    setAboveTabScreen(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeWindow);
    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, [aboveTabScreen]);

  return (
    <div className="app">
      <Header handleShow={!aboveTabScreen && handleShow} />
      <ToastContainer position="top-center" draggable />

      {!aboveTabScreen && userInfo && (
        <SideNav show={show} handleClose={handleClose} />
      )}
      <div className="d-flex">
        {userInfo && aboveTabScreen && <Nav />}
        <Container fluid="md" className="full-height">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}

export default App;

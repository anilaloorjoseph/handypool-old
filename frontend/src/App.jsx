import Header from "./components/Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useEffect, useState } from "react";
import SideNav from "./components/SideNav/SideNav";
import { useSelector } from "react-redux";
import Nav from "./components/Nav/Nav";

function App({ socket }) {
  const [show, setShow] = useState(false);
  const [aboveTabScreen, setAboveTabScreen] = useState(() =>
    window.innerWidth > 768 ? true : false
  );

  const location = useLocation();

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
        <SideNav socket={socket} show={show} handleClose={handleClose} />
      )}
      <div className="d-flex">
        {userInfo && aboveTabScreen && location.pathname != "/" && (
          <div className="nav-wrapper me-5">
            <Nav socket={socket} />
          </div>
        )}
        <div className="full-screen">
          {location.pathname == "/" ? (
            <Outlet />
          ) : (
            <Container fluid="md">
              <Row>
                <Col md={{ span: 8, offset: 2 }} className="p-0">
                  <Outlet />
                </Col>
              </Row>
            </Container>
          )}
        </div>
      </div>

      {location.pathname == "/" && <footer></footer>}
    </div>
  );
}

export default App;

import Header from "./components/Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useEffect, useRef, useState } from "react";
import SideNav from "./components/SideNav/SideNav";
import { useSelector } from "react-redux";
import Nav from "./components/Nav/Nav";
import io from "socket.io-client";
import { eventRefetchWorks } from "./slices/socketEventsSlice";
import { useDispatch } from "react-redux";

function App() {
  const [show, setShow] = useState(false);
  const socket = useRef();
  const [aboveTabScreen, setAboveTabScreen] = useState(() =>
    window.innerWidth > 768 ? true : false
  );

  const location = useLocation();
  const dispatch = useDispatch();

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

  // socket io notifications
  useEffect(() => {
    socket.current = io.connect("http://localhost:5000");
    // socket.current.on("connect", () => {
    //   console.log(socket.current.id);
    // });
    const closeWindow = () => {
      if (socket.current) {
        socket.current.emit("disconnect_worker");
      }
    };
    window.addEventListener("beforeunload", closeWindow);
    return () => {
      socket.current.disconnect();
      window.removeEventListener("beforeunload", closeWindow);
    };
  }, []);

  useEffect(() => {
    socket.current.on("worker_notification_fetch_works", (data) => {
      dispatch(eventRefetchWorks(true));
      toast.info(data);
    });

    if (userInfo?.isWorker) {
      socket.current.emit("worker_connected", userInfo._id);
    }
    if (!userInfo?.isWorker) {
      socket.current.emit("customer_connected", userInfo._id);
    }
  }, [userInfo]);

  return (
    <div className="app">
      <Header handleShow={!aboveTabScreen && handleShow} />
      <ToastContainer position="top-center" draggable />

      {!aboveTabScreen && userInfo && (
        <SideNav
          socket={socket.current}
          show={show}
          handleClose={handleClose}
        />
      )}
      <div className="d-flex">
        {userInfo && aboveTabScreen && location.pathname != "/" && (
          <div className="nav-wrapper me-5">
            <Nav socket={socket.current} />
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

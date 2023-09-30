import Offcanvas from "react-bootstrap/Offcanvas";
import "./SideNav.scss";
import Nav from "../Nav/Nav";

function SideNav({ show, handleClose }) {
  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideNav;

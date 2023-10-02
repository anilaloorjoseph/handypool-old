import { Container, Row, Col } from "react-bootstrap";
import "./HomeScreen.scss";
import workertools from "../assets/images/workertools.jpg";
import bulb from "../assets/images/bulb.svg";

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <div className="banner mb-5 d-flex flex-column justify-content-center align-items-center text-center">
        <div className="banner-content">
          <h1 className="text-large">
            Welcome to Handypool where
            <br /> Skills Meet Needs!
          </h1>
          <button className="button button-inverse mx-auto d-block shadow">
            Let's find
          </button>
          <div className="scroll-animation">
            <div className="water-drop"></div>
            <div className="water-drop"></div>
            <div className="water-drop"></div>
          </div>
        </div>
      </div>

      <div className="what-we-offer py-5">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={{ span: 5, offset: 1 }} className="mb-2">
              <h4 className="pb-4">What we offer</h4>
              <p className="pb-2">
                We offer a seamless solution for your handyman needs, utilizing
                advanced algorithms to match you with available professionals
                based on your specific requirements. Our extensive network of
                skilled handymen covers a wide range of services, and our
                user-friendly app allows you to find and book the perfect match
                quickly
              </p>
              <p className="pb-2">
                With detailed handyman profiles, real-time availability, and
                customer ratings, you can confidently choose the right expert
                for your project. We're dedicated to simplifying your home
                improvement experience, ensuring convenience, reliability, and
                satisfaction with every job
              </p>
            </Col>
            <Col md={{ span: 5 }} className="mb-2">
              <img src={workertools} alt="image" />
            </Col>
          </Row>
        </Container>
      </div>
      <div className="benefits py-5">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={{ span: 5, offset: 1 }} className="mb-2">
              <img src={bulb} className="contain" alt="image" />
            </Col>
            <Col md={{ span: 5 }} className="mb-2">
              <h4 className="pb-4">Benefits</h4>

              <ul>
                <li className="pb-4">
                  Discover the power of simplicity. Find a trusted handyman or
                  clients effortlessly with our app, where convenience meets
                  quality.
                </li>
                <li className="pb-4">
                  Experience efficiency like never before. For handymen, unlock
                  a world of opportunities. For customers, say goodbye to home
                  repair hassles
                </li>
                <li className="pb-4">
                  Experience the allure of choice. Bid on your projects and
                  handpick the perfect handyman, where excellence meets
                  affordability
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="how-it-works py-5">
        <Container>
          <h4 className="pb-4 text-center">How it works !</h4>
          <Row>
            <Col sm={3} className="d-flex flex-column align-items-center mb-5">
              <span className="material-symbols-outlined">
                app_registration
              </span>
              <small className="py-2 text-center">Register as customer</small>
            </Col>
            <Col sm={3} className="d-flex flex-column align-items-center mb-5">
              <span className="material-symbols-outlined">post_add</span>
              <small className="py-2 text-center">Post your work</small>
            </Col>
            <Col sm={3} className="d-flex flex-column align-items-center mb-5">
              <span className="material-symbols-outlined">conditions</span>
              <small className="py-2 text-center">Choose best worker</small>
            </Col>
            <Col sm={3} className="d-flex flex-column align-items-center mb-5">
              <span className="material-symbols-outlined">
                connect_without_contact
              </span>
              <small className="py-2 text-center">Contact the worker</small>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="footer-top"></div>
    </div>
  );
};

export default HomeScreen;

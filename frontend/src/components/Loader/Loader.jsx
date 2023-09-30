import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div
      className="loader"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "0",
        left: "0",
        zIndex: "1000",
        backgroundColor: "rgb(233, 255, 224, 0.3)",
        display: "flex",
        alignContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <Spinner
        animation="grow"
        role="status"
        style={{
          width: "50px",
          height: "50px",
          margin: "auto",
          display: "block",
          backgroundColor: "rgb(0, 132, 255)",
        }}
      ></Spinner>
    </div>
  );
};

export default Loader;

import CloseButton from "react-bootstrap/CloseButton";
import "./ViewImage.scss";

const ViewImage = ({ image, showImage }) => {
  return (
    <div className="popup d-flex justify-content-center p-5">
      <div className="window">
        <CloseButton onClick={() => showImage((image = ""))} />
        <img src={image} alt="404 Not Found!" />
      </div>
    </div>
  );
};

export default ViewImage;

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "./WorkCard.scss";
import ViewImage from "../VIewImage/ViewImage";

const WorkCard = ({ workDetails, isRead, customer }) => {
  const [price, setPrice] = useState();
  const [workId, setWorkId] = useState();
  const [showDescription, setShowDescription] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [imageToView, setImageToView] = useState();

  const sendPrice = (e) => {
    e.preventDefault();
    if (price) {
    }
  };

  const showImage = (image) => {
    setViewImage(!viewImage);
    image ? setImageToView(image) : setImageToView();
  };

  return (
    <div
      className={`work-card mb-3 p-4 shadow-sm  d-flex justify-content-center align-items-center ${
        isRead ? "read" : "not-read"
      }`}
    >
      <div className="card-content">
        <h4 className="mb-0">{workDetails.workTitle}</h4>
        <span>{customer && customer}</span>
        <div className="locations d-flex justify-content-end">
          <small className="p-1">{workDetails.pincode}</small>
        </div>

        <div className="work-description my-2 p-2 hide-text">
          <div
            className="work-description-header d-flex justify-content-between align-items-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowDescription(!showDescription);
            }}
          >
            <h6>Work Description</h6>
            <button className="button button-expand d-flex align-items-center">
              <span className="material-symbols-outlined">
                {showDescription ? "expand_less" : "expand_more"}
              </span>
            </button>
          </div>
          {showDescription && workDetails.workDescription}
        </div>
        <div className="work-images d-flex justify-content-between">
          {workDetails.images &&
            workDetails.images.map((image, key) => {
              return image ? (
                <img
                  src={image}
                  alt="images"
                  key={key}
                  onClick={() => showImage(image)}
                />
              ) : (
                <div
                  className="no-image d-flex justify-content-center align-items-center"
                  key={key}
                >
                  <span className="material-symbols-outlined">
                    image_not_supported
                  </span>
                </div>
              );
            })}
        </div>
        <hr />
        <div className="d-flex align-items-center">
          <p className="work-expiration p-1 w-50 me-1 ms-0 my-0 text-center">
            Expires at :
            {workDetails.expirationDate
              ? new Date(workDetails.expirationDate).toLocaleDateString()
              : "##/##/####"}
          </p>
          <Form onSubmit={sendPrice} className="w-50">
            <div className="d-flex">
              <Form.Control
                type="number"
                className="me-2"
                placeholder="price"
                min="0"
                onChange={(e) => setPrice(e.target.value)}
              />
              <button type="submit" className="button-add button shadow">
                send
              </button>
            </div>
          </Form>
          {viewImage && <ViewImage showImage={showImage} image={imageToView} />}
        </div>
      </div>
    </div>
  );
};

export default WorkCard;

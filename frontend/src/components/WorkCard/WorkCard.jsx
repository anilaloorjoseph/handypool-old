import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "./WorkCard.scss";
import ViewImage from "../VIewImage/ViewImage";
import { useSendPriceMutation } from "../../slices/priceApiSlice";
import { toast } from "react-toastify";

const WorkCard = ({ work, isRead, customer }) => {
  const [price, setPrice] = useState();
  const [workId, setWorkId] = useState();
  const [details, setDetails] = useState();
  const [showDescription, setShowDescription] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [imageToView, setImageToView] = useState();
  const [showWorkResponse, setShowWorkResponse] = useState(false);

  const expirationTime = new Date(work.expirationDate).getTime();
  const isExpired = expirationTime <= Date.now();
  const expirationClass = isExpired
    ? "work-expiration-expired"
    : "work-expiration";

  const [sendPrice, { isloading }] = useSendPriceMutation();

  const pricing = async (e) => {
    e.preventDefault();
    if (workId && price && !isExpired) {
      const res = await sendPrice({ workId, price, details });
      res && toast.success(res);
    }
  };

  const showImage = (image) => {
    setViewImage(!viewImage);
    image ? setImageToView(image) : setImageToView();
  };

  useEffect(() => {
    setWorkId(work._id);
  }, [work]);

  return (
    <div
      className={`work-card mb-3 p-4 shadow-sm  d-flex justify-content-center align-items-center ${
        isRead ? "read" : "not-read"
      }`}
    >
      <div className="card-content">
        <h4 className="mb-0">{work.workTitle}</h4>
        <span>{customer && customer}</span>
        <div className="locations d-flex justify-content-between">
          <p className={`${expirationClass} py-1 ms-0 my-0 px-2 text-center`}>
            {/* checking expiration date is over or not. if it is not over, it will show */}
            {work.expirationDate
              ? isExpired
                ? "Expired"
                : `Expires on${new Date(expirationTime).toLocaleDateString()}`
              : "Expired"}
          </p>

          <small className="p-1">{work.pincode}</small>
        </div>

        <div className="work-description my-2 py-2 hide-text">
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
          {showDescription && work.workDescription}
        </div>
        <div className="work-images d-flex justify-content-between">
          {work.images &&
            work.images.map((image, key) => {
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

        {!isExpired && (
          <>
            <hr />
            {!showWorkResponse && (
              <div
                className="show-work-response button w-100 text-center"
                onClick={() => setShowWorkResponse(true)}
              >
                Send Response
              </div>
            )}
            {showWorkResponse && (
              <div className="work-response d-flex align-items-center">
                <Form onSubmit={pricing} className="w-100 p-2">
                  <Form.Control
                    type="number"
                    className="my-2"
                    placeholder="price"
                    min="0"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <Form.Control
                    as="textarea"
                    placeholder="Details..."
                    className="my-2"
                    value={details}
                    style={{ height: "100px" }}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="button-add button shadow ms-auto d-block"
                  >
                    send
                  </button>
                </Form>
                {viewImage && (
                  <ViewImage showImage={showImage} image={imageToView} />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkCard;

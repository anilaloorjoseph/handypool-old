import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "./WorkCard.scss";

const WorkCard = ({ workDetails }) => {
  const [price, setPrice] = useState();
  const [workId, setWorkId] = useState();

  const sendPrice = (e) => {
    e.preventDefault();
    if (price) {
    }
  };

  useEffect(() => {
    setWorkId(workDetails.workId);
  }, [workDetails]);

  return (
    <div className="work-card mb-3 p-4 shadow-sm  d-flex justify-content-center align-items-center">
      <div className="card-content">
        <h4 className="mb-2">{workDetails.workTitle}</h4>

        <div className="locations">
          <small className="p-1">{workDetails.pincode}</small>
        </div>
        <p className="work-description my-2 py-2 text-limited-3l">
          {workDetails.workDescription}
        </p>
        <div className="work-images d-flex justify-content-between">
          {workDetails.images &&
            workDetails.images.map((image, key) => {
              return image ? (
                <img src={image} alt="images" key={key} />
              ) : (
                <div className="no-image d-flex justify-content-center align-items-center">
                  <span class="material-symbols-outlined">
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
        </div>
      </div>
    </div>
  );
};

export default WorkCard;

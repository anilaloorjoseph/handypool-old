import { useState } from "react";
import { Container } from "react-bootstrap";
import DeletePopup from "../../components/Popup/DeletePopup/DeletePopup";

const WorkerSettingsScreen = () => {
  const [popup, setPopup] = useState(false);

  const switchPopup = () => {
    setPopup(!popup);
  };

  return (
    <Container>
      <div className="form-box mt-4 p-4 shadow">
        <div className="d-flex justify-content-between align-items-center">
          <h6>Delete Account ?</h6>
          <button
            className="button button-delete shadow"
            type="button"
            onClick={switchPopup}
          >
            Delete
          </button>
        </div>
        {popup && <DeletePopup switchPopup={switchPopup} />}
        <hr />
      </div>
    </Container>
  );
};

export default WorkerSettingsScreen;

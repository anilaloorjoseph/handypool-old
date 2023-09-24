import { useState } from "react";
import { Container } from "react-bootstrap";
import DeletePopup from "../../components/DeletePopup/DeletePopup";

const CustomerSettingsScreen = () => {
  const [popup, setPopup] = useState(false);

  const switchPopup = () => {
    setPopup(!popup);
  };

  return (
    <Container>
      <div className="p-4">
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

export default CustomerSettingsScreen;

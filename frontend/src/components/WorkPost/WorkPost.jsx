import { useState, useEffect } from "react";
import { Form, CloseButton } from "react-bootstrap";
import { useWorkTypesQuery } from "../../slices/autoloadApiSlice";
import { useWorkPostMutation } from "../../slices/workApiSlice";
import { useSelector } from "react-redux";
import "./WorkPost.scss";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { validatePincode } from "../../utilities/validate";

const Work = ({ switchPopup }) => {
  const [workTitle, setWorkTitle] = useState();
  const [workDescription, setWorkDescription] = useState();
  const [workType, setWorkType] = useState();
  const [workTypes, setWorkTypes] = useState();
  const [pincode, setPincode] = useState();
  const [expirationDate, setExpirationDate] = useState();
  const [workImage1, setWorkImage1] = useState();
  const [workImage2, setWorkImage2] = useState();
  const [workImage3, setWorkImage3] = useState();
  const [workImage4, setWorkImage4] = useState();
  const [minDate, setMindDate] = useState();

  const { userInfo } = useSelector((state) => state.auth);

  const { data, isFetching, isLoading, error } = useWorkTypesQuery();
  const [workPost, { isLoading: loadingWorkPost }] = useWorkPostMutation();

  const sendWork = async (e) => {
    e.preventDefault();

    // Check if the user is not a worker and all required fields are provided
    if (!userInfo || userInfo.isWorker) {
      toast.warn("Please login as a customer");
      return;
    }

    if (
      !workTitle ||
      !workDescription ||
      !workType ||
      !pincode ||
      !expirationDate
    ) {
      toast.error("All * fields are mandatory");
      return;
    }

    // Validate the pincode
    if (validatePincode(pincode) === false) {
      toast.error("Please check your pincode!");
      return;
    }

    // Create a FormData object and append the data
    const formData = new FormData();
    formData.append("workTitle", workTitle);
    formData.append("workDescription", workDescription);
    formData.append("workType", workType);
    formData.append("pincode", pincode);
    formData.append("expirationDate", expirationDate);
    formData.append("workImage1", workImage1);
    formData.append("workImage2", workImage2);
    formData.append("workImage3", workImage3);
    formData.append("workImage4", workImage4);

    try {
      // Send the formData using the 'work' function and handle the response
      const res = await workPost(formData).unwrap();
      toast.info("Work has been posted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const updateDate = () => {
    const offsetHours = 5; // Your timezone offset hours (+5)
    const offsetMinutes = 30; // Your timezone offset minutes (+30)

    const isoString = new Date().toISOString();
    const adjustedDate = new Date(isoString);
    adjustedDate.setHours(
      adjustedDate.getHours() + offsetHours,
      adjustedDate.getMinutes() + offsetMinutes
    );
    setMindDate(adjustedDate.toISOString().split("T")[0]);
  };

  useEffect(() => {
    if (data) {
      setWorkTypes(data);
    }
  }, [data]);

  return loadingWorkPost || isLoading ? (
    <Loader />
  ) : (
    <div className="popup-work d-flex justify-content-center">
      <div className="window-work p-4 m-4 shadow-lg">
        <div className="d-flex justify-content-between w-100 ">
          <h4>Post Your Work</h4>
          <CloseButton className="ms-2" onClick={switchPopup} />
        </div>
        <Form onSubmit={sendWork}>
          <Form.Group className="my-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Work title"
              onChange={(e) => setWorkTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3" controlId="formTextArea">
            <Form.Control
              as="textarea"
              placeholder="Work Description"
              style={{ height: "100px" }}
              onChange={(e) => setWorkDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="select1">
            <Form.Select onChange={(e) => setWorkType(e.target.value)}>
              <option value="">Choose type of work</option>
              {workTypes &&
                workTypes.map(({ _id, type }, key) => {
                  return (
                    <option key={key} value={_id}>
                      {type}
                    </option>
                  );
                })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formElement5">
            <Form.Control
              type="number"
              placeholder="Pincode"
              min="0"
              onChange={(e) => setPincode(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-3" controlId="formBasicEmail">
            <label>Expiration Date</label>
            <Form.Control
              type="date"
              min={minDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              onClick={updateDate}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formElement8">
            <p className="fwt-bold text-center">Photos </p>
            <div className="image-section">
              <label>Image 1 (Optional)</label>
              <div className="d-flex">
                <Form.Control
                  type="file"
                  onChange={(e) => setWorkImage1(e.target.files[0])}
                />
                {workImage1 && (
                  <img
                    src={URL.createObjectURL(workImage1)}
                    className="temp-image"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                  />
                )}
              </div>
            </div>
            <div className="image-section">
              <label>Image 2 (Optional)</label>
              <div className="d-flex">
                <Form.Control
                  type="file"
                  onChange={(e) => setWorkImage2(e.target.files[0])}
                />
                {workImage2 && (
                  <img
                    src={URL.createObjectURL(workImage2)}
                    className="temp-image"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                  />
                )}
              </div>
            </div>
            <div className="image-section">
              <label>Image 3 (Optional)</label>
              <div className="d-flex">
                <Form.Control
                  type="file"
                  onChange={(e) => setWorkImage3(e.target.files[0])}
                />
                {workImage3 && (
                  <img
                    src={URL.createObjectURL(workImage3)}
                    className="temp-image"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                  />
                )}
              </div>
            </div>
            <div className="image-section">
              <label>Image 4 (Optional)</label>
              <div className="d-flex">
                <Form.Control
                  type="file"
                  onChange={(e) => setWorkImage4(e.target.files[0])}
                />
                {workImage4 && (
                  <img
                    src={URL.createObjectURL(workImage4)}
                    className="temp-image"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                  />
                )}
              </div>
            </div>
          </Form.Group>

          <div className="w-100 d-flex justify-content-end  align-items-baseline">
            <button className="button shadow" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Work;

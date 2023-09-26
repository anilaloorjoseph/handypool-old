import { useEffect, useState } from "react";
import {
  useProfileWorkerQuery,
  useUpdateWorkerMutation,
} from "../../slices/workerApiSlice";
import { useWorkTypesQuery } from "../../slices/autoloadApiSlice";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  CloseButton,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import {
  validateEmail,
  validatePhone,
  validatePincode,
} from "../../utilities/validate";
import { reduceSizeProfileImage } from "../../utilities/imageCompresser";

const WorkerProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workerImage, setWorkerImage] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState();
  const [workType, setWorkType] = useState("");
  const [workTypes, setWorkTypes] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const dispatch = useDispatch();

  const { data, isFetching, isLoading, error } = useProfileWorkerQuery();
  const {
    data: dataWorkTypes,
    isFetching: fetchingWorkTypes,
    isLoading: loadingWorkTypes,
    error: errorWorkTypes,
  } = useWorkTypesQuery();

  const [updateWorker, { isLoading: updatingWorker }] =
    useUpdateWorkerMutation();

  const submitWorkerUpdate = async (e) => {
    e.preventDefault();
    if (email && validateEmail(email) === false) {
      toast.error("Check you email!");
      return false;
    }
    if (!workType) {
      toast.error("Please set work type");
      return false;
    }
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast.error("Password and Confirm Password should be same!");
        return false;
      }
      if (password.length < 8) {
        toast.error("Password should be 8 characters!");
        return false;
      }
    }
    if (phone && validatePhone(phone) === false) {
      toast.error("Please check your phone number");
      return false;
    }
    if (workerImage) {
      let image = await reduceSizeProfileImage(workerImage);
      setWorkerImage(image);
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("workerImage", workerImage);
    formData.append("locations", JSON.stringify(locations));
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("aboutMe", aboutMe);

    try {
      const res = await updateWorker(formData).unwrap();
      toast.info("Your data has been updated");

      dispatch(setCredentials({ ...res }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addToLocations = () => {
    if (location && validatePincode(location)) {
      if (locations.includes(location)) {
        toast.warn("Pincode has added already!");
        return false;
      }
      setLocations((prevArray) => [...prevArray, location]);
    } else {
      toast.warn("please check you location!");
    }
  };

  const deleteLocation = (index) => {
    const updatedLocations = locations.filter((location, i) => i !== index);
    setLocations(updatedLocations);
  };

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setLocations(data.locations || []);
      setPhone(data.phone || "");
      setWorkType(data.workType || "");
      setAboutMe(data.aboutMe || "");
    }
    if (dataWorkTypes) {
      setWorkTypes(dataWorkTypes);
    }
  }, [data, dataWorkTypes]);

  return isLoading || updatingWorker ? (
    <Loader />
  ) : (
    <div className="p-4">
      <Form onSubmit={submitWorkerUpdate}>
        <Container fluid>
          <Row>
            <Col md={12}>
              <div className="form-box p-4 shadow">
                <h2 className="ps-2 text-center">Profile</h2>
                <h5 className="mb-3">Personal Information</h5>
                <Form.Group className="mb-3" controlId="formElement1">
                  <label>Name</label>
                  <Form.Control
                    type="text"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formElement2">
                  <label>Email</label>
                  <Form.Control
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formElement3">
                  <label>Password</label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formElement4">
                  <label>Confirm Password</label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formElement6">
                  <label>Phone</label>
                  <Form.Control
                    type="text"
                    value={phone}
                    placeholder="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formElement8">
                  <label>Image</label>
                  <div className="d-flex">
                    <Form.Control
                      type="file"
                      placeholder="Profile Image"
                      onChange={(e) => setWorkerImage(e.target.files[0])}
                      className="image-upload"
                    />
                    {workerImage && (
                      <img
                        src={URL.createObjectURL(workerImage)}
                        className="temp-image"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                      />
                    )}
                  </div>
                </Form.Group>
                <hr />
                <h5 className="mb-3">Work Information</h5>
                <Form.Group className="mb-3" controlId="formElement7">
                  <label>Type of work</label>
                  <Form.Select value={workType} disabled>
                    <option>Choose type of worker</option>
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
                  <label>Locations (PINCODES)</label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={location}
                      placeholder="Location"
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <button
                      id="button-addon2"
                      type="button"
                      onClick={addToLocations}
                    >
                      Add
                    </button>
                  </InputGroup>
                  {locations && (
                    <div className="locations">
                      {locations.map((value, index) => {
                        return (
                          <small
                            className="locations d-flex justify-content-between aling-items-center p-2 m-1"
                            key={index}
                          >
                            {value}{" "}
                            <CloseButton
                              className="ms-2"
                              onClick={() => deleteLocation(index)}
                            />
                          </small>
                        );
                      })}
                    </div>
                  )}
                </Form.Group>

                <label>About Me</label>
                <Form.Control
                  as="textarea"
                  placeholder="About me ..."
                  value={aboutMe}
                  style={{ height: "100px" }}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
                <div className="w-100 mt-3">
                  <button
                    type="submit"
                    className="button shadow d-block mx-auto"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Form>
    </div>
  );
};

export default WorkerProfileScreen;

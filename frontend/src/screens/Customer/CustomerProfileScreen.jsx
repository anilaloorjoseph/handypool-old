import { useEffect, useState } from "react";
import {
  useProfileCustomerQuery,
  useUpdateCustomerMutation,
} from "../../slices/customerApiSlice";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import {
  validateEmail,
  validatePhone,
  validatePincode,
} from "../../utilities/validate";
import { reduceSizeProfileImage } from "../../utilities/imageCompresser";

const CustomerProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerImage, setCustomerImage] = useState();
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data, isFetching, isLoading, error } = useProfileCustomerQuery();
  const [updateCustomer, { isLoading: updatingCustomer }] =
    useUpdateCustomerMutation();

  const dispatch = useDispatch();

  const submitCustomerUpdate = async (e) => {
    e.preventDefault();
    if (email && validateEmail(email) === false) {
      toast.error("Check your email");
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

    if (location && validatePincode(location) === false) {
      toast.error("Please check you pincode!");
      return false;
    }

    if (phone && validatePhone(phone) === false) {
      toast.error("Please check your phone number");
      return false;
    }

    if (customerImage) {
      let image = await reduceSizeProfileImage(customerImage);
      setCustomerImage(image);
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("customerImage", customerImage);
    formData.append("location", location);
    formData.append("phone", phone);
    formData.append("password", password);

    try {
      const res = await updateCustomer(formData).unwrap();
      toast.info("Your data has been updated");

      dispatch(setCredentials({ ...res }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setLocation(data.location || "");
      setPhone(data.phone || "");
    }
  }, [data]);

  return isLoading || updatingCustomer ? (
    <Loader />
  ) : (
    <div className="p-4">
      <Form onSubmit={submitCustomerUpdate}>
        <Container>
          <Row>
            <Col xs={12} md={{ span: 6, offset: 3 }}>
              <div className="form-box mx-2 my-5 p-4  shadow-sm">
                <h2 className="ps-2 text-center">Profile</h2>
                <h5>Personal Information</h5>
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
                <Form.Group className="mb-3" controlId="formElement5">
                  <label>Location</label>
                  <Form.Control
                    type="text"
                    value={location}
                    placeholder="Location"
                    onChange={(e) => setLocation(e.target.value)}
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
                <Form.Group className="mb-3" controlId="formElement7">
                  <label>Image</label>
                  <div className="d-flex">
                    <Form.Control
                      type="file"
                      placeholder="Profile Image"
                      onChange={(e) => setCustomerImage(e.target.files[0])}
                    />
                    {customerImage && (
                      <img
                        src={URL.createObjectURL(customerImage)}
                        className="temp-image"
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                      />
                    )}
                  </div>
                </Form.Group>
                <div className="w-100">
                  <button
                    type="submit"
                    className="button shadow ms-auto d-block"
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

export default CustomerProfileScreen;

import { Form, Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterCustomerMutation } from "../../slices/customerApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { validateEmail } from "../../utilities/validate";
import registerImage from "../../assets/images/registerCustomer.jpg";

const RegisterCustomer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkBox, setCheckBox] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterCustomerMutation();

  useEffect(() => {
    if (userInfo) {
      userInfo.isWorker
        ? navigate("/worker/profile")
        : navigate("/customer/profile");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!checkBox) {
      toast.error("Please select terms and conditions");
      return false;
    }
    if (!email || !password || !confirmPassword) {
      toast.error("All fields should be filled");
      return false;
    }
    if (email && validateEmail(email) === false) {
      toast.error("Check your email");
      return false;
    }
    if (password !== confirmPassword || password.length < 8) {
      toast.error("Check you passwords");
      return false;
    } else {
      try {
        const res = await register({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/customer/profile");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="login-register mb-5 d-flex flex-column flex-sm-row align-items-stretch mt-5 shadow-lg mx-auto">
      <div className="image">
        <img src={registerImage} className="d-none d-sm-block" loading="lazy" />
      </div>
      <div className="p-3">
        <h2 className="py-2 text-center">Register</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="name1">
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password1">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Text className="text-end  fst-italic d-block text-muted">
              Passoword length minimum 8 .
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password2">
            <Form.Control
              type="password"
              placeholder=" Conform Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 mt-4 d-flex" controlId="checkbox1">
            <Form.Check
              type="checkbox"
              label="I Agree"
              onChange={(e) => setCheckBox(!checkBox)}
            />
            <p className="ps-2">
              <a href="www.google.com">Terms and Conditions</a>
            </p>
          </Form.Group>

          <Container>
            <Row className="py-3">
              <Col md={12}>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </Col>
            </Row>
          </Container>
          <div className="w-100 d-flex justify-content-end  align-items-baseline">
            <button className="button button-submit shadow" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default RegisterCustomer;

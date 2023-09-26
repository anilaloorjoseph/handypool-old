import { Form, Row, Col, Container } from "react-bootstrap";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { useLoginCustomerMutation } from "../../slices/customerApiSlice";
import { useLoginWorkerMutation } from "../../slices/workerApiSlice";
import { setCredentials } from "../../slices/authSlice";
import loginImage from "../../assets/images/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [worker, setWorker] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [loginCustomer, { isLoading: loadingCustomer }] =
    useLoginCustomerMutation();
  const [loginWorker, { isLoading: loadingWorker }] = useLoginWorkerMutation();

  useEffect(() => {
    if (userInfo) {
      userInfo.isWorker
        ? navigate("/worker/profile")
        : navigate("/customer/profile");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("enter your email and password");
      return false;
    }
    try {
      const res = worker
        ? await loginWorker({ email, password }).unwrap()
        : await loginCustomer({ email, password }).unwrap();

      dispatch(setCredentials({ ...res }));
      userInfo.isWorker
        ? navigate("/worker/profile")
        : navigate("/customer/profile");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="login-register mb-5 d-flex flex-column flex-sm-row align-items-stretch mt-5 shadow-lg mx-auto">
      <div className="image">
        <img src={loginImage} className="d-none d-sm-block" loading="lazy" />
      </div>

      <div className="p-3">
        <h2 className="py-2 text-center">Login</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Check
              type="switch"
              id="custom-switch"
              label={worker ? "Worker" : "Log in as Worker"}
              onChange={(e) => setWorker(!worker)}
            />
          </Form.Group>
          <p className="w-100">
            new customer ? <Link to="/customer/register">Register</Link>
          </p>
          <p className="w-100">
            new worker ? <Link to="/worker/register">Register</Link>
          </p>
          <div className="w-100 d-flex justify-content-end  align-items-baseline">
            <button className="button button-submit shadow" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </div>

      {loadingCustomer && <Loader />}
      {loadingWorker && <Loader />}
    </div>
  );
};

export default Login;

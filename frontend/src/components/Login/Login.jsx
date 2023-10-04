import { Form } from "react-bootstrap";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { useLoginCustomerMutation } from "../../slices/customerApiSlice";
import { useLoginWorkerMutation } from "../../slices/workerApiSlice";
import { setCredentials } from "../../slices/authSlice";

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

  return loadingCustomer || loadingWorker ? (
    <Loader />
  ) : (
    <div className="login-register mb-5 shadow-lg mx-auto p-3">
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
        <p className="w-100 m-0">
          Create Account !
          <Link className="px-1" to="/customer/register">
            Customer
          </Link>
          or
          <Link className="px-1" to="/worker/register">
            Worker
          </Link>
        </p>

        <div className="w-100 d-flex justify-content-end  align-items-baseline">
          <button className="button shadow" type="submit">
            Submit
          </button>
        </div>
      </Form>

      {loadingCustomer && <Loader />}
      {loadingWorker && <Loader />}
    </div>
  );
};

export default Login;

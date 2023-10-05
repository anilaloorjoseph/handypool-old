import { useState } from "react";
import { Form, CloseButton } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./DeletePopup.scss";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { logout } from "../../slices/authSlice";
import { useDeleteWorkerMutation } from "../../slices/workerApiSlice";
import { useDeleteCustomerMutation } from "../../slices/customerApiSlice";

const DeletePopup = ({ switchPopup }) => {
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();
  const [deleteWorker, { isLoading: deletingWorker }] =
    useDeleteWorkerMutation();

  const deleteAccount = async (e) => {
    e.preventDefault();
    if (password) {
      try {
        const res = userInfo.isWorker
          ? await deleteWorker({ password }).unwrap()
          : await deleteCustomer({ password }).unwrap();
        toast.info(res.status);
        dispatch(logout());
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } else {
      toast.warn("Please enter password!");
    }
  };

  return (
    <div className="popup d-flex justify-content-center">
      <div className="window d-flex justify-content-between shadow-lg p-4 ">
        <Form onSubmit={deleteAccount}>
          <div className="d-flex justify-content-between w-100 mb-5 pb-4">
            <h5>Delete !</h5>
            <CloseButton className="ms-2" onClick={switchPopup} />
          </div>
          <Form.Group className="mb-3" controlId="formElement1">
            <label className="text-center w-100 d-block mb-2">
              Remember ! <br />
              Account will not be recoverable once it is deleted!
            </label>
            <Form.Control
              type="password"
              placeholder="password..."
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <button
            type="submit"
            className="button button-delete mx-auto shadow d-block"
          >
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
};

export default DeletePopup;

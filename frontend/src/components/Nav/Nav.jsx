import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutCustomerMutation } from "../../slices/customerApiSlice";
import { useLogoutWorkerMutation } from "../../slices/workerApiSlice";
import { logout } from "../../slices/authSlice";
import { toast } from "react-toastify";
import "./Nav.scss";
import profile_photo from "../../assets/images/profile_photo.png";

const Nav = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [logoutCustomer, { isLoading }] = useLogoutCustomerMutation();
  const [logoutWorker, { isLoading: loadingWorker }] =
    useLogoutWorkerMutation();

  const customerLogout = async () => {
    try {
      await logoutCustomer().unwrap();
      dispatch(logout());
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const workerLogout = async () => {
    try {
      await logoutWorker().unwrap();
      dispatch(logout());
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="d-flex flex-column menu full-height">
      <div className="profile-photo d-flex w-100 flex-column align-items-center mt-3">
        <img
          src={
            userInfo.customerImage
              ? userInfo.customerImage
              : userInfo.workerImage
              ? userInfo.workerImage
              : profile_photo
          }
          alt="profile_photo"
          loading="lazy"
        />
        {userInfo.name && (
          <h5 className="mt-2">
            {userInfo?.name.charAt(0).toUpperCase() + userInfo?.name.slice(1)}
          </h5>
        )}
      </div>
      <ul className=" p-0 main-nav">
        <li>
          {userInfo.isWorker ? (
            <Link to="/worker/profile">Profile</Link>
          ) : (
            <Link to="/customer/profile">Profile</Link>
          )}
        </li>
        <li>
          {userInfo.isWorker ? (
            <Link to="/worker/settings">Settings</Link>
          ) : (
            <Link to="/customer/settings">Settings</Link>
          )}
        </li>
        <li>
          {userInfo.isWorker ? (
            <Link to="/worker/work/requests">Requests</Link>
          ) : (
            <Link to="/customer/work/responses">Responses</Link>
          )}
        </li>

        <li>
          {userInfo.isWorker ? (
            <Link to="" onClick={workerLogout}>
              Logout
            </Link>
          ) : (
            <Link to="" onClick={customerLogout}>
              Logout
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Nav;

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutCustomerMutation } from "../../slices/customerApiSlice";
import { useLogoutWorkerMutation } from "../../slices/workerApiSlice";
import { useGetNoOfNewWorksQuery } from "../../slices/workApiSlice";
import { logout } from "../../slices/authSlice";
import { toast } from "react-toastify";
import "./Nav.scss";
import profile_photo from "../../assets/images/profile_photo.png";

const Nav = ({ socket }) => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [logoutCustomer, { isLoading }] = useLogoutCustomerMutation();
  const [logoutWorker, { isLoading: loadingWorker }] =
    useLogoutWorkerMutation();

  const {
    data: newNoOfWorks,
    isFetching,
    isLoading: isLoadingNewNoOfWorks,
    error,
  } = useGetNoOfNewWorksQuery(undefined, {
    skip: userInfo.isWorker ? false : true,
  });

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
      socket.emit("disconnect_worker");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="d-flex flex-column menu full-height pt-5">
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
            <Link to="/worker/works">
              Works
              {newNoOfWorks > 0 && (
                <span className="notification ms-2">{newNoOfWorks}</span>
              )}
            </Link>
          ) : (
            <Link to="/customer/posts">Posted Works</Link>
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

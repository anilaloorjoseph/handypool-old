import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function CustomerPrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo?.isWorker === false ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default CustomerPrivateRoute;

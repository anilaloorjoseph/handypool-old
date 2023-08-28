import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  return !userInfo ? (
    <Outlet />
  ) : userInfo.isWorker ? (
    <Navigate to="/worker/profile" replace />
  ) : (
    <Navigate to="/customer/profile" replace />
  );
}

export default PublicRoute;

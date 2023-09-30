import { Navigate,Outlet } from "react-router-dom";
import {  useSelector } from "react-redux";

function WorkerPrivateRoute() {
    const {userInfo} = useSelector((state) => state.auth)
  return userInfo.isWorker === true ?  <Outlet/> :<Navigate to='/login' replace />
}

export default WorkerPrivateRoute
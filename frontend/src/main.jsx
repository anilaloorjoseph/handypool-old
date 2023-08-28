import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import "./index.scss";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterCustomerScreen from "./components/RegisterCustomer/RegisterCustomer";
import RegisterWorkerScreen from "./screens/Worker/RegisterWorkerScreen";
import CustomerProfileScreen from "./screens/Customer/CustomerProfileScreen";
import WorkerProfileScreen from "./screens/Worker/WorkerProfileScreen";
import CustomerSettingsScreen from "./screens/Customer/CustomerSettingsScreen";
import WorkerSettingsScreen from "./screens/Worker/WorkerSettingsScreen";
import CustomerWorkResponsesScreen from "./screens/Customer/CusotmerWorkResponsesScreen";
import WorkerWorkRequestsScreen from "./screens/Worker/WorkerWorkRequestsScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PublicRoute />}>
        <Route index={true} path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/customer/register" element={<RegisterCustomerScreen />} />
        <Route path="/worker/register" element={<RegisterWorkerScreen />} />
      </Route>
      <Route path="" element={<PrivateRoute />}>
        {/* customer private routes */}
        <Route path="/customer/profile" element={<CustomerProfileScreen />} />
        <Route path="/customer/settings" element={<CustomerSettingsScreen />} />
        <Route
          path="/customer/work/responses"
          element={<CustomerWorkResponsesScreen />}
        />
        {/* worker private routes */}
        <Route path="/worker/profile" element={<WorkerProfileScreen />} />
        <Route path="/worker/settings" element={<WorkerSettingsScreen />} />
        <Route
          path="/worker/work/requests"
          element={<WorkerWorkRequestsScreen />}
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);

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
import CustomerPrivateRoute from "./components/CustomerPrivateRoute";
import WorkerPrivateRoute from "./components/WorkerPrivateRoute";
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
import CustomerPostsScreen from "./screens/Customer/CustomerPostsScreen";
import WorkerWorksScreen from "./screens/Worker/WorkerWorksScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/customer/register" element={<RegisterCustomerScreen />} />
      <Route path="/worker/register" element={<RegisterWorkerScreen />} />

      <Route path="" element={<CustomerPrivateRoute />}>
        {/* customer private routes */}
        <Route path="/customer/profile" element={<CustomerProfileScreen />} />
        <Route path="/customer/settings" element={<CustomerSettingsScreen />} />
        <Route path="/customer/posts" element={<CustomerPostsScreen />} />
      </Route>
      <Route path="" element={<WorkerPrivateRoute />}>
        {/* worker private routes */}
        <Route path="/worker/profile" element={<WorkerProfileScreen />} />
        <Route path="/worker/settings" element={<WorkerSettingsScreen />} />
        <Route path="/worker/works" element={<WorkerWorksScreen />} />
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

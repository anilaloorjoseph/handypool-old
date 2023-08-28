import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setAccessToken } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: async (headers, { getState, endpoint }) => {
    const { auth } = getState();

    if (auth.accessToken) {
      headers.set("authorization", auth.accessToken);
    }

    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    api.endpoint === "registerCustomer" ||
    api.endpoint === "loginCustomer" ||
    api.endpoint === "registerWorker" ||
    api.endpoint === "loginWorker"
  ) {
    return result;
  }

  let { auth } = api.getState();

  if (
    result?.error?.status === 401 ||
    auth.accessToken === null ||
    auth.accessToken === ""
  ) {
    try {
      const refreshResult = await baseQuery(
        "/api/getaccesskey",
        api,
        extraOptions
      );
      if (refreshResult?.data) {
        // store the new token
        api.dispatch(setAccessToken(refreshResult.data));
        //retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (err) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Customer",
    "Worker",
    "Register",
    "Profile",
    "Login",
    "Logout",
    "Delete",
  ],
  endpoints: (builder) => ({}),
});

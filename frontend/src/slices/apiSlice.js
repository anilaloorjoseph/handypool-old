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

  const checkEndpointWithoutToken = [
    "registerCustomer",
    "loginCustomer",
    "registerWorker",
    "loginWorker",
    "workTypes",
  ];

  if (!checkEndpointWithoutToken.includes(api.endpoint)) {
    try {
      let { auth } = api.getState();

      if (result?.error?.status === 401 || !auth.accessToken) {
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
      }
    } catch (err) {
      api.dispatch(logout());
    }
  }

  return result;
};

// Add a timeout wrapper function
const withTimeout = async (fn, timeout) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeout);
  });

  try {
    return await Promise.race([fn, timeoutPromise]);
  } catch (error) {
    return { error: { status: 504, statusText: "Request timed out" } };
  }
};

export const apiSlice = createApi({
  baseQuery: (args, api, extraOptions) =>
    withTimeout(baseQueryWithAuth(args, api, extraOptions), 10000), // Set your desired timeout value
  tagTypes: [
    "Customer",
    "Worker",
    "Register",
    "Profile",
    "Login",
    "Logout",
    "Delete",
    "Work",
    "Post",
    "Autoload",
    "WorkTypes",
    "GetWorks",
    "GetNoOfNewWorks",
    "MakeWorksRead",
    "Price",
    "Send",
  ],
  endpoints: (builder) => ({}),
});

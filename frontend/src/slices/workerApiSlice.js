import { apiSlice } from "./apiSlice";
const WORKER_URL = "/api/worker";

export const workersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerWorker: builder.mutation({
      query: (data) => ({
        url: `${WORKER_URL}/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Worker", "Register"],
    }),
    loginWorker: builder.mutation({
      query: (data) => ({
        url: `${WORKER_URL}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Worker", "Login"],
    }),
    logoutWorker: builder.mutation({
      query: () => ({
        url: `${WORKER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Worker", "Logout"],
    }),
    profileWorker: builder.query({
      query: () => ({
        url: `${WORKER_URL}/profile`,
      }),
      // // Use the queryFn option to set the timeout
      // queryFn: async (api, queryArg, options, extraOptions) => {
      //   const response = await api.fetchBaseQuery(queryArg, {
      //     ...options,
      //     timeout: 10000, // Set the timeout value in milliseconds
      //   });
      //   return response;
      // },
      providesTags: ["Worker", "Profile"],
    }),
    updateWorker: builder.mutation({
      query: (data) => ({
        url: `${WORKER_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Worker", "Profile"],
    }),
    deleteWorker: builder.mutation({
      query: (data) => ({
        url: `${WORKER_URL}/profile`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Worker", "Delete", "Profile"],
    }),
  }),
});

export const {
  useRegisterWorkerMutation,
  useLoginWorkerMutation,
  useLogoutWorkerMutation,
  useProfileWorkerQuery,
  useUpdateWorkerMutation,
  useDeleteWorkerMutation,
} = workersApiSlice;

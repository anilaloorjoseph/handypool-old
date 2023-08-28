import { apiSlice } from "./apiSlice";
const CUSTOMER_URL = "/api/customer";

export const customersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerCustomer: builder.mutation({
      query: (data) => ({
        url: `${CUSTOMER_URL}/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer", "Register"],
    }),
    loginCustomer: builder.mutation({
      query: (data) => ({
        url: `${CUSTOMER_URL}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer", "Login"],
    }),
    logoutCustomer: builder.mutation({
      query: () => ({
        url: `${CUSTOMER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Customer", "Logout"],
    }),
    profileCustomer: builder.query({
      query: () => ({
        url: `${CUSTOMER_URL}/profile`,
      }),
      providesTags: ["Customer", "Profile"],
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: `${CUSTOMER_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customer", "Profile"],
    }),
    deleteCustomer: builder.mutation({
      query: (data) => ({
        url: `${CUSTOMER_URL}/profile`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Customer", "Delete", "Profile"],
    }),
  }),
});

export const {
  useRegisterCustomerMutation,
  useLoginCustomerMutation,
  useLogoutCustomerMutation,
  useUpdateCustomerMutation,
  useProfileCustomerQuery,
  useDeleteCustomerMutation,
} = customersApiSlice;

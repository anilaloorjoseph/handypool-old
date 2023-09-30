import { apiSlice } from "./apiSlice";
const WORK_URL = "/api/work";

export const workApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    work: builder.mutation({
      query: (data) => ({
        url: `${WORK_URL}/post`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Work", "Post"],
    }),
    getNewWorks: builder.query({
      query: () => ({
        url: `${WORK_URL}/getnewworks`,
      }),
      providesTags: ["Work", "GetNewWorks"],
    }),
  }),
});

export const { useWorkMutation, useGetNewWorksQuery } = workApiSlice;

import { apiSlice } from "./apiSlice";
const WORK_URL = "/api/work";

export const workApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    workPost: builder.mutation({
      query: (data) => ({
        url: `${WORK_URL}/post`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Work", "Post"],
    }),
    makeworksRead: builder.mutation({
      query: (data) => ({
        url: `${WORK_URL}/makeworksread`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Work", "MakeWorksRead"],
    }),
    getNoOfNewWorks: builder.query({
      query: () => ({
        url: `${WORK_URL}/getnoofnewworks`,
      }),
      providesTags: ["Work", "GetNoOfNewWorks"],
    }),
    getWorks: builder.query({
      query: ({ query, page, showExpired }) => ({
        url: `${WORK_URL}/getworks?query=${query}&page=${page}&showExpired=${showExpired}`,
      }),
      providesTags: ["Work", "GetWorks"],
    }),
  }),
});

export const {
  useWorkPostMutation,
  useGetNoOfNewWorksQuery,
  useGetWorksQuery,
  useMakeworksReadMutation,
} = workApiSlice;

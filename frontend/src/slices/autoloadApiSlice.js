import { apiSlice } from "./apiSlice";
const AUTOLOAD_URL = "/api/autoload";

export const autoloadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    workTypes: builder.query({
      query: () => ({
        url: `${AUTOLOAD_URL}/worktypes`,
      }),
      providesTags: ["Autoload", "WorkTypes"],
    }),
  }),
});

export const { useWorkTypesQuery } = autoloadApiSlice;

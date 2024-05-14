import { apiSlice } from "./apiSlice";
const PRICE_URL = "/api/price";

export const priceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendPrice: builder.mutation({
      query: (data) => ({
        url: `${PRICE_URL}/send`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Price", "Send"],
    }),
  }),
});

export const { useSendPriceMutation } = priceApiSlice;

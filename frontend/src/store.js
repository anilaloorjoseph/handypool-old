import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import socketEventsReducers from "./slices/socketEventsSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    socketEvents: socketEventsReducers,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;

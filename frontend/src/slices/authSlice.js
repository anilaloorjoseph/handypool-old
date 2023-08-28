import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, ...user } = action.payload;
      state.userInfo = user;
      state.accessToken = accessToken;
      localStorage.setItem("userInfo", JSON.stringify(user));
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    logout: (state, action) => {
      state.userInfo = null;
      state.accessToken = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;

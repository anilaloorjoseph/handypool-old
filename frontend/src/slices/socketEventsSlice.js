import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refetchWorks: false,
};

const socketEventsSlice = createSlice({
  name: "socketEvents",
  initialState,
  reducers: {
    eventRefetchWorks: (state, action) => {
      state.refetchWorks = action.payload;
    },
  },
});

export const { eventRefetchWorks } = socketEventsSlice.actions;

export default socketEventsSlice.reducer;

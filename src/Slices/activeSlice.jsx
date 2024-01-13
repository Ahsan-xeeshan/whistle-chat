import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: "shaila fly",
};

export const activeSlice = createSlice({
  name: "activeChat",
  initialState,
  reducers: {
    activeChat: (state, action) => {
      state.active = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { activeChat } = activeSlice.actions;

export default activeSlice.reducer;

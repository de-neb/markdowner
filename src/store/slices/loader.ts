import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loadingText: "Loading...",
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader(state, action) {
      state.loading = true;
      state.loadingText = action.payload || state.loadingText;
    },
    hideLoader(state) {
      state.loading = false;
    },
  },
});

export const loaderActions = loaderSlice.actions;

export default loaderSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showDrawer: false,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    toggleDrawer(state) {
      state.showDrawer = !state.showDrawer;
    },
  },
});

export const drawerActions = drawerSlice.actions;

export default drawerSlice.reducer;

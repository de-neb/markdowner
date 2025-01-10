import { createSlice } from "@reduxjs/toolkit";

type NavbarState = {
  action: string;
  disabledActions: string[];
};

const initialState: NavbarState = {
  action: "",
  disabledActions: ["Cut", "Delete"],
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setNavAction(state, action) {
      state.action = action.payload;
    },
    setDisabledActions(state, action) {
      state.disabledActions = action.payload;
    },
  },
});

export const navbarActions = navbarSlice.actions;

export default navbarSlice.reducer;

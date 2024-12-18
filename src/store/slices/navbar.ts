import { createSlice } from "@reduxjs/toolkit";

type NavbarState = {
  action: string;
};

const initialState: NavbarState = {
  action: "",
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setNavAction(state, action) {
      state.action = action.payload;
    },
  },
});

export const navbarActions = navbarSlice.actions;

export default navbarSlice.reducer;

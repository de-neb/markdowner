import { createSlice } from "@reduxjs/toolkit";

type NavbarState = {
  action: string;
  disabledActions: string[];
  tableSize: {
    rows: number;
    cols: number;
  };
};

const initialState: NavbarState = {
  action: "",
  disabledActions: ["Cut", "Delete"],
  tableSize: { rows: 0, cols: 0 },
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
    setTableSize(state, action) {
      state.tableSize = action.payload;
    },
  },
});

export const navbarActions = navbarSlice.actions;

export default navbarSlice.reducer;

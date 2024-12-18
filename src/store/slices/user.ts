import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: localStorage.getItem("user_id"),
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.user = action.payload;
      localStorage.setItem("user_id", action.payload.id);
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;

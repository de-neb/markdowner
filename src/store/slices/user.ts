import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: localStorage.getItem("user_id"),
    email: localStorage.getItem("user_email"),
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.user = action.payload;
      localStorage.setItem("user_id", action.payload.id);
      localStorage.setItem("user_email", action.payload.email);
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;

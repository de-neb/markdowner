import { createSlice } from "@reduxjs/toolkit";
import { SessionState } from "../types/sessionSliceTypes";

const initialState: SessionState = {
  session: {
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
    expiration: localStorage.getItem("expiration"),
  },
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setTokens(state, action) {
      state.session = {
        accessToken: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        expiration: action.payload.expiration,
      };

      localStorage.setItem("access_token", action.payload.access_token);
      localStorage.setItem("refresh_token", action.payload.refresh_token);
      localStorage.setItem("expiration", action.payload.expiration);
    },

    clearTokens(state) {
      state.session = null;
      localStorage.clear();
    },
  },
});

export const sessionActions = sessionSlice.actions;

export default sessionSlice.reducer;

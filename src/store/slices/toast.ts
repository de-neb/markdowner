import { createSlice } from "@reduxjs/toolkit";
import { ToastState } from "../types/toastSliceTypes";
import { generateId } from "../../utils/misc";

const initialState: ToastState = {
  toastMessages: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    show(state, action) {
      const toast = {
        ...action.payload,
        id: generateId(),
        value: 100,
        show: true,
      };
      state.toastMessages.push(toast);
    },
    close(state, action) {
      const toast = state.toastMessages.find(
        (toast) => toast.id === action.payload
      );
      if (toast) {
        toast.show = false;
      }
    },
    decreaseProgressValue(state, action) {
      const toast = state.toastMessages.find(
        (toast) => toast.id === action.payload
      );
      if (toast) {
        toast.value = Math.max(toast.value - 2, 0);

        if (toast.value <= 0) {
          toast.show = false;
        }
      }
    },
  },
});

export const toastActions = toastSlice.actions;

export default toastSlice.reducer;

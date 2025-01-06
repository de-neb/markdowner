import { createSlice } from "@reduxjs/toolkit";

interface ModalInitialState {
  isVisible: boolean;
  modalOptions: ModalOptions | null;
  isConfirmed: boolean;
  refValue: any | null;
}

type ModalOptions = {
  title: string;
  text: string;
  okText?: string | null;
  cancelText?: string | null;
  slot: any;
  payload?: any;
};

const initialState: ModalInitialState = {
  isVisible: false,
  modalOptions: null,
  isConfirmed: false,
  refValue: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal(state, action) {
      state.isVisible = true;
      state.modalOptions = action.payload;
    },
    hideModal(state) {
      state.isVisible = false;
    },
    resetModal(state) {
      state = initialState;
    },
    setIsConfirmed(state, action) {
      state.isConfirmed = action.payload;
    },
    setRefValue(state, action) {
      state.refValue = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalInitialState {
  isVisible: boolean;
  modalOptions: ModalOptions | null;
  isConfirmed: boolean;
  refValue: any | null;
  isLoading: boolean;
  enableOkBtn: boolean;
}

type ModalOptions = {
  title: string;
  text: string;
  okText?: string | null;
  cancelText?: string | null;
  slot?: any;
  payload?: any;
  modalClass?: string;
};

const initialState: ModalInitialState = {
  isVisible: false,
  modalOptions: null,
  isConfirmed: false,
  refValue: null,
  isLoading: false,
  enableOkBtn: true,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal(state, action: PayloadAction<ModalOptions>) {
      state.isVisible = true;
      state.modalOptions = action.payload;
    },
    hideModal(state) {
      state.isVisible = false;
    },
    resetModal() {
      return initialState;
    },
    setIsConfirmed(state, action) {
      state.isConfirmed = action.payload;
    },
    setRefValue(state, action) {
      state.refValue = action.payload;
    },
    setIsLoadingModal(state, action) {
      state.isLoading = action.payload;
    },
    enableOkBtn(state, action) {
      state.enableOkBtn = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;

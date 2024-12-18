import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [],
  viewingDocument: {},
};

const documentSlice = createSlice({
  name: "Document",
  initialState,
  reducers: {
    setDocuments(state, action) {
      state.documents = action.payload;
    },
    setViewingDocument(state, action) {
      state.viewingDocument = action.payload;
    },
  },
});

export const documentActions = documentSlice.actions;

export default documentSlice.reducer;

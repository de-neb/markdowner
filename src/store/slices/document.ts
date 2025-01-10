import { createSlice } from "@reduxjs/toolkit";
import { MarkdownerDocument } from "../../client/type";

interface DocumentInitialState {
  documents: MarkdownerDocument[];
  viewingDocument: MarkdownerDocument;
}

const initialState: DocumentInitialState = {
  documents: [],
  viewingDocument: {
    title: "",
    owner_id: "",
  },
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

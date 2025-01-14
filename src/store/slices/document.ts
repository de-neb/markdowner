import { createSlice } from "@reduxjs/toolkit";
import { MarkdownerDocument } from "../../client/type";

interface DocumentInitialState {
  documents: MarkdownerDocument[];
  viewingDocument: MarkdownerDocument;
  isSearching: Boolean;
}

const initialState: DocumentInitialState = {
  documents: [],
  viewingDocument: {
    title: "",
    owner_id: "",
    owner_email: "",
  },
  isSearching: false,
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
    setIsSearching(state, action) {
      state.isSearching = action.payload;
    },
  },
});

export const documentActions = documentSlice.actions;

export default documentSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { MarkdownerDocument, History } from "../../client/type";

interface DocumentInitialState {
  documents: MarkdownerDocument[];
  viewingDocument: MarkdownerDocument;
  isSearching: boolean;
  history: History[];
  oldViewingDocumentContent: string | undefined;
}

const initialState: DocumentInitialState = {
  documents: [],
  viewingDocument: {
    title: "",
    owner_id: "",
    owner_email: "",
  },
  oldViewingDocumentContent: "",
  isSearching: false,
  history: [],
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
      state.oldViewingDocumentContent = state.viewingDocument.content;
    },
    setIsSearching(state, action) {
      state.isSearching = action.payload;
    },
    setDocumentHistory(state, action) {
      state.history = action.payload;
    },
    setDocumentContent(state, action) {
      state.oldViewingDocumentContent = state.viewingDocument.content;
      state.viewingDocument = {
        ...state.viewingDocument,
        content: action.payload,
      };
    },
    revertOriginalContent(state) {
      state.viewingDocument = {
        ...state.viewingDocument,
        content: state.oldViewingDocumentContent,
      };
    },
  },
});

export const documentActions = documentSlice.actions;

export default documentSlice.reducer;

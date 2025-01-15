import { createSlice } from "@reduxjs/toolkit";

interface Collaborator {
  id: string;
  user_email: string;
  role: "Editor" | "Viewer";
  document_id: string;
}

const initialState = {
  collaborators: <Collaborator[]>[],
  collaboratorRoles: [],
};

const collaborationSlice = createSlice({
  name: "collaboration",
  initialState,
  reducers: {
    setCollaborators(state, action) {
      state.collaborators = action.payload;
    },
    setCollaboratorRoles(state, action) {
      state.collaboratorRoles = action.payload;
    },
    updateCollaboratorRole(state, action) {
      const targetIndex = state.collaborators.findIndex(
        (collaborator) => collaborator.id === action.payload.id
      );
      if (targetIndex > -1) {
        state.collaborators[targetIndex].role = action.payload.role;
      }
    },
  },
});

export const collaborationActions = collaborationSlice.actions;

export default collaborationSlice.reducer;

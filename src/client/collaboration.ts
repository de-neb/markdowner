import { toastActions } from "../store/slices/toast";
import { loaderActions } from "../store/slices/loader";
import { collaborationActions } from "../store/slices/collaboration";
import supabase from "./index";
import store from "../store";
import { Collaboration, UpdateCollaboratorRoleParams } from "./type";

export const postCollaborator = async (email: string, documentId: string) => {
  try {
    const { data, error } = await supabase
      .from("Collaboration")
      .insert([{ user_email: email, document_id: documentId }]) // role is editor by default
      .select()
      .single();

    if (error) {
      throw error;
    }

    await getCollaborators(documentId);

    return data;
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  } finally {
    store.dispatch(loaderActions.hideLoader());
  }
};

export const getCollaborators = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from("Collaboration")
      .select("*")
      .eq("document_id", documentId);

    store.dispatch(collaborationActions.setCollaborators(data));

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  } finally {
    store.dispatch(loaderActions.hideLoader());
  }
};

//get roles
export const getCollaboratorRoles = async () => {
  try {
    const { data: Roles, error } = await supabase.from("Roles").select("*");

    if (error) {
      throw error;
    }

    store.dispatch(collaborationActions.setCollaboratorRoles(Roles));

    return Roles;
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  }
};

export const updateCollaboratorRole = async (
  collaborators: Collaboration[]
) => {
  try {
    store.dispatch(loaderActions.showLoader("Updating collaborator role..."));

    const { data, error } = await supabase
      .from("Collaboration")
      .upsert(collaborators);

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  } finally {
    store.dispatch(loaderActions.hideLoader());
  }
};

export const removeCollaborator = async (collaborationId: string) => {
  try {
    store.dispatch(loaderActions.showLoader("Removing collaborator..."));

    const { error } = await supabase
      .from("Collaboration")
      .delete()
      .eq("id", collaborationId);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  } finally {
    store.dispatch(loaderActions.hideLoader());
  }
};

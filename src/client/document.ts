import supabase from "./index";
import store from "../store";
import { toastActions } from "../store/slices/toast";
import { loaderActions } from "../store/slices/loader";
import { documentActions } from "../store/slices/document";
import { postCollaborator } from "./collaboration";
import { postCursorLocation } from "./cursor";
import { DocumentContent, MarkdownerDocument } from "./type";

export const postDocument = async (document: MarkdownerDocument) => {
  try {
    store.dispatch(loaderActions.showLoader("Creating document..."));
    const { data, error } = await supabase
      .from("Documents")
      .insert([{ ...document }])
      .select()
      .single();

    // post collaborators and cursor location
    const userEmail = store.getState().user.user.email as string;
    const cursorData = {
      document_id: data.id as string,
      typing_state: true,
      cursor_position: {
        column: 1,
        lineNumber: 1,
      },
    };
    await postCollaborator(userEmail, data.id as string);
    await postCursorLocation(cursorData);

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

export const searchDocuments = async (
  orderBy: keyof MarkdownerDocument = "opened_at",
  searchBy: string
) => {
  try {
    store.dispatch(loaderActions.showLoader("Searching document(s)..."));
    store.dispatch(documentActions.setIsSearching(true));

    if (searchBy === "") {
      getDocuments();
      return;
    }

    const { data, error } = await supabase
      .from("documents_with_users")
      .select("*")
      .ilike("title", searchBy)
      .order(orderBy, { ascending: orderBy === "title" });

    store.dispatch(documentActions.setDocuments(data));

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
    store.dispatch(documentActions.setIsSearching(false));
  }
};

export const getDocuments = async (
  orderBy: keyof MarkdownerDocument = "opened_at"
) => {
  try {
    store.dispatch(loaderActions.showLoader("Loading documents..."));

    const { data, error } = await supabase.rpc("get_user_documents", {
      order_by: orderBy,
      sort_direction: orderBy === "title" ? "ASC" : "DESC",
    });

    store.dispatch(documentActions.setDocuments(data));

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

export const getDocumentContentById = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from("Documents")
      .select(`*,Contents(content)`)
      .eq("id", documentId)
      .single();

    if ("Contents" in data && data.Contents) {
      data.content = data.Contents.content ?? "";
    }

    const { error: updateAccessError } = await supabase.rpc("access_document", {
      doc_id: documentId,
    });

    if (error) {
      throw error;
    }

    if (updateAccessError) {
      throw error;
    }

    store.dispatch(documentActions.setViewingDocument(data));

    return data;
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  }
};

export const updateDocument = async (
  document: MarkdownerDocument,
  documentContent: DocumentContent
) => {
  try {
    store.dispatch(loaderActions.showLoader("Updating Document..."));
    const { data, error } = await supabase
      .from("Documents")
      .update({ title: document.title })
      .eq("id", document.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    await insertDocumentContent({ ...documentContent, document_id: data.id });

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

export const insertDocumentContent = async (
  documentContent: DocumentContent
) => {
  try {
    const { data, error } = await supabase
      .from("Contents")
      .upsert([{ ...documentContent }], { onConflict: ["document_id"] })
      .select()
      .single();

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
  }
};

export const renameDocumentTitle = async (
  title: string,
  documentId: string
) => {
  try {
    store.dispatch(loaderActions.showLoader("Renaming Document..."));
    const { data, error } = await supabase
      .from("Documents")
      .update({ title: title })
      .eq("id", documentId)
      .select()
      .single();

    await getDocuments();

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

export const removeDocumentById = async (documentId: string) => {
  try {
    store.dispatch(loaderActions.showLoader("Removing Document..."));
    const { error } = await supabase
      .from("Documents")
      .delete()
      .eq("id", documentId);

    await getDocuments();

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

export const getDocumentHistory = async (documentId: string) => {
  try {
    store.dispatch(loaderActions.showLoader("Loading history..."));

    const { data, error } = await supabase
      .from("Document History")
      .select("*")
      .eq("document_id", documentId)
      .order("action_timestamp", { ascending: false });

    store.dispatch(documentActions.setDocumentHistory(data));

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

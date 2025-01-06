import { toastActions } from "../store/slices/toast";
import { loaderActions } from "../store/slices/loader";
import { documentActions } from "../store/slices/document";
import supabase from "./index";
import store from "../store";
import { DocumentContent, MarkdownerDocument } from "./type";

export const postDocument = async (document: MarkdownerDocument) => {
  try {
    store.dispatch(loaderActions.showLoader("Creating document..."));
    const { data, error } = await supabase
      .from("Documents")
      .insert([{ ...document }])
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
  } finally {
    store.dispatch(loaderActions.hideLoader());
  }
};

export const getDocuments = async () => {
  try {
    store.dispatch(loaderActions.showLoader("Loading documents..."));

    const { data, error } = await supabase
      .from("Documents")
      .select(`*,Contents(content)`)
      .order("opened_at", { ascending: false });

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

import { toastActions } from "../store/slices/toast";
import { loaderActions } from "../store/slices/loader";
import supabase from "./index";
import store from "../store";
import { MarkdownerDocument } from "./type";

export const postDocument = async (document: MarkdownerDocument) => {
  try {
    store.dispatch(loaderActions.showLoader("Saving document..."));
    const { data, error } = await supabase
      .from("Documents")
      .insert([{ ...document }])
      .select();

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

    const { data, error } = await supabase.from("Documents").select("*");

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

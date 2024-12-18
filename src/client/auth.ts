import { SignupData } from "./type";
import { toastActions } from "../store/slices/toast";
import { loaderActions } from "../store/slices/loader";
import { userActions } from "../store/slices/user";
import { sessionActions } from "../store/slices/session";
import supabase from "./index";
import store from "../store";

export const signUp = async (payload: SignupData) => {
  try {
    store.dispatch(loaderActions.showLoader("Signing up..."));

    const response = await supabase.auth.signUp(payload);

    store.dispatch(userActions.setUserInfo(response.data.user));

    if (response.data.user && response.data.user.id) {
      store.dispatch(
        toastActions.show({
          message: "Signup successfull! Please verify your email.",
          type: "success",
        })
      );
      return true;
    } else if (response.error && response.error.status === 422) {
      store.dispatch(
        toastActions.show({
          message: response.error.message,
          type: "error",
        })
      );
    } else {
      throw new Error(
        response.error
          ? response.error.message
          : "Something went wrong during sign up"
      );
    }

    return false;
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

export const login = async (payload: SignupData) => {
  try {
    store.dispatch(loaderActions.showLoader("Logging in..."));

    const { data, error } = await supabase.auth.signInWithPassword({
      ...payload,
    });

    if (data.session) {
      store.dispatch(userActions.setUserInfo(data.user));
      return true;
    }

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
    return false;
  } finally {
    store.dispatch(loaderActions.hideLoader());
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    store.dispatch(sessionActions.clearTokens());
  }
};

supabase.auth.onAuthStateChange((_, session) => {
  if (session) {
    store.dispatch(sessionActions.setTokens(session));
  } else {
    store.dispatch(sessionActions.clearTokens());
  }
});

export default supabase;

import { configureStore } from "@reduxjs/toolkit";

import toastReducer from "./slices/toast";
import loaderReducer from "./slices/loader";
import navbarReducer from "./slices/navbar";
import modalReducer from "./slices/modal";
import sessionReducer from "./slices/session";
import userReducer from "./slices/user";
import documentReducer from "./slices/document";
import collaborationReducer from "./slices/collaboration";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    loader: loaderReducer,
    session: sessionReducer,
    navbar: navbarReducer,
    user: userReducer,
    document: documentReducer,
    modal: modalReducer,
    collaboration: collaborationReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

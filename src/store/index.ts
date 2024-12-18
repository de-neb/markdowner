import { configureStore } from "@reduxjs/toolkit";

import toastReducer from "./slices/toast";
import loaderReducer from "./slices/loader";
import sessionReducer from "./slices/session";
import navbarReducer from "./slices/navbar";
import userReducer from "./slices/user";
import documentReducer from "./slices/document";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    loader: loaderReducer,
    session: sessionReducer,
    navbar: navbarReducer,
    user: userReducer,
    document: documentReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";

import toastReducer from "./slices/toast";
import loaderReducer from "./slices/loader";
import sessionReducer from "./slices/session";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    loader: loaderReducer,
    session: sessionReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

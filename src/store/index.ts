import { configureStore } from "@reduxjs/toolkit";

import toastReducer from "./slices/toast";
import loaderReducer from "./slices/loader";

const store = configureStore({
  reducer: {
    toast: toastReducer,
    loader: loaderReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

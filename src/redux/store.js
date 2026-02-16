import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { apiSlice } from "./Admin/AdminApi";
import adminReducer from "./Admin/AdminSlice";

const rootReducer = combineReducers({
  admin: adminReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

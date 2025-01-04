import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";

const reducers = combineReducers({
  user: userReducer,
});

export const store = configureStore({
  reducer: reducers,
});

export type ReduxState = ReturnType<typeof reducers>;

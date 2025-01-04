import { applyMiddleware, legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore } from "@reduxjs/toolkit";

const composeEnhancers = composeWithDevTools({});

// export const store = createStore(
//   reducers,
//   {},
//   composeEnhancers(applyMiddleware(thunk))
// );

export const store = configureStore({
  reducer: reducers,
});

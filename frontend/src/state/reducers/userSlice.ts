import { PayloadAction } from "./../../../node_modules/@reduxjs/toolkit/src/createAction";
import { CaseReducer, createSlice } from "@reduxjs/toolkit";
import { ActionType } from "../action-types";
import { Action } from "../actions";

export interface User {
  email: string;
  username: string;
  token: string;
}

interface UserType {
  username: string;
  email: string;
}
const initialState: UserType | null = null;

// const reducer = (state: User | null = initialState, action: Action) => {
//   switch (action.type) {
//     case ActionType.SET_USER:
//       localStorage.setItem("account", JSON.stringify(action.payload));
//       return action.payload;
//     case ActionType.LOGOUT:
//       localStorage.removeItem("account");
//       return null;
//     default:
//       return state;
//   }
// };

export const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserType | null,
  reducers: {
    setUser: (state, action) => action.payload,
  },
});

// export default reducer;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;

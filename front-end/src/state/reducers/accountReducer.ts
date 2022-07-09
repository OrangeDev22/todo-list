import { ActionType } from "../action-types";
import { Action } from "../actions";

export interface Account {
  id: number;
  email: string;
  username: string;
  token: string;
}

const initialState: Account | null = null;

const reducer = (state: Account | null = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_USER:
      localStorage.setItem("account", JSON.stringify(action.payload));
      return action.payload;
    case ActionType.LOGOUT:
      localStorage.removeItem("account");
      return null;
    default:
      return state;
  }
};

export default reducer;

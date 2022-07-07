import { ActionType } from "../action-types";
import { Account } from "../reducers/accountReducer";

interface LoginAction {
  type: ActionType.SET_USER;
  payload: Account;
}

interface LogoutAction {
  type: ActionType.LOGOUT;
  payload: null;
}

export type Action = LoginAction | LogoutAction;

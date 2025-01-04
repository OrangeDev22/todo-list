import { ActionType } from "../action-types";
import { User } from "../reducers/userSlice";

interface SetUserAction {
  type: ActionType.SET_USER;
  payload: User;
}

interface LogoutAction {
  type: ActionType.LOGOUT;
  payload: null;
}

export type Action = SetUserAction | LogoutAction;

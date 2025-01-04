import { ActionType } from "../action-types";
import { User } from "../reducers/userSlice";
import { Dispatch } from "redux";
import { Action } from "../actions";

export const setUser = (user: User) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_USER,
      payload: user,
    });
  };
};

export const logout = () => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionType.LOGOUT,
    });
  };
};

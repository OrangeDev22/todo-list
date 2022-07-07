import { ActionType } from "../action-types";
import { Account } from "../reducers/accountReducer";
import { Dispatch } from "redux";
import { Action } from "../actions";

export const setUser = (user: Account) => {
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

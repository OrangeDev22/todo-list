import React from "react";
import { useSelector } from "react-redux";
import { actionCreators, State } from "../../state";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

function Header() {
  const user = useSelector((state: State) => state.user);
  const dispatch = useDispatch();
  const { logout } = bindActionCreators(actionCreators, dispatch);

  return (
    <header className="p-4 bg-sky-500 flex">
      <div className="font-bold">Todo List</div>
      {user && (
        <button className="ml-auto" onClick={() => logout()}>
          Log out
        </button>
      )}
    </header>
  );
}

export default Header;

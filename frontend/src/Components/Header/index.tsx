import React from "react";
import { useSelector } from "react-redux";
import { actionCreators, State } from "../../state";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "../../axios";

function Header() {
  const user = useSelector((state: State) => state.user);
  const dispatch = useDispatch();
  const { logout } = bindActionCreators(actionCreators, dispatch);

  console.log("--user", user);
  return (
    <header className="p-4 bg-gray-900 flex">
      <div className="font-bold">{user?.username || "Todo List"}</div>
      {user?.email && (
        <div className="flex items*center ml-auto gap-3">
          <button onClick={() => logout()}>Log out</button>
          <button
            className="text-red-600"
            onClick={async () => {
              if (
                window.confirm("Are you sure you want to delete your account")
              ) {
                await axios.delete("/users", {}).then(() => logout());
              }
            }}
          >
            Delete Account
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;

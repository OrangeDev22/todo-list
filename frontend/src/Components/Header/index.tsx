import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "../../axios";
import { ReduxState } from "../../state/store";
import { setUser } from "../../state/reducers/userSlice";

function Header() {
  const user = useSelector((state: ReduxState) => state.user);
  const dispatch = useDispatch();

  const handleRemoveUser = () => {
    dispatch(setUser(null));
    localStorage.removeItem("token_expires_at");
  };

  return (
    <header className="p-4 bg-gray-900 flex">
      <div className="font-bold">{user?.username || "Todo List"}</div>
      {user?.email && (
        <div className="flex items*center ml-auto gap-3">
          <button onClick={handleRemoveUser}>Log out</button>
          <button
            className="text-red-600"
            onClick={async () => {
              if (
                window.confirm("Are you sure you want to delete your account")
              ) {
                await axios.delete("/users", {}).then(() => {});
                handleRemoveUser();
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

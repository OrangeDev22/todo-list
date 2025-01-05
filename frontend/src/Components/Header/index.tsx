import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "../../axios";
import { ReduxState } from "../../state/store";
import { setUser } from "../../state/reducers/userSlice";
import axiosInstance from "../../axios";

function Header() {
  const user = useSelector((state: ReduxState) => state.user);
  const dispatch = useDispatch();

  const handleRemoveUser = () => {
    localStorage.removeItem("token_expires_at");
    dispatch(setUser(null));
  };

  const handleLogoutUser = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.status === 200) {
        handleRemoveUser();
      }
    } catch (error) {
      console.error("--error", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete("/users", {});
      if (response.status === 200) {
        handleRemoveUser();
      }
    } catch (error) {
      console.error("--error", error);
    }
  };

  return (
    <header className="p-4 bg-gray-900 flex">
      <div className="font-bold">{user?.username || "Todo List"}</div>
      {user?.email && (
        <div className="flex items*center ml-auto gap-3">
          <button onClick={handleLogoutUser}>Log out</button>
          <button className="text-red-600" onClick={handleDeleteUser}>
            Delete Account
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;

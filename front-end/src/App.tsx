import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import "./App.css";
import LoginSignup from "./pages/LoginSignup";
import { actionCreators, State } from "./state";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: State) => state.user);
  const { setUser } = bindActionCreators(actionCreators, dispatch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userLocalStorage = JSON.parse(
      localStorage.getItem("account") || "{}"
    );
    if (userLocalStorage) {
      setUser(userLocalStorage);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-full">
      {/* For Testing only */}
      <main className="flex-grow flex flex-col">
        {user && <div>{user.username}</div>}
        <LoginSignup />
      </main>
    </div>
  );
}

export default App;

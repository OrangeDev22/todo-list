import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import "./App.css";
import Header from "./Components/Header";
import HomePage from "./pages/Homepage";
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
    if (userLocalStorage.email) {
      setUser(userLocalStorage);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-grow flex flex-col">
        {user ? <HomePage /> : <LoginSignup />}
      </main>
    </div>
  );
}

export default App;

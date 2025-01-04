import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import "./App.css";
import Header from "./Components/Header/index";
import Homepage from "./pages/HomePage/index";
import { actionCreators, State } from "./state";
import { BrowserRouter, Route, Routes } from "react-router";
import SiginPage from "./pages/SiginPage";
import SignupPage from "./pages/SignupPage";

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
        {/* {user ? <Homepage /> : <LoginSignup />} */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/sigin" element={<SiginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;

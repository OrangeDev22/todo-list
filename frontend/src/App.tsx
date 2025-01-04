import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import "./App.css";
import Header from "./Components/Header/index";
import Homepage from "./pages/HomePage/index";
import { BrowserRouter, Route, Routes } from "react-router";
import SiginPage from "./pages/SiginPage";
import SignupPage from "./pages/SignupPage";
import { toInteger } from "lodash";
import axiosInstance from "./axios";
import { setUser } from "./state/reducers/userSlice";
import { ReduxState } from "./state/store";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenExpTime = localStorage.getItem("token_expires_at");
    const currentTime = new Date().getTime();

    if (currentTime > toInteger(tokenExpTime)) {
      localStorage.removeItem("token_expires_at");
      dispatch(setUser(null));
    }

    axiosInstance
      .get("/users")
      .then((response) => {
        dispatch(setUser(response.data.record));
      })
      .catch((error) => console.error("--error", error))
      .finally(() => setLoading(false));
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

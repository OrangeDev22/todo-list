import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Header from "./Components/Header/index";
import Homepage from "./pages/HomePage/index";
import { BrowserRouter, Route, Routes } from "react-router";
import SiginPage from "./pages/SiginPage";
import SignupPage from "./pages/SignupPage";
import { toInteger } from "lodash";
import axiosInstance from "./axios";
import { setUser } from "./state/reducers/userSlice";
import Loading from "./Components/Loading";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const logoutUser = async () => {
    try {
      const response = await axiosInstance.post("/logout");
      if (response.status === 200) {
        dispatch(setUser(null));
      }
    } catch (error) {
      console.error("--error", error);
    }
  };

  useEffect(() => {
    const tokenExpTime = localStorage.getItem("token_expires_at");
    const currentTime = new Date().getTime();

    if (currentTime > toInteger(tokenExpTime) || !tokenExpTime) {
      tokenExpTime && logoutUser();
      dispatch(setUser(null));
      setLoading(false);
      return;
    }

    if (!tokenExpTime) return;

    axiosInstance
      .get("/users")
      .then((response) => {
        dispatch(setUser(response.data.record));
      })
      .catch((error) => console.error("--error", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="mx-auto flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-grow flex flex-col">
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

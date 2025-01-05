import { Response } from "express";
import axios from "axios";
import { error } from "console";
import { useSelector } from "react-redux";
import { store } from "./state/store";
import { setUser } from "./state/reducers/userSlice";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === 403
    ) {
      store.dispatch(setUser(null));
    }
    return error;
  }
);

export default axiosInstance;

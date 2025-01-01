import axios from "axios";
import { useSelector } from "react-redux";
import { State } from "./state";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

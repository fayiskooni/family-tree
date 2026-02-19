import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api/auth"
    : BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

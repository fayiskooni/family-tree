import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log(BACKEND_URL, "BACKEND_URL");
console.log(BACKEND_URL, "BACKEND_URL");

const BASE_URL =
  import.meta.env.MODE === "development"
    ? BACKEND_URL || "http://localhost:5001/api/auth"
    : BACKEND_URL;


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the cookies with the request
});

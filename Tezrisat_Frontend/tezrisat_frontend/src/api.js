import axios from "axios";
// import { ACCESS_TOKEN } from "./constants";

const defaultUrl = "https://tezrisat-backend.onrender.com";
const envUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  // prefer VITE_API_URL unless it still points to localhost
  baseURL: envUrl && !envUrl.includes("localhost") ? envUrl : defaultUrl,
  headers: {
    "Content-type": "application/json",
  },
});
// Disable attaching tokens to requests
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default api
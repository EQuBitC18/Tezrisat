import axios from "axios";

// Use local backend by default for development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-type": "application/json",
  },
});

export default api

import axios from "axios";

// Use local backend by default for development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }
  const openaiKey = window.localStorage.getItem("tezrisat.openai_key");
  const serpapiKey = window.localStorage.getItem("tezrisat.serpapi_key");
  const wolframKey = window.localStorage.getItem("tezrisat.wolfram_key");

  config.headers = config.headers || {};
  if (openaiKey) {
    config.headers["X-OpenAI-Key"] = openaiKey;
  }
  if (serpapiKey) {
    config.headers["X-SerpAPI-Key"] = serpapiKey;
  }
  if (wolframKey) {
    config.headers["X-Wolfram-Key"] = wolframKey;
  }

  return config;
});

export default api

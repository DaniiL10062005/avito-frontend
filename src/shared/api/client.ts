import axios from "axios";

const baseURL = import.meta.env.DEV ? "/api" : import.meta.env.VITE_BACKEND_URL;
const aiURL =
  import.meta.env.DEV
    ? "/ai-api"
    : (import.meta.env.VITE_AI_URL ?? "http://localhost:11434/api/generate");

export const axiosDefault = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const axiosAi = axios.create({
  baseURL: aiURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

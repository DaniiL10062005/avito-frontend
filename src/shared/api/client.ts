import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const axiosDefault = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

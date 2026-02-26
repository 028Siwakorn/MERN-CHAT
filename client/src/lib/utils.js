import axios from "axios";

// Vite ใช้ import.meta.env แทน process.env
const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ถูกต้องแล้วสำหรับการส่ง Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

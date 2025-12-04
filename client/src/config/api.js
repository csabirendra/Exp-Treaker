import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5002";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // agar backend cookie set karta hai to true; warna false ya hata do
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosInstance;
export { API_BASE_URL };
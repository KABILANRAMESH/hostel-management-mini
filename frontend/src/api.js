import axios from "axios";

const API = axios.create({
  baseURL: "/api",   // ✅ works in both dev & production
});

export default API;

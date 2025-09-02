import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// Add token to headers if needed
API.interceptors.request.use((req) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

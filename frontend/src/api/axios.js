import axios from "axios";

const api = axios.create({
  baseURL: "https://mockmate-backend-rose.vercel.app/",
  headers: {
    "Content-Type": "application/json"
  }
});

// request interceptor
api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }

);

export default api;
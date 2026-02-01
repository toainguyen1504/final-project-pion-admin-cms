import axios from "axios";

const BASE_API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

// const BASE_MEDIA_URL =
//   import.meta.env.MODE === "development"
//     ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
//     : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION;

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  //   baseMediaURL: BASE_MEDIA_URL,
});

// Gắn token tự động cho mỗi request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authTokenCms");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

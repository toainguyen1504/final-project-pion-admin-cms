import axios from "axios";

const BASE_API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
// Gắn token tự động cho mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authTokenCms");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
// Nếu token hết hạn -> auto logout
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Token expired. Logging out...");

      localStorage.removeItem("authTokenCms");
      localStorage.removeItem("userCms");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

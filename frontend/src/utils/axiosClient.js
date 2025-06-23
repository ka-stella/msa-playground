import axios from "axios";
import router from "@/router";
import { AUTH_EXEMPT_API_PATHS } from "@/config/authExemptApiPaths";

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      //ログイン、ログアウト時の401はただの認証失敗なので何もしない
      const isExempt = AUTH_EXEMPT_API_PATHS.some((path) =>
        originalRequest.url.includes(path)
      );
      if (!isExempt) {
        console.warn("401 Unauthorized : ログインページへリダイレクト");
        router.push("/login");

        return Promise.reject(new Error("認証が必要です。"));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

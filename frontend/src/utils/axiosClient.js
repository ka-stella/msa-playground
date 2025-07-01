import axios from "axios";
import router from "@/router";
import { AUTH_EXEMPT_API_PATHS } from "@/config/authExemptApiPaths";

/**
 * Axiosの基本設定
 * - baseURL: APIのベースURLを取得
 * - timeout: リクエストのタイムアウトを10秒に設定
 * - withCredentials: クッキーを使用した認証を有効化
 * - headers: デフォルトのContent-TypeをJSONに設定
 */
const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * リクエストインターセプター
 * - リクエストが送信される前に処理を実行
 * - FormDataを使用する場合、Content-Typeヘッダーを自動設定させるため削除
 */
axiosClient.interceptors.request.use(
  (config) => {
    // リクエストデータがFormDataインスタンスの場合
    if (config.data instanceof FormData) {
      // ブラウザが自動でmultipart/form-dataを設定するため、Content-Typeを削除
      delete config.headers["Content-Type"];

      //タイムアウトを延長（画像アップロード用）
      config.timeout = 30000;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * レスポンスインターセプター
 * - レスポンスを受け取った後の処理を実行
 * - 主にエラーハンドリングを担当
 */
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

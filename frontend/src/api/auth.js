import axiosClient from "@/utils/axiosClient";

export const authApi = {
  /**
   * ログイン
   * @param {string} username ユーザ名
   * @param {string} password パスワード
   * @returns {Promise<AxiosResponse>}
   */
  login: async (username, password) => {
    return await axiosClient.post(
      `${process.env.VUE_APP_API_BASE_URL}/auth/login`,
      {
        username: username,
        password: password,
      }
    );
  },

  /**
   * ログアウト
   * @returns {Promise<AxiosResponse>}
   */
  logout: async () => {
    return await axiosClient.post(`${process.env.VUE_APP_API_BASE_URL}/logout`);
  },

  /**
   * ログイン状態の確認
   * @returns {Promise<AxiosResponse>}
   */
  checkAuthStatus: async () => {
    return await axiosClient.get("/auth/check");
  },

  /**
   * 認証ユーザ登録
   * @param {string} username
   * @param {string} password
   */
  resisterAuthUser: async (username, password) => {
    return await axiosClient.post(
      `${process.env.VUE_APP_API_BASE_URL}/auth/register`,
      {
        username: username,
        password: password,
      }
    );
  },
};

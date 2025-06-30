import axiosClient from "@/utils/axiosClient";

export const ocrxApi = {
  /**
   * 文字抽出
   * @param {FormData} formData
   * @returns {Promise<AxiosResponse>}
   */
  extract: async (formData) => {
    return await axiosClient.post(
      `${process.env.VUE_APP_API_BASE_URL}/ocrx/extract`,
      formData
    );
  },
};

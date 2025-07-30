import axiosClient from "@/utils/axiosClient";

const url = process.env.VUE_APP_API_BASE_URL;

export const memoApi = {
  fetchMemos: async () => {
    return await axiosClient.get(`${url}/memo/api/`);
  },

  fetchMemo: async (id) => {
    return await axiosClient.get(`${url}/memo/api/${id}`);
  },

  createMemo: async (title, content) => {
    return axiosClient.post(`${url}/memo/api/`, {
      title: title,
      content: content,
    });
  },

  updateMemo: async (id, title, content) => {
    return axiosClient.put(`${url}/memo/api/${id}`, {
      title: title,
      content: content,
    });
  },

  deleteMemo: async (id) => {
    return axiosClient.delete(`${url}/memo/api/${id}`);
  },
};

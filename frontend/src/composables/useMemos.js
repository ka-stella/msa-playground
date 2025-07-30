import { ref, onMounted } from "vue";
import { memoApi } from "@/api/memo";

export function useMemos() {
  const state = {
    memos: ref([]),
    newMemoTitle: ref(""),
    newMemoContent: ref(""),
    loading: ref(false),
  };

  const fetchMemos = async () => {
    state.loading.value = true;
    try {
      const response = await memoApi.fetchMemos();
      state.memos.value = response.data;
    } catch (error) {
      console.error("メモの取得に失敗しました:", error);
    } finally {
      state.loading.value = false;
    }
  };

  const createMemo = async (title, content) => {
    state.loading.value = true;
    try {
      await memoApi.createMemo(title, content);
      await fetchMemos();
      return true;
    } catch (error) {
      console.error("メモの作成に失敗しました:", error);
      return false;
    } finally {
      state.loading.value = false;
    }
  };

  const deleteMemo = async (id) => {
    state.loading.value = true;
    try {
      await memoApi.deleteMemo(id);
      await fetchMemos();
      return true;
    } catch (error) {
      console.error("メモの削除に失敗しました:", error);
      return false;
    } finally {
      state.loading.value = false;
    }
  };

  onMounted(fetchMemos);

  return {
    ...state,
    fetchMemos,
    createMemo,
    deleteMemo,
  };
}

import { ref, watch, onMounted, onUnmounted } from "vue";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { memoApi } from "@/api/memo";

const wsGatewayUrl = `${process.env.VUE_APP_API_BASE_WS_URL}/ws/yjs`;

export function useRealtimeMemo(memoId) {
  const state = {
    memoTitle: ref(""),
    memoContent: ref(""),
    syncing: ref(false),
    syncStatus: ref("disconnected"),
  };

  let ydoc;
  let ytextTitle;
  let ytextContent;
  let wsProvider;

  const initializeYjs = () => {
    if (wsProvider) {
      wsProvider.destroy();
      console.log("既存のYjs WebSocket接続を破棄しました");
    }
    if (ydoc) {
      ydoc.destroy();
      console.log("既存のYjs Docを破棄しました");
    }

    ydoc = new Y.Doc();
    ytextTitle = ydoc.getText(`memo-title-${memoId.value}`);
    ytextContent = ydoc.getText(`memo-content-${memoId.value}`);

    wsProvider = new WebsocketProvider(wsGatewayUrl, `${memoId.value}`, ydoc);

    // Yjsの変更をVueのrefに反映
    ytextTitle.observe(() => {
      state.memoTitle.value = ytextTitle.toString();
    });
    ytextContent.observe(() => {
      state.memoContent.value = ytextContent.toString();
    });

    wsProvider.on("status", (event) => {
      state.syncStatus.value = event.status;
      console.log(
        `Yjs WebSocket status for memo-${memoId.value}:`,
        event.status
      );
      if (event.status === "connected") {
        console.log("Yjs Sync Serviceに接続されました");
        laodMemoAndSyncToYjs();
      }
    });
    console.log(`YjsクライアントがメモID ${memoId.value} で初期化されました。`);
  };

  const laodMemoAndSyncToYjs = async () => {
    state.syncing.value = true;
    try {
      const response = await memoApi.fetchMemo(memoId.value);
      const memo = response.data;
      if (memo && ydoc && ytextTitle && ytextContent) {
        // Yjsドキュメントにトランザクションで変更を適用
        ydoc.transact(() => {
          ytextTitle.delete(0, ytextTitle.length);
          ytextTitle.insert(0, memo.title || "");
          ytextContent.delete(0, ytextContent.length);
          ytextContent.insert(0, memo.content || "");
        });
        console.log(
          "Memo Serviceから初期メモをロードし、Yjsに同期しました。",
          memo
        );
      }
    } catch (error) {
      console.error("メモの取得に失敗しました:", error);
    } finally {
      state.syncing.value = false;
    }
  };

  watch(state.memoTitle, (newValue) => {
    if (newValue !== ytextTitle.toString()) {
      ydoc.transact(() => {
        ytextTitle.delete(0, ytextTitle.length);
        ytextTitle.insert(0, newValue);
      });
    }
  });

  watch(state.memoContent, (newValue) => {
    if (newValue !== ytextContent.toString()) {
      ydoc.transact(() => {
        ytextContent.delete(0, ytextContent.length);
        ytextContent.insert(0, newValue);
      });
    }
  });

  const saveMemo = async () => {
    state.syncing.value = true;
    try {
      await memoApi.updateMemo(
        memoId.value,
        state.memoTitle.value,
        state.memoContent.value
      );
      return true;
    } catch (error) {
      console.error("メモの保存に失敗しました:", error);
      return false;
    } finally {
      state.syncing.value = false;
    }
  };

  onMounted(initializeYjs);

  onUnmounted(() => {
    if (wsProvider) {
      wsProvider.destroy();
      console.log("Yjs WebSocket接続を破棄しました。");
    }
    if (ydoc) {
      ydoc.destroy();
      console.log("Yjs Docを破棄しました。");
    }
  });

  watch(memoId, (newId, oldId) => {
    if (newId !== oldId) {
      console.log(
        `メモIDが ${oldId} から ${newId} に変更されました。Yjsを再初期化します。`
      );
      initializeYjs();
    }
  });

  return {
    ...state,
    saveMemo,
    loadMemo: laodMemoAndSyncToYjs,
  };
}

import { ref } from "vue";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

console.log("useMemo.js ファイルが読み込まれました。");

const API_ENDPOINTS = {
  MEMOS: "/memo",
  GET_ALL: "/app/memos.getAll",
  GET_BY_ID: "/app/memos.getById",
  CREATE: "/app/memos.create",
  UPDATE: "/app/memos.update",
  DELETE: "/app/memos.delete",
};

const TOPICS = {
  MEMOS: "/topic/memos.getAll",
};

const state = {
  memos: ref([]),
  loading: ref(false),
};

let stompClient = null;

const initializeWebSocket = () => {
  state.loading.value = true;
  const socket = new SockJS(
    `${process.env.VUE_APP_API_BASE_URL}${API_ENDPOINTS.MEMOS}`
  );

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: handleConnect,
    onStompError: handleStompError,
    onDisconnect: handleDisconnect,
  });

  console.log("WebSocket接続を開始します。");
  stompClient.activate();
};

const deactivateWebSocket = () => {
  console.log("WebSocket接続を解除します。");
  if (isStompClientConnected()) {
    stompClient.deactivate();
  }
};

const handleConnect = () => {
  console.log("STOMP connected!");
  state.loading.value = false;

  subscribeToTopics();
  fetchMemos();
};

const handleStompError = (frame) => {
  console.error("サーバーエラー:", frame.headers["message"], frame.body);
  state.loading.value = false;
};

const handleDisconnect = () => {
  console.log("STOMP disconect!");
};

const subscribeToTopics = () => {
  stompClient.subscribe(TOPICS.MEMOS, (message) => {
    console.log("メモ更新を受信しました:", message.body);
    state.memos.value = JSON.parse(message.body);
  });
};

const isStompClientConnected = () => {
  return stompClient && stompClient.connected;
};

//メモ一覧取得
const fetchMemos = () => {
  if (!isStompClientConnected()) {
    console.warn(
      "STOMPクライアントが接続されていません。メモ一覧取得をスキップします。"
    );
    return;
  }

  stompClient.publish({
    destination: API_ENDPOINTS.GET_ALL,
  });
};

//メモ作成
const createMemo = (title, content) => {
  if (!isStompClientConnected()) {
    console.warn(
      "STOMPクライアントが接続されていません。メモの作成をスキップします。"
    );
    return;
  }

  const memoRequest = {
    title: title,
    content: content,
  };

  stompClient.publish({
    destination: API_ENDPOINTS.CREATE,
    body: JSON.stringify(memoRequest),
    headers: { "content-type": "application/json" },
  });
};

// メモ編集
const editMemo = (memo) => {
  console.log("editMemo(実装予定)", memo);
};

// メモ削除
const deleteMemo = (id) => {
  if (!isStompClientConnected()) {
    console.warn(
      "STOMPクライアントが接続されていません。メモ削除をスキップします。"
    );
    return;
  }

  stompClient.publish({
    destination: API_ENDPOINTS.DELETE,
    body: JSON.stringify(id),
    headers: { "content-type": "application/json" },
  });
};

export const useMemo = () => {
  return {
    ...state,
    fetchMemos,
    createMemo,
    editMemo,
    deleteMemo,
    initializeWebSocket,
    deactivateWebSocket,
  };
};

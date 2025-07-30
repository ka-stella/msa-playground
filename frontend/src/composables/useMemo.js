import { ref } from "vue";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const API_ENDPOINTS = {
  MEMOS: "/memo",
  LIST: "/app/memos.list",
  SINGLE: "/app/memos.single",
  CREATE: "/app/memos.create",
  UPDATE: "/app/memos.update",
  DELETE: "/app/memos.delete",
};

const TOPICS = {
  LIST: "/topic/memos.list",
  SINGLE: "/user/topic/memos.single.",
};

const state = {
  memos: ref([]),
  fetchMemoId: ref(null),
  memo: ref(null),
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

  stompClient.activate();
};

const deactivateWebSocket = () => {
  if (isStompClientConnected()) {
    stompClient.deactivate();
  }
};

const handleConnect = () => {
  subscribeToTopics();
  fetchMemos();

  if (state.fetchMemoId.value) {
    fetchMemo(state.fetchMemoId.value);
  }

  state.loading.value = false;
};

const handleStompError = (frame) => {
  console.error("サーバーエラー:", frame.headers["message"], frame.body);
  state.loading.value = false;
};

const handleDisconnect = () => {
  console.log("STOMP disconect!");
};

const subscribeToTopics = () => {
  stompClient.subscribe(TOPICS.LIST, (message) => {
    state.memos.value = JSON.parse(message.body);
  });
};

//接続確認
const isStompClientConnected = () => {
  return stompClient && stompClient.connected;
};

const publishIfConnected = (options) => {
  if (!isStompClientConnected()) {
    console.warn(
      `STOMPクライアントが接続されていません。送信をスキップします: ${options.destination}`
    );
    return;
  }

  stompClient.publish(options);
};

//メモ一覧取得
const fetchMemos = () => {
  publishIfConnected({
    destination: API_ENDPOINTS.LIST,
  });
};

const fetchMemo = (id) => {
  publishIfConnected({
    destination: API_ENDPOINTS.SINGLE,
    body: JSON.stringify(id),
    headers: { "content-type": "application/json" },
  });

  stompClient.subscribe(TOPICS.SINGLE + id, (message) => {
    state.memo.value = JSON.parse(message.body);
  });
};

//メモ作成
const createMemo = (title, content) => {
  publishIfConnected({
    destination: API_ENDPOINTS.CREATE,
    body: JSON.stringify({
      title: title,
      content: content,
    }),
    hheaders: { "content-type": "application/json" },
  });
};

const updateMemo = () => {
  publishIfConnected({
    destination: API_ENDPOINTS.UPDATE,
    body: JSON.stringify({
      id: state.memo.value.id,
      title: state.memo.value.title,
      content: state.memo.value.content,
    }),
    headers: { "content-type": "application/json" },
  });
};

// メモ削除
const deleteMemo = (id) => {
  publishIfConnected({
    destination: API_ENDPOINTS.DELETE,
    body: JSON.stringify(id),
    headers: { "content-type": "application/json" },
  });
};

export const useMemo = () => {
  return {
    ...state,
    fetchMemos,
    fetchMemo,
    createMemo,
    updateMemo,
    deleteMemo,
    initializeWebSocket,
    deactivateWebSocket,
  };
};

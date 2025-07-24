<template>
  <v-container>
    <v-card class="mt-4">
      <v-card-title class="d-flex align-center">
        メモ一覧
        <v-spacer></v-spacer>
        <v-btn icon @click="fetchMemos" :loading="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="memos"
          item-key="id"
          class="elevation-1"
          :loading="loading"
          loading-text="メモを読み込み中..."
          no-data-text="まだメモはありません。"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td>{{ item.content }}</td>
              <td>
                <v-icon small class="mr-2" @click="editMemo(item)"
                  >mdi-pencil</v-icon
                >
                <v-icon small @click="deleteMemo(item.id)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const memos = ref([]);
const loading = ref(false);
let stompClient = null;

const headers = [
  { title: "タイトル", key: "title" },
  { title: "内容", key: "content" },
  { title: "操作", key: "actions", sortable: false },
];

const snackbar = ref({
  show: false,
  message: "",
  color: "",
  timeout: 3000,
});

// WebSocket接続の確立
const connectWebSocket = () => {
  loading.value = true;
  const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/memo`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("STOMP connected!");
      snackbar.value = {
        show: true,
        message: "WebSocketに接続しました。",
        color: "success",
        timeout: 3000,
      };
      loading.value = false;

      // メモ一覧の購読
      stompClient.subscribe("/topic/memos", (message) => {
        console.log("Memo update received:", message.body);
        const updatedMemos = JSON.parse(message.body);
        // バックエンドからの更新は全リストが送られてくると仮定
        memos.value = updatedMemos;
      });

      // メモ削除の購読
      stompClient.subscribe("/topic/memos.deleted", (message) => {
        console.log("Memo deleted received:", message.body);
        const deletedMemoId = JSON.parse(message.body);
        memos.value = memos.value.filter((memo) => memo.id !== deletedMemoId);
        snackbar.value = {
          show: true,
          message: "メモが削除されました。",
          color: "info",
          timeout: 3000,
        };
      });

      // 接続後、すぐにメモ一覧を取得
      fetchMemos();
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      snackbar.value = {
        show: true,
        message: "WebSocket接続エラーが発生しました。",
        color: "error",
        timeout: 5000,
      };
      loading.value = false;
    },
    onDisconnect: () => {
      console.log("STOMP disconnected!");
      snackbar.value = {
        show: true,
        message: "WebSocketから切断されました。",
        color: "warning",
        timeout: 3000,
      };
    },
  });

  stompClient.activate();
};

// メモ一覧の取得リクエスト
const fetchMemos = () => {
  if (stompClient && stompClient.connected) {
    loading.value = true;
    stompClient.publish({
      destination: "/app/memos.getAll",
      // getAllはペイロード不要
    });
    // @SendTo で /topic/memos にブロードキャストされるので、
    // ここで直接 memos.value を更新する必要はない
  } else {
    console.warn("STOMP client not connected. Cannot fetch memos.");
    snackbar.value = {
      show: true,
      message: "サーバーに接続されていません。",
      color: "warning",
      timeout: 3000,
    };
    loading.value = false;
  }
};

// メモの編集 (ダミー関数、実際はMemoFormなどに遷移)
const editMemo = (memo) => {
  console.log("Edit memo:", memo);
  snackbar.value = {
    show: true,
    message: `「${memo.title}」を編集する機能は未実装です。`,
    color: "info",
    timeout: 3000,
  };
  // ここでルーターで編集画面に遷移したり、ダイアログを開いたりする
};

// メモの削除
const deleteMemo = (id) => {
  if (confirm("このメモを削除しますか？")) {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/memos.delete",
        body: JSON.stringify(id), // UUIDを文字列として送信
        headers: {
          "content-type": "application/json", // UUIDをJSONとして送信する場合
        },
      });
    } else {
      console.warn("STOMP client not connected. Cannot delete memo.");
      snackbar.value = {
        show: true,
        message: "サーバーに接続されていません。",
        color: "warning",
        timeout: 3000,
      };
    }
  }
};

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate(); // disconnect() の代わりに deactivate() を使用
  }
});
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>

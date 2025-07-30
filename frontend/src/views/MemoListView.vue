<template>
  <v-container>
    <v-card class="mt-4">
      <v-card-title class="d-flex align-center">
        メモ一覧
        <v-spacer></v-spacer>
        <v-btn icon @click="fetchMemos" :loading="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon @click="addMemo">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="TABLE_HEADERS"
          :items="memos"
          :loading="loading"
          loading-text="読み込み中..."
          no-data-text="データがありません"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td>{{ item.content }}</td>
              <td>
                <v-icon small class="mr-2" @click="goToMemoEditor(item.id)"
                  >mdi-pencil</v-icon
                >
                <v-icon small @click="deleteMemo(item.id)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useMemo } from "@/composables/useMemo";
import { onMounted, onUnmounted } from "vue";

const TABLE_HEADERS = [
  { title: "タイトル", key: "title" },
  { title: "内容", key: "content" },
  { title: "操作", key: "actions", sortable: false },
];

const {
  memos,
  loading,
  fetchMemos,
  createMemo,
  deleteMemo,
  initializeWebSocket,
  deactivateWebSocket,
} = useMemo();

const router = useRouter();

const addMemo = () => {
  createMemo("新規メモ", "");
};

const goToMemoEditor = (id) => {
  router.push({ name: "memo-editor", params: { id } });
};

onMounted(() => {
  initializeWebSocket();
});

onUnmounted(() => {
  deactivateWebSocket();
});
</script>

<style lang="css" scoped></style>

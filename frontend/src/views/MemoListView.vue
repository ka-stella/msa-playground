<template>
  <v-container>
    <v-card class="mt-4">
      <v-card-title class="d-flex align-center">
        メモ一覧
        <v-spacer></v-spacer>
        <v-btn icon @click="fetchMemos" :loading="loading" class="mx-2">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon @click="handleCreateMemo">
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
                <v-icon small @click="handleDeleteMemo(item.id)"
                  >mdi-delete</v-icon
                >
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
import { useMemos } from "@/composables/useMemos";
import { useSnackbar } from "@/composables/useSnackbar";

const TABLE_HEADERS = [
  { title: "タイトル", key: "title" },
  { title: "内容", key: "content" },
  { title: "操作", key: "actions", sortable: false },
];

const router = useRouter();
const { showSnackbar } = useSnackbar();
const { memos, fetchMemos, createMemo, deleteMemo, loading } = useMemos();

const handleCreateMemo = async () => {
  const success = await createMemo("新しいメモ", "");
  if (success) {
    showSnackbar("メモが追加されました！");
  } else {
    showSnackbar("メモの追加に失敗しました。", true);
  }
};

const handleDeleteMemo = async (id) => {
  const success = await deleteMemo(id);
  if (success) {
    showSnackbar("メモが削除されました！");
  } else {
    showSnackbar("メモの削除に失敗しました。", true);
  }
};

const goToMemoEditor = (id) => {
  router.push({ name: "memo-editor", params: { id } });
};
</script>

<style lang="css" scoped></style>

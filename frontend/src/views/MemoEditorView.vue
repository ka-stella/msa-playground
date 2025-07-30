<template>
  <v-container>
    <v-card class="pa-4" v-if="memo">
      <v-text-field
        v-model="memo.title"
        label="メモのタイトル"
        variant="outlined"
        hide-details
        class="mb-4"
        @input="handleTitleInput"
      ></v-text-field>

      <v-textarea
        v-model="memo.content"
        label="メモの内容"
        variant="outlined"
        auto-grow
        rows="10"
        hide-details
        @input="handleContentInput"
      ></v-textarea>

      <v-divider class="my-4"></v-divider>

      <v-row align="center">
        <v-col cols="auto">
          <div v-if="editingUsers.length > 0" class="d-flex align-center">
            <span class="mr-2">共同編集者:</span>
            <v-avatar
              v-for="user in editingUsers"
              :key="user.id"
              size="32"
              class="mr-1"
              color="primary"
            >
              <span class="white--text text-caption">{{
                user.name[0].toUpperCase()
              }}</span>
            </v-avatar>
          </div>
          <div v-else class="text-caption text--secondary">
            現在、他に編集しているユーザーはいません。
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn color="primary" @click="saveMemo" :loading="isSaving">
            <v-icon left>mdi-content-save</v-icon>
            保存
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <div class="mt-4" v-else-if="loading">読み込み中...</div>
    <div class="mt-4" v-else>読み込み失敗</div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useMemo } from "@/composables/useMemo";
import { useSnackbar } from "@/composables/useSnackbar";

const { showSnackbar } = useSnackbar();
const {
  initializeWebSocket,
  deactivateWebSocket,
  fetchMemoId,
  memo,
  loading,
  updateMemo,
} = useMemo();
const route = useRoute();
const memoId = route.params.id;

// 共同編集者リスト（ダミーデータ）
const editingUsers = ref([
  { id: 1, name: "山田" },
  { id: 2, name: "佐藤" },
]);

const isSaving = ref(false);
const saveMemo = () => {
  isSaving.value = true;
  try {
    updateMemo();
    showSnackbar("保存しました。", false);
  } catch (e) {
    showSnackbar("保存に失敗しました。", true);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchMemoId.value = memoId;
  initializeWebSocket();
});

onUnmounted(() => {
  deactivateWebSocket();
});
</script>

<style lang="css" scoped></style>

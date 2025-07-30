<!-- <template>
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

<script setup></script>

<style lang="css" scoped></style> -->

<template>
  <v-container>
    <v-card class="mb-4" :loading="isSyncing">
      <v-card-title>
        メモ編集（ID: {{ memoId }}）
        <v-chip
          class="ml-auto"
          :color="syncStatus === 'connected' ? 'success' : 'error'"
          label
          small
        >
          {{ syncStatus === "connected" ? "同期中" : "オフライン" }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="memoTitle"
          label="タイトル"
          outlined
          dense
        ></v-text-field>
        <v-textarea
          v-model="memoContent"
          label="内容"
          outlined
          dense
          rows="10"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="handleSaveMemo" :loading="isSyncing"
          >メモを保存</v-btn
        >
        <v-btn color="secondary" @click="loadMemo" :loading="isSyncing"
          >最新をロード</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn text @click="$router.back()">一覧に戻る</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRealtimeMemo } from "@/composables/useRealtimeMemo";
import { ref, watch } from "vue";

const route = useRoute();
const memoId = ref(route.params.id);

const { memoTitle, memoContent, isSyncing, syncStatus, loadMemo, saveMemo } =
  useRealtimeMemo(memoId);

watch(
  () => route.params.id,
  (newId) => {
    memoId.value = newId;
  }
);

const handleSaveMemo = async () => {
  const success = await saveMemo();
  if (success) {
    alert("メモが保存されました！");
  } else {
    alert("メモの保存に失敗しました。");
  }
};
</script>

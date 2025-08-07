<template>
  <div id="vertical-editor">
    <header class="toolbar"></header>
    <main class="editor-area">
      <textarea
        class="text-input"
        v-model="text"
        placeholder="ここに文章を入力してください…"
      ></textarea>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const text = ref("");
</script>

<style></style>

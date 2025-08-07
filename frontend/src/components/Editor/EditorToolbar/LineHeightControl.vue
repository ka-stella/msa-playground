<template>
  <div>
    <span>行間: {{ currentLineHeight }}</span>
    <div>
      <button @click="adjustLineHeight(0.1)">+</button>
      <button @click="adjustLineHeight(-0.1)">-</button>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
import useLineHeight from "@/composables/Editor/useLineHeight";

const editor = inject("editor");
const { currentLineHeight, adjustLineHeight } = useLineHeight(editor);
</script>

<style lang="css" scoped>
.toolbar button {
  padding: 5px 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  writing-mode: horizontal-tb; /* ボタン内のテキストは横書きに戻す */
}

.toolbar button.is-active {
  background: #000;
  color: #fff;
}
</style>

<template>
  <div class="toolbar">
    <text-format-controls />
    <paragraph-control />
    <line-height-control />
    <text-align-control />
  </div>
</template>

<script setup>
import TextFormatControls from "./TextFormatControls.vue";
import ParagraphControl from "./ParagraphControl.vue";
import LineHeightControl from "./LineHeightControl.vue";
import TextAlignControl from "./TextAlignControl.vue";
</script>

<style scoped>
/* .toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  flex-direction: column;
} */

.editor-toolbar {
  writing-mode: vertical-rl;
  padding: 1rem;
  border-right: 1px solid #d4c5b3;
  background-color: #f1e7d8;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

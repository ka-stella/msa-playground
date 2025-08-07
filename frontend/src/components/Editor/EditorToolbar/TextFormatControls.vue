<template>
  <div class="controller">
    <button
      @click="editor.chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
    >
      太字
    </button>
    <button
      @click="editor.chain().focus().toggleItalic().run()"
      :class="{ 'is-active': editor.isActive('italic') }"
    >
      斜体
    </button>
  </div>
</template>

<script setup>
import { inject } from "vue";

const editor = inject("editor");
</script>

<style lang="css" scoped>
.controller {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  flex-direction: column;
}
.toolbar button {
  padding: 5px 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  writing-mode: horizontal-tb;
}

.toolbar button.is-active {
  background: #000;
  color: #fff;
}
</style>

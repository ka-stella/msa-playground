<template>
  <div class="controller">
    <button
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
    >
      見出し1
    </button>
    <button
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
    >
      見出し2
    </button>
    <button
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
    >
      見出し3
    </button>
    <button
      @click="editor.chain().focus().setParagraph().run()"
      :class="{ 'is-active': editor.isActive('paragraph') }"
    >
      段落
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

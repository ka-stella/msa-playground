<template>
  <div class="controller">
    <button
      @click="editor.chain().focus().setTextAlign('left').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
    >
      上
    </button>
    <button
      @click="editor.chain().focus().setTextAlign('center').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
    >
      中
    </button>
    <button
      @click="editor.chain().focus().setTextAlign('right').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
    >
      下
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

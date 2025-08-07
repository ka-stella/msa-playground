<template>
  <div class="editor-wrapper">
    <div v-if="editor" class="editor-container">
      <editor-content :editor="editor" />
    </div>
    <editor-toolbar v-if="editor" />
  </div>
</template>

<script setup>
import { provide } from "vue";
// Tiptapのエディタとコンテンツをインポート
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, LineHeight } from "@tiptap/extension-text-style";
import Paragraph from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extensions";
import { TextAlign } from "@tiptap/extension-text-align";
// カスタムツールバーコンポーネントをインポート
import EditorToolbar from "@/components/Editor/EditorToolbar/EditorToolbar.vue";

const editor = useEditor({
  content: "",
  extensions: [
    StarterKit.configure({
      paragraph: false,
    }),
    TextStyle,
    Paragraph,
    LineHeight,
    Placeholder.configure({
      placeholder: "こちらに入力してください。",
      showOnlyCurrent: true,
      emptyEditorClass: "is-editor-empty",
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      defaultAlignment: "left",
    }),
  ], // 拡張機能
});

provide("editor", editor);
</script>

<style scoped>
.editor-wrapper {
  margin: 20px auto;
  padding: 20px;
  display: flex;
  justify-content: end;
}

.editor-container {
  /* 縦書きの基本設定 */
  writing-mode: vertical-rl;
  /* text-orientation: upright; 文字を回転させずに表示 */
  height: 400px;
  /* 折り返し設定 */
  overflow-wrap: break-word;
  white-space: normal;
  margin-right: 50px;
}

/* Tiptapが生成するエディタ本体のスタイルをカスタマイズ */
.editor-wrapper :deep(.ProseMirror) {
  height: 100%;
  outline: none;
}
</style>

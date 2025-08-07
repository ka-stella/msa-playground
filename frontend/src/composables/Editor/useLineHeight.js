import { computed } from "vue";

export default function useLineHeight(editor) {
  const currentLineHeight = computed(() => {
    const lineHeight = editor.value.getAttributes("textStyle").lineHeight;
    return lineHeight ? parseFloat(lineHeight) : 1.5;
  });

  // 行間を設定
  const setLineHeight = (value) => {
    editor.value.chain().focus().setLineHeight(value.toFixed(1)).run();
  };

  // 行間を増減(0.5〜5.0の範囲に制限)
  const adjustLineHeight = (value) => {
    const newValue = currentLineHeight.value + value;
    setLineHeight(Math.max(0.5, Math.min(5.0, newValue)));
  };

  return {
    currentLineHeight,
    setLineHeight,
    adjustLineHeight,
  };
}

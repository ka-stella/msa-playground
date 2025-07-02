<template>
  <v-container fluid fill-height class="align-center">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-file-input
          v-model="file"
          accept="image/*"
          label="画像を選択"
          @change="handleFileChange"
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="6" style="display: flex; justify-content: center">
        <canvas
          ref="canvas"
          :width="canvasSize.width"
          :height="canvasSize.height"
          @mousedown="startDraw"
          @mousemove="drawRect"
          @mouseup="endDraw"
          class="canvas"
        ></canvas>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col
        cols="12"
        md="6"
        style="display: flex; justify-content: center; gap: 10px"
      >
        <v-btn
          @click="showMemo = !showMemo"
          size="x-large"
          rounded="xl"
          width="200"
        >
          選択領域
        </v-btn>
        <v-btn
          @click="sendToServer"
          :disabled="!file || regions.length === 0"
          color="primary"
          size="x-large"
          rounded="xl"
          width="200"
        >
          テキストを抽出
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4" outlined
          >結果
          <div
            v-for="(text, label) in results"
            :key="label"
            class="result-item"
          >
            <strong class="label">{{ label }}:</strong>
            <span class="text">{{ text }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="showMemo"
      width="400"
      :scrim="false"
      :persistent="false"
      style="position: fixed; top: 50px; left: 50px"
      class="memo-window"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <v-btn icon @click="showMemo = false" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <ul>
            <li v-for="(r, i) in regions" :key="i">
              {{ r.label }}: x={{ r.x }}, y={{ r.y }}, w={{ r.width }}, h={{
                r.height
              }}
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="clearRegions">領域クリア</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ocrxApi } from "@/api/ocrx";

const file = ref(null);
const image = new Image();
const canvas = ref(null);
const canvasSize = reactive({ width: 800, height: 600 });
const ctx = ref(null);

const results = ref({});

const regions = ref([]);
const drawing = ref(false);
const start = ref({ x: 0, y: 0 });

const showMemo = ref(false);

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
};

const handleFileChange = async () => {
  if (!file.value) return;

  try {
    const dataURL = await readFileAsDataURL(file.value);
    image.src = dataURL;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    canvasSize.width = image.width;
    canvasSize.height = image.height;
    drawImage();
  } catch (error) {
    console.error("Error handling file:", error);
  }
};

const drawImage = () => {
  ctx.value.clearRect(0, 0, canvasSize.width, canvasSize.height);
  ctx.value.drawImage(image, 0, 0);
  // 既存の矩形も再描画
  regions.value.forEach((r) => {
    ctx.value.strokeStyle = "red";
    ctx.value.strokeRect(r.x, r.y, r.width, r.height);
  });
};

const startDraw = (e) => {
  drawing.value = true;
  const rect = canvas.value.getBoundingClientRect();
  start.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const drawRect = (e) => {
  if (!drawing.value) return;
  drawImage();
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = x - start.value.x;
  const h = y - start.value.y;

  ctx.value.strokeStyle = "blue";
  ctx.value.strokeRect(start.value.x, start.value.y, w, h);
};

const endDraw = (e) => {
  drawing.value = false;
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const region = {
    label: `領域${regions.value.length + 1}`,
    x: Math.min(x, start.value.x),
    y: Math.min(y, start.value.y),
    width: Math.abs(x - start.value.x),
    height: Math.abs(y - start.value.y),
  };
  regions.value.push(region);
  drawImage();
};

const sendToServer = async () => {
  try {
    const formData = new FormData();
    formData.append("file", file.value);
    formData.append("regions", JSON.stringify(regions.value));

    const response = await ocrxApi.extract(formData);

    if (response.data && response.data.data) {
      results.value = response.data.data;
    }
  } catch (error) {
    console.error("文字抽出エラー:", error);
    // results.value = `OCR処理失敗: ${
    //   error.response?.data?.message || error.message
    // }`;
  }
};

const clearRegions = () => {
  regions.value = [];
  drawImage();
};

onMounted(() => {
  ctx.value = canvas.value.getContext("2d");
});
</script>

<style lang="css" scoped>
.canvas {
  border: 1px solid #ccc;
}
</style>

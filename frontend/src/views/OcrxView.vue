<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 mb-4">画像からの文字抽出</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">
            <v-icon left>mdi-upload</v-icon>
            画像をアップロード
          </v-card-title>
          <v-card-text>
            <v-file-input
              label="画像を選択してください"
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              counter
              @change="handleFileChange"
            ></v-file-input>
            <div
              class="drop-area d-flex align-center justify-center text-center pa-5 mt-3"
              @dragover.prevent="dragOver = true"
              @dragleave.prevent="dragOver = false"
              @drop.prevent="handleDrop"
              :class="{ 'on-drag-over': dragOver }"
            >
              <p v-if="!dragOver">または画像をここにドラッグ＆ドロップ</p>
              <p v-else>ドロップしてください！</p>
            </div>
            <v-btn
              color="primary"
              block
              class="mt-4"
              :disabled="!selectedImageFile"
              @click="uploadImage"
            >
              <v-icon left>mdi-image-plus</v-icon>
              画像を処理
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">
            <v-icon left>mdi-image-area</v-icon>
            アップロードされた画像
          </v-card-title>
          <v-card-text
            class="d-flex align-center justify-center"
            style="min-height: 200px"
          >
            <v-img
              v-if="imageUrl"
              :src="imageUrl"
              alt="アップロードされた画像"
              contain
              max-height="400px"
            ></v-img>
            <p v-else class="text-medium-emphasis">
              ここにアップロードされた画像が表示されます
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">
            <v-icon left>mdi-text-box-outline</v-icon>
            抽出された文字
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="extractedText"
              label="抽出されたテキスト"
              rows="8"
              auto-grow
              outlined
              readonly
              no-resize
            ></v-textarea>
            <p v-if="!extractedText" class="text-medium-emphasis">
              ここに画像から抽出されたテキストが表示されます。
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ocrxApi } from "@/api/ocrx";
import { ref } from "vue";

const selectedImageFile = ref(null);
const imageUrl = ref(null);
const extractedText = ref("");
const dragOver = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files ? event.target.files[0] : null;

  if (file && file.type.startsWith("image/")) {
    selectedImageFile.value = file;
    imageUrl.value = URL.createObjectURL(file);
    extractedText.value = "";
  } else {
    selectedImageFile.value = null;
    imageUrl.value = null;
    extractedText.value = "";
    alert("画像ファイルを選択してください。");
  }
};

const handleDrop = (event) => {
  dragOver.value = false;
  const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
  if (file && file.type.startsWith("image/")) {
    selectedImageFile.value = file;
    imageUrl.value = URL.createObjectURL(file);
    extractedText.value = "";
  } else {
    selectedImageFile.value = null;
    imageUrl.value = null;
    extractedText.value = "";
    alert("画像ファイルを選択してください。");
  }
};

const uploadImage = async () => {
  if (!selectedImageFile.value) {
    alert("アップロードする画像を選択してください。");
    return;
  }

  try {
    extractedText.value = "文字を抽出中です...";

    const formData = new FormData();
    formData.append("file", selectedImageFile.value);

    const response = await ocrxApi.extract(formData);
    if (response.data && response.data.extracted_text) {
      extractedText.value = response.data.extractedText;
    } else {
      extractedText.value =
        "文字の抽出に成功しましたが、抽出されたテキストが見つかりません。";
    }
  } catch (error) {
    console.error("文字抽出エラー:", error);
    extractedText.value = `OCR処理失敗: ${
      error.response?.data?.message || error.message
    }`;
  }
};
</script>

<style scoped>
.drop-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  min-height: 50px;
  transition: all 0.3s ease;
  color: #666;
}

.drop-area.on-drag-over {
  border-color: var(--v-theme-primary);
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>

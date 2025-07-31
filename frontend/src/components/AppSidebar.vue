<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="emit('update:drawer', $event)"
    app
  >
    <v-list dense nav>
      <v-list-item to="/" link>
        <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
        <v-list-item-title>ホーム</v-list-item-title>
      </v-list-item>

      <v-list-item to="/ocrx" link>
        <v-list-item-icon><v-icon>mdi-scanner</v-icon></v-list-item-icon>
        <v-list-item-title>画像から文字を抽出</v-list-item-title>
      </v-list-item>

      <v-list-item to="/memos" link>
        <v-list-item-icon><v-icon>mdi-note</v-icon></v-list-item-icon>
        <v-list-item-title>メモ</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  drawer: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:drawer"]);
</script>

<style scoped></style>

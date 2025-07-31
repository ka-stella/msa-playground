<template>
  <v-app-bar app dark>
    <v-app-bar-nav-icon @click="emit('toggle-sidebar')"></v-app-bar-nav-icon>
    <v-app-bar-title>My App</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn to="/" icon> <v-icon>mdi-account-circle</v-icon> </v-btn>
    <v-btn @click="handleLogout" icon> <v-icon>mdi-logout</v-icon> </v-btn>
  </v-app-bar>
</template>

<script setup>
import { authApi } from "@/api/auth";
import router from "@/router";
import { defineEmits } from "vue";

const emit = defineEmits(["toggle-sidebar"]);

//ログアウト
const handleLogout = async () => {
  try {
    await authApi.logout();
    router.push("/login");
  } catch (error) {
    if (error.response) {
      console.error("ログアウト失敗:", error.response.data.message);
    } else {
      console.error("ネットワークエラー:", error.message);
    }
  }
};
</script>

<style scoped></style>

<template>
  <button @click="handleLogout">ログアウト</button>
</template>

<script setup>
import { useRouter } from "vue-router";
import { authApi } from "@/api/auth";

const router = useRouter();

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

<style scoped>
button {
  padding: 10px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
button:hover {
  background-color: #c82333;
}
</style>

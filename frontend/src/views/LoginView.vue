<template>
  <div class="login">
    <h1>ログイン</h1>
    <form @submit.prevent="submitLogin">
      <div>
        <label for="username">ユーザー名:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">パスワード:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">ログイン</button>
    </form>

    <!-- ソーシャルログインセクション -->
    <div class="social-login">
      <p class="divider">または</p>

      <div class="social-buttons">
        <!-- Googleログイン -->
        <button class="social-btn google" @click="socialLogin('google')">
          Googleで続ける
        </button>
      </div>
    </div>
    <p v-if="message" :class="{ error: isError }">{{ message }}</p>
  </div>
</template>

<script setup>
import { authApi } from "@/api/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const message = ref("");
const isError = ref("");
const router = useRouter();

const submitLogin = async () => {
  try {
    message.value = "ログイン処理中...";
    isError.value = false;

    const response = await authApi.login(username.value, password.value);

    message.value = response.data.message;
    username.value = "";
    password.value = "";

    router.push("/dashboard");
  } catch (error) {
    isError.value = true;
    if (error.response) {
      message.value = error.response.data.message || "ログインに失敗しました。";
    } else {
      message.value = "ネットワークエラーが発生しました。";
    }
  }
};

const socialLogin = (media) => {
  if (media === "google") {
    window.location.href = `${process.env.VUE_APP_API_BASE_URL}/auth/social/google`;
  }
};
</script>

<style scoped>
.login {
  margin-top: 50px;
}
.login div {
  margin-bottom: 10px;
}
.login label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
.login input[type="text"],
.login input[type="password"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.login button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
.login button:hover {
  background-color: #368a65;
}
.login p {
  margin-top: 20px;
  color: green;
}
.login p.error {
  color: red;
}
</style>

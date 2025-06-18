<template>
  <div class="register">
    <h1>ユーザー登録</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">ユーザー名:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">パスワード:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">登録</button>
    </form>
    <p v-if="message" :class="{ error: isError }">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  name: "RegisterView",
  setup() {
    const username = ref("");
    const password = ref("");
    const message = ref("");
    const isError = ref(false);

    // メソッド
    const register = async () => {
      try {
        message.value = "登録処理中...";
        isError.value = false;

        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/auth/register`,
          {
            username: username.value,
            password: password.value,
          }
        );
        message.value = response.data.message;
        username.value = "";
        password.value = "";
      } catch (error) {
        isError.value = true; // エラーフラグを立てる
        message.value = error.response?.data?.message || "登録に失敗しました。";
        console.error("登録エラー:", error);
      }
    };

    // テンプレートで使用するデータとメソッドを返す
    return {
      username,
      password,
      message,
      isError,
      register,
    };
  },
};
</script>

<style scoped>
/* スタイルは変更なし */
.register {
  margin-top: 50px;
}
.register div {
  margin-bottom: 10px;
}
.register label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
.register input[type="text"],
.register input[type="password"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.register button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
.register button:hover {
  background-color: #368a65;
}
.register p {
  margin-top: 20px;
  color: green; /* 成功メッセージの色 */
}
.register p.error {
  color: red; /* エラーメッセージの色 */
}
</style>

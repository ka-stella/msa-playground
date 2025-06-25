<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>ログイン</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="loginForm">
              <v-text-field
                label="ユーザーID"
                name="userId"
                prepend-icon="mdi-account"
                type="text"
                v-model="username"
                :rules="[(v) => !!v || 'ユーザーIDは必須です']"
                required
              ></v-text-field>

              <v-text-field
                label="パスワード"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
                :rules="[(v) => !!v || 'パスワードは必須です']"
                required
              ></v-text-field>
            </v-form>

            <v-btn
              block
              large
              color="white"
              class="login-btn black--text"
              @click="login"
            >
              ログイン
            </v-btn>

            <div class="text-center my-4">または</div>

            <v-btn
              block
              large
              color="white"
              class="login-btn black--text"
              @click="loginWithGoogle('google')"
            >
              <v-icon left>mdi-google</v-icon>
              Googleでログイン
            </v-btn>
          </v-card-text>
        </v-card>
        <div class="text-center mt-6">
          アカウントをお持ちでないですか？
          <router-link to="/register">今すぐ登録</router-link>
        </div>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="isError ? 'error' : 'success'"
      :timeout="3000"
    >
      {{ message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false"> 閉じる </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authApi } from "@/api/auth";

const username = ref("");
const password = ref("");
const snackbar = ref(false);
const message = ref("");
const isError = ref("");
const router = useRouter();
const loginForm = ref(null);

const login = async () => {
  // フォームのバリデーション
  const { valid } = await loginForm.value.validate();
  if (!valid) {
    return;
  }

  try {
    snackbar.value = false;
    message.value = "ログイン処理中...";
    isError.value = false;

    const response = await authApi.login(username.value, password.value);

    message.value = response.data.message;
    snackbar.value = true;
    username.value = "";
    password.value = "";

    router.push("/");
  } catch (error) {
    isError.value = true;
    snackbar.value = true;
    if (error.response) {
      message.value = error.response.data.message || "ログインに失敗しました。";
    } else {
      message.value = "ネットワークエラーが発生しました。";
    }
  }

  router.push("/");
};

const loginWithGoogle = (media) => {
  if (media === "google") {
    window.location.href = `${process.env.VUE_APP_API_BASE_URL}/auth/social/google`;
  }
};
</script>

<style scoped>
/* .fill-height {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
} */

.login-btn {
  background-color: #4285f4 !important; /* Google Blue */
  color: white !important;
}

.login-btn .v-icon {
  margin-right: 8px;
}
</style>

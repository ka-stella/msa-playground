<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>新規ユーザー登録</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="registerForm">
              <v-text-field
                label="ユーザーID"
                name="username"
                prepend-icon="mdi-account-plus"
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
              @click="register"
            >
              登録
            </v-btn>

            <v-divider class="my-4"></v-divider>

            <v-card-text class="text-center pa-0">
              すでにアカウントをお持ちですか？
              <router-link to="/login" class="text-decoration-none"
                >ログインはこちら</router-link
              >
            </v-card-text>
          </v-card-text>
        </v-card>
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
import { authApi } from "@/api/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const snackbar = ref(false);
const message = ref("");
const isError = ref("");
const router = useRouter();
const registerForm = ref(null);

const register = async () => {
  const { valid } = await registerForm.value.validate();
  if (!valid) {
    return;
  }

  try {
    snackbar.value = false;
    message.value = "登録処理中...";
    isError.value = false;

    const response = await authApi.resisterAuthUser(
      username.value,
      password.value
    );

    message.value = response.data.message;
    snackbar.value = true;
    username.value = "";
    password.value = "";
    router.push("/login");
  } catch (error) {
    isError.value = true;
    snackbar.value = true;
    if (error.response) {
      message.value = error.response.data.message || "登録に失敗しました。";
    } else {
      message.value = "ネットワークエラーが発生しました。";
    }
    console.error("登録エラー:", error);
  }
};
</script>

<style scoped>
.login-btn {
  background-color: #4285f4 !important; /* Google Blue */
  color: white !important;
}

.login-btn .v-icon {
  margin-right: 8px;
}
</style>

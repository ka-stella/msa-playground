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
  </v-container>
</template>

<script setup>
import { authApi } from "@/api/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSnackbar } from "@/composables/useSnackbar";

const username = ref("");
const password = ref("");
const router = useRouter();
const registerForm = ref(null);
const { showSnackbar } = useSnackbar();

const register = async () => {
  const { valid } = await registerForm.value.validate();
  if (!valid) {
    return;
  }

  try {
    showSnackbar("登録処理中...");

    const response = await authApi.resisterAuthUser(
      username.value,
      password.value
    );

    showSnackbar(response.data.message);

    username.value = "";
    password.value = "";
    router.push("/login");
  } catch (error) {
    if (error.response) {
      showSnackbar(error.response.data.message || "登録に失敗しました。", true);
    } else {
      showSnackbar("ネットワークエラーが発生しました。", true);
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

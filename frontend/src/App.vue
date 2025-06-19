<template>
  <nav>
    <router-link to="/register">ユーザー登録</router-link> |
    <router-link to="/login">ログイン</router-link>
    <button @click="handleLogout">ログアウト</button>
  </nav>
  <router-view />
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const handleLogout = async () => {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/logout`
    );

    console.log(response.data.message);

    router.push("/login");
  } catch (error) {
    console.error("ログアウトエラー:", error);
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

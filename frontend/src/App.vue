<template>
  <nav>
    <router-link to="/register">ユーザー登録</router-link> |
    <router-link to="/login">ログイン</router-link>
    <LogoutButton />
  </nav>
  <router-view />
</template>

<script setup>
import LogoutButton from "@/components/LogoutButton.vue";
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

<template>
  <v-app>
    <!-- ヘッダー -->
    <AppHeader
      @toggle-sidebar="drawer = !drawer"
      v-if="!$route.meta.guestOnly"
    />
    <!-- サイドバー -->
    <AppSidebar v-model:drawer="drawer" v-if="!$route.meta.guestOnly" />
    <!-- メインコンテンツ -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";

const drawer = ref(true);
</script>

<style scoped></style>

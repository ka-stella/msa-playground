<template>
  <v-container></v-container>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

onMounted(() => {
  const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/memo`);
  const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("STOMP connected!");
      stompClient.subscribe("/topic/memo", (message) => {
        console.log("Message received:", message.body);
      });
    },
  });

  stompClient.activate();
});

onUnmounted(() => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log("Disconnected");
    });
  }
});
</script>

<style lang="css" scoped></style>

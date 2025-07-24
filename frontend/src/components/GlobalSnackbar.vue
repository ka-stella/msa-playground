<template>
  <v-snackbar
    v-model="snackbar"
    :color="isError ? 'error' : 'success'"
    :timeout="timeout"
  >
    {{ message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="hideSnackbar"> 閉じる </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useSnackbar } from "@/composables/useSnackbar";

const { snackbar, message, isError, timeout, hideSnackbar } = useSnackbar();
</script>

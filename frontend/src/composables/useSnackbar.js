import { ref, readonly } from "vue";

const snackbar = ref(false);
const message = ref("");
const isError = ref(false);
const timeout = ref(3000);

export function useSnackbar() {
  const showSnackbar = (msg, error = false, customTimeout = 3000) => {
    message.value = msg;
    isError.value = error;
    timeout.value = customTimeout;
    snackbar.value = true;
  };

  const hideSnackbar = () => {
    snackbar.value = false;
  };

  return {
    snackbar: readonly(snackbar),
    message: readonly(message),
    isError: readonly(isError),
    timeout: readonly(timeout),
    showSnackbar,
    hideSnackbar,
  };
}

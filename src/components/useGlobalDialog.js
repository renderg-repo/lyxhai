import { ref } from 'vue';

export function useGlobalDialog() {
  const visible = ref(false);

  const openDialog = () => {
    visible.value = true;
  };

  const closeDialog = () => {
    visible.value = false;
  };

  const confirmDialog = () => {
    // 你可以在这里添加其他逻辑，比如提交表单等
    visible.value = false;
  };

  return {
    visible,
    openDialog,
    closeDialog,
    confirmDialog
  };
}

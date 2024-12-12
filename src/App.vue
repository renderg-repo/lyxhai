<template>
  <div id="app_con" :class="{ scrollable: isSmallViewport }">
    <el-config-provider namespace="">
      <router-view></router-view>
      <!-- 将上传组件全局注册 -->
      <GlobalUploader ref="globalUploader" />
    </el-config-provider>
  </div>
</template>

<script setup>
const isSmallViewport = ref(false);
import { provide, ref } from "vue";
import GlobalUploader from "@/components/GlobalUploader/GlobalUploader.vue";

const globalUploader = ref(null);
provide("globalUploader", globalUploader);

onMounted(() => {
  checkViewportSize();
  window.addEventListener("resize", checkViewportSize);
});

function checkViewportSize() {
  isSmallViewport.value = window.innerWidth < 1200;
}
</script>

<style lang="less" scoped>
#app_con {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  // color: rgba(225, 225, 225, 0.85);
}

* {
  box-sizing: border-box;
}

*::before,
*::after {
  box-sizing: border-box;
}

.scrollable {
  overflow-x: scroll;
}
</style>

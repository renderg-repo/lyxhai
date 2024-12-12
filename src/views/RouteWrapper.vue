<template>
  <div class="RouteWrapper">
    <div class="RouteWrapper_con">
      <el-aside class="left" :width="isSmallViewport ? '250px' : '250px'">
        <Menu></Menu>
      </el-aside>
      <div class="right">
        <Header></Header>
        <div class="right_con flex-column">
          <!-- <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
          -->
          <router-view v-slot="{ Component }">
      
              <component :is="Component"></component>
      
          </router-view>
          <GlobalDialog />
        </div>
      </div>
      <!-- <Footer></Footer> -->
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/header.vue";
// import Footer from "@/components/footer.vue";
import Menu from "@/components/menu.vue";
import { useGlobalDialog } from '@/components/useGlobalDialog';
import GlobalDialog from '@/components/GlobalDialog.vue';
const globalDialog = useGlobalDialog();
provide('globalDialog', globalDialog);
// console.log("Providing globalDialog:", globalDialog); // 调试信息
const isSmallViewport = ref(false);
function checkViewportSize() {
  isSmallViewport.value = window.innerWidth <= 768;
}

onMounted(() => {
  checkViewportSize();
  window.addEventListener("resize", checkViewportSize);
});
</script>

<style lang="less" scoped>
.RouteWrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #E1E2E4;
}

.RouteWrapper_con {
  display: flex;
  height: 100%;

  .left {
    z-index: 9;
    box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.32);
  }

  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
    // height: 100%;
    overflow: auto;

    .right_con {

      flex: 1;
      box-sizing: border-box;
      background: #E1E2E4;
      overflow: auto;
      position: relative;
      margin-top: 20px;
      scrollbar-width:thin;
    }
  }
}
</style>

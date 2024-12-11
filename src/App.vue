<template>
<div id="app">
  <router-view />
</div>
</template>

<script>
import {
  mapActions
} from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      isLogin: false,
    }
  },
  mounted() {
    // 监听消息
    window.addEventListener('message', this.handleMessage);
    // 监听屏幕宽度变化，动态调整样式
    // this.scaleAndCenterApp();
    this.addResizeObserver();
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage);
    this.removeResizeObserver();
  },
  methods: {
    ...mapActions(['setScreenWidth']),
    // 从gpu管理后台获取token
    handleMessage(event) {
      try {
        // console.log(event)
        if (event.origin === this.$config.basicUrl) {
          if (event.data.type === 'LOGIN_SUCCESS') {
            // 将获取到的token信息存储在本地
            this.$store.dispatch('setTokenInfo', event.data)
          }
          if (event.data.type === "EXIT_SUCCESS") {
            // 退出登录
            this.$store.dispatch("removeToken");
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 监听屏幕宽度变化
    scaleAndCenterApp() {
      const app = document.getElementById('app');
      const screenWidth = window.innerWidth;
      this.setScreenWidth(screenWidth);
      // 仅当屏幕宽度大于 1920 时调整样式
      // if (screenWidth > 1920) {
      //   const scale = screenWidth / 1920; // 计算缩放比例
      //   app.style.transform = `scale(${scale})`;
      //   app.style.transformOrigin = 'top left';
      //   app.style.position = 'absolute';
      //   app.style.left = `${(screenWidth - 1920 * scale) / 2}px`; // 水平居中
      //   app.style.top = '0'; // 固定顶部位置
      // } else {
      //   // 恢复原始样式
      //   app.style.transform = '';
      //   app.style.position = '';
      //   app.style.left = '';
      //   app.style.top = '';
      // }
    },
    // 缩放监听器
    addResizeObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.scaleAndCenterApp();
      });
      this.resizeObserver.observe(document.body);
    },
    // 移除监听器
    removeResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: PingFang SC-Regular, PingFang SC-Medium, PingFang SC-Semibold, PingFang SC, Source Han Sans, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: transform 0.2s ease;
  width: 100vw;
  transform-origin: top left;
  // background-color: #0D131E;
  background: url('../src/assets/images/public/background-image.png') no-repeat ;
  background-size: 100% 100%;
}
</style>

<template>
<div class="example flex-align-center flex-column-direction">
  <h1 class="section-title section-title-0">开箱即用 快速部署AI应用</h1>
  <p class="section-description">预装环境，一键部署，专注模型开发。热门主流大模型 AI 程序快速部署。</p>
  <div class="example-content flex-align-center mb40">
    <div class="example-item flex-align-center" @mouseenter="handleMouse(index, true)" @mouseleave="handleMouse(index, false)" v-for="(item, index) in exampleList" :key="index">
      <img class="example-img" :src="item.image" alt="">
      <div class="example-img-mask" v-if="item.showBtn">
        <div class="start-btn example-start-btn" @click="toPath(item.url)" @mouseenter="item.hover = true" @mouseleave="item.hover = false">
          <span>立即开始</span>
          <img class="start-btn-icon" :src="item.hover ? item.icon_hover_url : item.icon_url"/>
        </div>
      </div>
    </div>
  </div>
  
</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // TODO 镜像携带参数跳转
      exampleList: [
        {
          image: require('../../assets/images/example/example01.png'),
          showBtn: false,
          url: "",
          hover: false,
          icon_url: require("../../assets/image/public/direction_right.svg"),
          icon_hover_url: require("../../assets/image/public/direction_right_hover.svg"),
        },
        {
          image: require('../../assets/images/example/example02.png'),
          showBtn: false,
          url: "",
          hover: false,
          icon_url: require("../../assets/image/public/direction_right.svg"),
          icon_hover_url: require("../../assets/image/public/direction_right_hover.svg"),
        },
        {
          image: require('../../assets/images/example/example03.png'),
          showBtn: false,
          url: "",
          hover: false,
          icon_url: require("../../assets/image/public/direction_right.svg"),
          icon_hover_url: require("../../assets/image/public/direction_right_hover.svg"),
        },
      ]
    }
  },
  computed: {
    ...mapGetters(["screenWidth"])
  },
  methods: {
    handleMouse(index, boolean) {
      this.exampleList[index].showBtn = boolean
    },
    // 立即前往
    toPath(url) {
      window.open(`${this.$config.basicUrl}/user/login`, '_blank');
    },
  },
}
</script>

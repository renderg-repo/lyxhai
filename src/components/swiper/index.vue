<template>
<div class="swiper">
  <div class="swiper-box">
    <el-carousel class="show-up-md" :interval="5000" arrow="never" :autoplay="false">
      <el-carousel-item >
        <img src="../../assets/images/swiper/swiper-0.png" class="banner-img" />
        <div class="swiper-banner-img">
          <img src="../../assets/images/swiper/swiper-icon.png" alt="">
        </div>
        <div class="swiper-description">
          <h2 class="swiper-subhead" style="font-size: 72px; line-height: 96px;">专为AI而生的<br/>高性能云</h2>
          <div @click="toPath" class="swiper-start-btn1 flex-align-center flex-between">
            <span>立即开始</span>
            <img src="../../assets/images/swiper/vector.svg" alt="">
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item >
        <img src="../../assets/images/swiper/swiper-1.png" class="banner-img" />
        <div class="swiper-description">
          <h2 class="swiper-title" style="font-size: 50px;">释放计算潜力</h2>
          <p class="swiper-subhead">GPU云平台助力创新</p>
          <p class="swiper-desc">轻松获取强大计算资源，满足深度学习、数据分析和图形渲染的各种需求</p>
          <div class="swiper-start-btn flex-align-center flex-center" @click="toPath" >
            <span>立即开始</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item >
        <img src="../../assets/images/swiper/swiper-2.png" class="banner-img" />
        <div class="swiper-description">
          <h2 class="swiper-title" style="font-size: 50px;">RTX 4090 算力租赁</h2>
          <p class="swiper-subhead" style="font-size: 64px;">低至1.76元/<span style="font-size: 50px;">卡/时</span> </p>
          <p class="swiper-desc">多款高性能GPU灵活供应，超值性价比 <br/>助力AI项目快速启动</p>
          <div class="swiper-start-btn flex-align-center flex-center" @click="toPath" >
            <span>立即开始</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
  <FastRegister></FastRegister>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import FastRegister from '../register/index'
export default {
  name: 'swiperBox',
  components: {
    FastRegister
  },
  computed: {
    ...mapGetters(['screenWidth'])
  },
  data() {
    return {
      phone: '',
      bannerList: [
        // {
        //   id: 1,
        //   image_xxl: require("../../assets/images/swiper/swiper-0.png"),
        //   image_xl: require("../../assets/images/swiper/swiper-0.png"),
        //   image_lg: require("../../assets/images/swiper/swiper-0.png"),
        //   image_md: require("../../assets/images/swiper/swiper-0.png"),
        //   image_sm: require("../../assets/images/swiper/swiper-0.png"),
        //   image_xs: require("../../assets/images/swiper/swiper-0.png"),
        //   title: "专为AI而生产的 高性能云",
        //   desc_first: "GPU云平台助力创新",
        //   desc_second: "轻松获取强大计算资源，满足深度学习、数据分析和图形渲染的各种需求",
        //   btn_text: "立即开始",
        //   hover: false,
        //   icon_url: require("../../assets/image/public/direction_right.svg"),
        //   icon_hover_url: require("../../assets/image/public/direction_right_hover.svg")
        // },
        {
          id: 2,
          image_xxl: require("../../assets/images/swiper/swiper-1.png"),
          image_xl: require("../../assets/images/swiper/swiper-1.png"),
          image_lg: require("../../assets/images/swiper/swiper-1.png"),
          image_md: require("../../assets/images/swiper/swiper-1.png"),
          image_sm: require("../../assets/images/swiper/swiper-1.png"),
          image_xs: require("../../assets/images/swiper/swiper-1.png"),
          title: "释放计算潜力",
          desc_first: "GPU云平台助力创新",
          desc_second: "轻松获取强大计算资源，满足深度学习、数据分析和图形渲染的各种需求",
          btn_text: "立即开始",
          hover: false,
          icon_url: require("../../assets/image/public/direction_right.svg"),
          icon_hover_url: require("../../assets/image/public/direction_right_hover.svg")
        },
        {
          id: 3,
          image_xxl: require("../../assets/images/swiper/swiper-2.png"),
          image_xl: require("../../assets/images/swiper/swiper-2.png"),
          image_lg: require("../../assets/images/swiper/swiper-2.png"),
          image_md: require("../../assets/images/swiper/swiper-2.png"),
          image_sm: require("../../assets/images/swiper/swiper-2.png"),
          image_xs: require("../../assets/images/swiper/swiper-2.png"),
          title: "释放计算潜力",
          desc_first: "GPU云平台助力创新",
          desc_second: "轻松获取强大计算资源，满足深度学习、数据分析和图形渲染的各种需求",
          btn_text: "立即开始",
          hover: false,
          icon_url: require("../../assets/image/public/direction_right.svg"),
          icon_hover_url: require("../../assets/image/public/direction_right_hover.svg")
        },
      ]
    }
  },
  methods: {
    handleClickStart(id) {
      console.log('id', id)
      var url
      if (id == 1) {
        url = this.$config.pageUrlPro + "/user/login";
      } else if (id == 2) {
        url = this.$config.pageUrlPro + "/user/register";
      } else {
        url = 'https://help.lyxhai.com/document/activities/invitation_rewards_program/invitation_rewards_program.html'
      }
      window.open(url, "_blank");
    },
    toPath () {
      window.open(`${this.$config.pageUrlPro}/user/login`, '_blank')
    }
  },
}
</script>

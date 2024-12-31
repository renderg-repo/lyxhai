<template>
<div class="footer container">
  <div class="footer-content ">
    <div class="footer-logo flex-center">
      <img class="logo-img" src="../../assets/images/public/logo-light.png" />
    </div>
    <div class="footer-row">
      <div class="footer-list">
        <ul class="flex-align-center flex-center">
          <li v-for="(item, index) in tabList" :key="index" >
            <a target="_blank" v-if="index == 4" :href="item.path">{{item.title}}</a>
            <router-link v-else :to="item.path">{{item.title}}</router-link>
          </li>
        </ul>
      </div>
      <div class="footer-text footer-address">
        公司地址：浙江省衢州市龙游县龙洲街道龙翔路378号209室，浙江省衢州市龙游县荣昌东路2号金融中心A幢-1501、1502、1503
      </div>
      <div class="footer-text copyright-line">
        <div class="footer-platform flex-center">
          <p class="copyright">备案号：<a target="_blank" href="https://beian.miit.gov.cn">{{number}}</a></p>
          <p>手机号：13693374149</p>
        </div>
      </div>
      <div class="foot-apply flex-center">
        <div v-for="(item, index) in platformList" :key="index" class="footer-platform-item">
          <el-popover placement="top" trigger="hover" popper-class="footer-popover">
            <div class="flex-algin-center flex-column footer-popover-content">
              <img :src="item.qrCode" class="footer-platform-item-qccode" />
              <p class="footer-platform-item-title">扫码关注{{ item.title }}</p>
            </div>
            <img :src="item.image" slot="reference" />
          </el-popover>
        </div>
      </div>
      <div class="mt20 footer-text flex-center">
        联系我们: 抖音 | 微信
      </div>
      <div class="show-down-and-sm mt60">
        <div class="footer_widget">
          <!-- <h4 class="mb20">公司地址</h4>
          <div class="widget_content">
            <ul>
              <li class="exclude">
                <span v-if="screenWidth > 1440">北京：</span>
                <span>北京市海淀区双清路77号双清大厦4号楼5层</span>
              </li>
              <li class="exclude">
                <span v-if="screenWidth > 1440">衢州：</span>
                <span>浙江省衢州市龙游县荣昌东路2号金融中心A幢A-1703</span>
              </li>
            </ul>
          </div> -->
        </div>
      </div>
    </div>
  </div>
  
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
export default {
  computed: {
    ...mapGetters(['screenWidth']),
  },
  data() {
    return {
      // localhost: 'spacehpc.com',
      number: '浙ICP备2020034496号-10',
      platformList: [{
          image: require("../../assets/images/public/douyin-icon.png"),
          url: "https://www.douyin.com/user/MS4wLjABAAAA6JtigcRTN5A4yY-IOqimKbbJcfGrobP-avfNbV_T5veCK8eI8nyQ24zgBAgzFt_1",
          qrCode: require("../../assets/image/footer/douyin-ly.jpg"),
          title: "抖音",
          showQRcode: false
        },
        {
          image: require("../../assets/images/public/weixin-icon.png"),
          url: "https://work.weixin.qq.com/kfid/kfc9bc28e0f847fbdb1",
          qrCode: require("../../assets/image/footer/wechat-ly.jpg"),
          title: "公众号",
          showQRcode: false
        }
      ],
      tabList: [
        { path: "/", title: "主页" },
        { path: "/mirror", title: "镜像中心" },
        { path: "/computing", title: "算力服务器" },
        { path: "/news", title: "新闻" },
        { path: "https://help.spacehpc.com/", title: "帮助文档" },
        { path: "/", title: "联系我们" },
        { path: "/", title: "加入我们" },
        { path: "/", title: "关于我们" },
      ],
    }
  },
  created() {
    this.year = new Date().getFullYear()
  },
  methods: {
    // 社交媒体跳转
    handlePlatformClick(url) {
      window.open(url, '_blank');
    }
  },
}
</script>

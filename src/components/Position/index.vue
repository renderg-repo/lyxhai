<template>
  <div>
    <ul v-if="showIcon" class="ContactbarContainer ">
      <li class="mb30 flex-align-center flex-center" @mouseenter="backTopEnter(1)" @mouseleave="backTopLeave(0)" @click="backTop">
        <img src="../../assets/image/public/backTop-active.png" alt="" v-if="showBack">
        <img src="../../assets/image/public/backTop.png" alt="" v-else>
      </li>
      <li class="flex-align-center flex-center hidden-xs-only" @mouseenter="chatEnter(1)" @mouseleave="chatLeave(0)">
        <a target="_blank" href="https://work.weixin.qq.com/kfid/kfc9bc28e0f847fbdb1">
          <img src="../../assets/image/public/chat-active.png" v-if="showChat" alt="">
          <img src="../../assets/image/public/chat.png"  alt="" v-else>
        </a>
      </li>
      <li class="flex-align-center flex-center hidden-sm-and-up">
        <a href="https://work.weixin.qq.com/kfid/kfc9bc28e0f847fbdb1">
          <img src="../../assets/image/public/chat.png" alt="">
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showIcon: false,
      showBack: false,
      showChat: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  methods: {
     // 点击图片回到顶部方法，加计时器是为了过渡顺滑
    backTop() {
      let that = this
      that.showBack = false;
      let timer = setInterval(() => {
          let ispeed = Math.floor(-that.scrollTop / 5)
          document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
          if(that.scrollTop === 0) {
              clearInterval(timer)
          }
      }, 16)
    },
    scrollToTop () {
      let that = this;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      that.scrollTop = scrollTop
      if (that.scrollTop > 1500) {
        this.showIcon = true
      } else {
        this.showIcon = false
      }
    },
    backTopEnter () {
      this.showBack = true
    },
    backTopLeave () {
      this.showBack = false
    },
    chatEnter () {
      this.showChat = true
    },
    chatLeave () {
      this.showChat = false
    },
    openChat () {
       window.open('https://vip.renderg.com/pcwebchat.html?accessId=7d13cd10-00d0-11ec-9203-7bfa31e35dcb&autoShow=true&language=ZHCN&customField={"from":"renderg"}', "_blank")
    }
  }
}
</script>

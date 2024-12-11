<template>
<!-- 合作伙伴 -->
<div class="partner flex-align-center flex-column-direction">
  <h2 class="section-title partner-title mb40">{{title}}</h2>
  <div class="partner-content flex-align-center flex-between flex-wrap">
    <div class="partner-item flex-align-center flex-center" v-for="(item, index) in partnerList" :key="index">
      <div class="partner-img">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    showDot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      partnerList: [{
          image: require('../../assets/image/index/partner/partner01.png')
        },
        {
          image: require('../../assets/image/index/partner/partner02.png')
        },
        {
          image: require('../../assets/image/index/partner/partner03.png')
        },
        {
          image: require('../../assets/image/index/partner/partner04.png')
        },
        {
          image: require('../../assets/image/index/partner/partner05.png')
        },
        {
          image: require('../../assets/image/index/partner/partner06.png')
        },
        {
          image: require('../../assets/image/index/partner/partner07.png')
        },
        {
          image: require('../../assets/image/index/partner/partner08.png')
        },
        {
          image: require('../../assets/image/index/partner/partner09.png')
        },
        {
          image: require('../../assets/image/index/partner/partner10.png')
        },
        {
          image: require('../../assets/image/index/partner/partner11.png')
        },
        {
          image: require('../../assets/image/index/partner/partner12.png')
        },
        {
          image: require('../../assets/image/index/partner/partner13.png')
        },
        {
          image: require('../../assets/image/index/partner/partner14.png')
        },
        {
          image: require('../../assets/image/index/partner/partner15.png')
        },
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #0E1018;
}
</style>

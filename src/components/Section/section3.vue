<template>
<!-- 优势 -->
<div class="advantage flex-align-center flex-column-direction">
  <h2 class="section-title mb40">专业且高效的高性能GPU云</h2>
  <div class="advantage-content flex-align-center flex-between flex-wrap mb40">
    <div class="advantage-item flex-align-center flex-center mt20" v-for="(item, index) in advantageList" :key="index">
      <el-image :src="item.image" alt="" :lazy="true">
        <div slot="placeholder" class="image-slot">
          <img :src="item.loadImg" alt="">
        </div>
      </el-image>
    </div>
  </div>
  <p class="section-description">顶尖云服务供应商之一，专注算力行业10年+</p>
</div>
</template>

<script>
export default {
  data() {
    return {
      // TODO 图片上传替换
      advantageList: [{
          image: require('../../assets/image/index/advantage/advantage01.svg'),
          loadImg: require('../../assets/image/index/advantage/advantage01.svg'),
          // title: 'VFX',
          // desc: '专属团队  定制服务',
          // showTitle: false,
        },
        {
          image: require('../../assets/image/index/advantage/advantage02.svg'),
          loadImg: require('../../assets/image/index/advantage/advantage02.svg'),
          // title: 'VFX',
          // desc: '专属团队  定制服务',
          // showTitle: false,
        },
        {
          image: require('../../assets/image/index/advantage/advantage03.svg'),
          loadImg: require('../../assets/image/index/advantage/advantage03.svg'),
          // title: 'VFX',
          // desc: '专属团队  定制服务',
          // showTitle: false,
        },
        {
          image: require('../../assets/image/index/advantage/advantage04.svg'),
          loadImg: require('../../assets/image/index/advantage/advantage04.svg'),
          // title: 'VFX',
          // desc: '专属团队  定制服务',
          // showTitle: false,
        }
      ]
    }
  },
}
</script>

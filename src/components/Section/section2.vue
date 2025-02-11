<template>
<!-- 主流软件和插件 -->
<div class="software flex-column-direction flex-align-center">
  <div class="software-header">
    <h2 class="section-title mb20">支持全部主流镜像和插件</h2>
    <!-- <p class="section-description">支持自定义用户镜像</p> -->
  </div>
  <div class="software-content flex-align-center flex-between flex-wrap">
    <div 
      v-for="(item, index) in softwareList" :key="index" 
      class="software-item flex-center">
      <div>
        <div class="software-img flex-align-center flex-center">
          <el-image :src="item.image" alt="" :lazy="true">
            <div slot="placeholder" class="image-slot">
              <img :src="item.loadImg" alt="">
            </div>
          </el-image>
        </div>
        <p class="software-title">{{ item.title }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.el-col-lg-7 {
  width: 14%;
}
</style>

<script>
export default {
  data() {
    return {
      softwareList: [{
          image: require('../../assets/image/index/software/centos.svg'),
          loadImg: require('../../assets/image/index/software/centos.svg'),
          title: 'CentOS'
        },
        {
          image: require('../../assets/image/index/software/ubuntu.svg'),
          loadImg: require('../../assets/image/index/software/ubuntu.svg'),
          title: 'Ubuntu'
        },
        {
          image: require('../../assets/image/index/software/windows.svg'),
          loadImg: require('../../assets/image/index/software/windows.svg'),
          title: 'Windows'
        },
        {
          image: require('../../assets/image/index/software/debian.svg'),
          loadImg: require('../../assets/image/index/software/debian.svg'),
          title: 'Debian'
        },
        {
          image: require('../../assets/image/index/software/kolors.svg'),
          loadImg: require('../../assets/image/index/software/kolors.svg'),
          title: 'Kolors'
        },
        {
          image: require('../../assets/image/index/software/Miniconda3.svg'),
          loadImg: require('../../assets/image/index/software/Miniconda3.svg'),
          title: 'MiniConda'
        },
        {
          image: require('../../assets/image/index/software/pyTorch.svg'),
          loadImg: require('../../assets/image/index/software/pyTorch.svg'),
          title: 'PyTorch'
        },
        {
          image: require('../../assets/image/index/software/tensorFlow.svg'),
          loadImg: require('../../assets/image/index/software/tensorFlow.svg'),
          title: 'TensorFlow'
        },
        // {
        //   image: require('../../assets/image/index/software/TensorRT.svg'),
        //   loadImg: require('../../assets/image/index/software/TensorRT.svg'),
        //   title: 'TensorRT'
        // },
        {
          image: require('../../assets/image/index/software/GLM.svg'),
          loadImg: require('../../assets/image/index/software/GLM.svg'),
          title: 'GLM'
        },
        {
          image: require('../../assets/image/index/software/Fooocus.svg'),
          loadImg: require('../../assets/image/index/software/Fooocus.svg'),
          title: 'Fooocus'
        },
        {
          image: require('../../assets/image/index/software/stable_diffusion_icon.svg'),
          loadImg: require('../../assets/image/index/software/stable_diffusion_icon.svg'),
          title: 'Stable Diffusion'
        },
        {
          image: require('../../assets/image/index/software/docker.svg'),
          loadImg: require('../../assets/image/index/software/docker.svg'),
          title: 'Docker'
        },
        {
          image: require('../../assets/image/index/software/ue.svg'),
          loadImg: require('../../assets/image/index/software/ue.svg'),
          title: 'Unreal Engine'
        },
        {
          image: require('../../assets/image/index/software/gpt_sovits.svg'),
          loadImg: require('../../assets/image/index/software/gpt_sovits.svg'),
          title: 'GPT SoVITS'
        },
        {
          image: require('../../assets/image/index/software/meta.svg'),
          loadImg: require('../../assets/image/index/software/meta.svg'),
          title: 'Llama'
        },
        {
          image: require('../../assets/image/index/software/MuseTalk.svg'),
          loadImg: require('../../assets/image/index/software/MuseTalk.svg'),
          title: 'Muse Talk'
        },
        // {
        //   image: require('../../assets/image/index/software/ChatTTS.svg'),
        //   loadImg: require('../../assets/image/index/software/ChatTTS.svg'),
        //   title: 'ChatTTS'
        // },
      ]
    }
  },
}
</script>

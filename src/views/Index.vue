<template>
  <div class="container index">
    <!-- 头部 -->
    <Header :active="0"></Header>
    <!-- 轮播 -->
    <swiperBox></swiperBox>
    <!-- 示例 -->
    <Example></Example>
    <!-- 价格 -->
    <PriceDetail></PriceDetail>
    <!-- 软件 -->
    <Software></Software>
    <!-- 优势 -->
    <Advantage></Advantage>
    <!-- 合作伙伴 -->
    <Partner :title="'合作伙伴'"></Partner>
    <!-- 底部 -->
    <Footer></Footer>
    <!-- 侧边回到顶部 -->
    <Position></Position>
  </div>
</template>

<script>
import Header from '../components/Header/index'
import swiperBox from '../components/swiper/index'
import Example from '../components/Section/section0'
import PriceDetail from '../components/Section/section1'
import Software from '../components/Section/section2'
import Advantage from '../components/Section/section3'
import Partner from '../components/Section/section4'
import Position from '../components/Position/index'
import Footer from '../components/Footer/index'
export default {
  components: {
    Header,
    swiperBox,
    Example,
    PriceDetail,
    Software,
    Advantage,
    Partner,
    Position,
    Footer
  },
  data() {
    return {}
  },
}
</script>

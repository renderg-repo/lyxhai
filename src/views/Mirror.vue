<template>
  <div>
    <Header :active="1"></Header>
    <Mirror></Mirror>
    <Position></Position>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../components/Header/index'
import Position from '../components/Position/index'
import Footer from '../components/Footer/index'
import Mirror from '../components/Mirror/index'
export default {
  components: {
    Header,
    Position,
    Mirror,
    Footer,
  },
  data() {
    return {

    }
  },
}
</script>

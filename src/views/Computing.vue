<template>
  <div class="container">
    <Header :active="2"></Header>
    <Computing></Computing>
    <Position></Position>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../components/Header/index'
import Computing from '../components/Computing/index'
import Position from '../components/Position/index'
import Footer from '../components/Footer/index'
export default {
  components: {
    Header,
    Computing,
    Position,
    Footer,
  },
  data() {
    return {

    }
  },
}
</script>

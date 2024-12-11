<template>
  <div class="container">
    <Header :active="3"></Header>
    <News></News>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../components/Header/index'
// import News from '../components/News/index'
import News from '../components/News/index_data'
import Footer from '../components/Footer/index'
export default {
  components: {
    Header,
    News,
    Footer
  },
  data() {
    return {

    }
  },
}
</script>

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss';
import axios from 'axios'
import qs from 'qs'
import api from './assets/js/api.js'
import config from "./assets/js/config.js";

import MetaInfo from 'vue-meta-info'
Vue.use(MetaInfo)

import animated from 'animate.css';
Vue.use(animated)

import ElementUI from 'element-ui'
Vue.use(ElementUI)
// Vue.use(Swiper)
import 'element-ui/lib/theme-chalk/display.css';
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$axios= axios
Vue.prototype.$qs = qs
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.prototype.$config = config;

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title == undefined?'龙游星海-政企算力GPU平台-租显卡选星海智算':to.meta.title
  window.scrollTo(0,0)
  next();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


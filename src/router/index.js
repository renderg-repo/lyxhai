import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Mirror from "../views/Mirror.vue";
import Computing from "../views/Computing.vue";
import News from '../views/News.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '*',
  //   component: NotFoundComponent
  // },
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/mirror',
    name: 'Mirror',
    component: Mirror
  },
  {
    path: '/computing',
    name: 'Computing',
    component: Computing
  },
  {
    path: '/news',
    name: 'News',
    component: News
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router

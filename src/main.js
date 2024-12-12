import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";
import router from "./routers/routes";

import "animate.css";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import "@/assets/css/global_reset.css";
import "@/assets/css/reset.less";
import "@/assets/css/refine.less";

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import '@/assets/fonts/style.css'
import '@/assets/fonts/font.css'
// vue-simple-uploader
import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'
import { Icon } from '@iconify/vue'

import VueCountdown from '@chenfengyuan/vue-countdown';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(uploader)
app.use(ElementPlus, {
    locale: zhCn,
});
app.component('Icon', Icon)
app.component(VueCountdown.name, VueCountdown);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount("#app");

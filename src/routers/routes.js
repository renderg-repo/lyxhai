import { createRouter, createWebHistory } from "vue-router";
import login from "./login";
import system from "./system";
import routeWrapper from "./routeWrapper";
import { useMineStore } from "@/store/mine";
import { ElMessage } from "element-plus";

const app = localStorage.getItem("application");
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [login, system, routeWrapper],
});
// 添加路由错误处理
router.onError((error) => {
  console.warn('Router error:', error);
  if (error.type === 2 && error.message.includes('No match found')) {
    console.warn('No route match found for:', error.location.path);
    router.push({ name: 'NotFound' });
  }
});
// 路由守卫
router.beforeEach((to, from, next) => {
  const mineStore = useMineStore();

  // 如果路径包含 "/user/"，直接放行
  if (to.path.includes("/user/")) {
    next();
    return; // 添加 return 确保后续代码不执行
  }

  // 如果没有 token，重定向到登录页面
  if (!mineStore.tokenInfo.token) {
    console.log("No token found, redirecting to login");
    localStorage.setItem("redirectAfterLogin", to.fullPath); // 保存尝试访问的完整路径
    next("/user/login");
    return; // 添加 return 确保后续代码不执行
  }

  // 解决页面刷新应用切换问题
  if (from.path === "/" && mineStore.tokenInfo.token) {
    if (app === "ai" && to.path === "/sshManage") {
      console.log('Redirecting from /sshManage to /hosts for app "ai"');
      next("/hosts");
      return;
    }
    if (app === "sc" && to.path === "/hosts") {
      console.log('Redirecting from /hosts to /sshManage for app "sc"');
      next("/sshManage");
      return;
    }
  }

  // 如果没有其他匹配的重定向逻辑，正常放行
  next();
});

export default router;

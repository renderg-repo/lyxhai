import home from "./home";
import mine from "./mine";
import defineRoute from "./defineRoute";

export default defineRoute({
  path: "/",
  // redirect: "/sshManage",
  component: () => import("@/views/RouteWrapper.vue"),
  children: [
    home,
    mine,
    // 添加 404 路由作为最后一个子路由
    {
      path: ":pathMatch(.*)*",
      name: "NotFound",
      meta: {
        title: "404 - 页面未找到",
        isAuth: false, // 或 true，取决于你的需求
      },
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

import { RouterView } from "vue-router";
import defineRoute from "./defineRoute";

export default defineRoute({
  path: "/user",
  meta: {
    title: "",
  },
  component: RouterView,
  children: [
    {
      path: "login",
      meta: {
        title: "登录",
      },
      component: () => import("@/views/login/login.vue"),
    },
    {
      path: "register",
      meta: {
        title: "注册",
      },
      component: () => import("@/views/login/register.vue"),
    },
    {
      path: "resetPassword",
      meta: {
        title: "重置密码",
      },
      component: () => import("@/views/login/resetPassword.vue"),
    },
  ],
});

import { RouterView } from "vue-router";
import defineRoute from "./defineRoute";

export default defineRoute({
  path: "mine",
  meta: {
    // title: "控制台",
  },
  component: RouterView,
  children: [
    {
      path: "overview",
      meta: {
        title: "账户概览",
        isAuth: true,
      },
      component: () => import("@/views/mine/overview.vue"),
    },
    {
      path: "recharge",
      meta: {
        title: "充值中心",
        isAuth: true,
      },
      component: () => import("@/views/mine/recharge.vue"),
    },
    {
      path: "recharge1",
      meta: {
        title: "充值中心1",
        isAuth: true,
      },
      component: () => import("@/views/mine/recharge1.vue"),
    },
    {
      path: "orderlist",
      meta: {
        title: "我的订单",
        isAuth: true,
      },
      component: () => import("@/views/mine/orderlist.vue"),
    },
    {
      path: "orderDetail/:orderNo", // 修改路径以包含动态参数
      meta: {
        title: "订单详情",
        isAuth: true,
      },
      component: () => import("@/views/mine/orderDetail.vue"),
    },
    {
      path: "accountDetails",
      meta: {
        title: "账单明细",
        isAuth: true,
      },
      component: () => import("@/views/mine/accountDetails.vue"),
    },
    {
      path: "accountSecurity",
      meta: {
        title: "账户安全",
        isAuth: true,
      },
      component: RouterView, // 使用 RouterView 以支持子路由
      children: [
        {
          path: "",
          meta: {
            title: "账户安全",
            isAuth: true,
          },
          component: () => import("@/views/mine/accountSecurity.vue"),
        },
        {
          path: "realNameAuth",
          meta: {
            title: "实名认证",
            isAuth: true,
          },
          component: () => import("@/views/mine/realNameAuth.vue"),
        },
        {
          path: "enterpriseAuth",
          meta: {
            title: "企业认证",
            isAuth: true,
          },
          component: () => import("@/views/mine/enterpriseAuth.vue"),
        },
      ],
    },
    {
      path: "secretKeyManage",
      meta: {
        title: "密钥管理",
        isAuth: true,
      },
      component: () => import("@/views/mine/secretKeyManage.vue"),
    },
  ],
});

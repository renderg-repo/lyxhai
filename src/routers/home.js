import { RouterView } from "vue-router";
import defineRoute from "./defineRoute";

export default defineRoute({
  path: "",
  meta: {
    title: "控制台",
  },
  redirect: "/dashboard",
  component: RouterView,
  children: [
    {
      path: "dashboard",
      meta: {
        title: "控制台",
        isAuth: true,
      },
      component: () => import("@/views/home/dashboard.vue"),
    },
    {
      path: "pushRecords",
      meta: {
        title: "推送记录",
        isAuth: true,
      },
      component: () => import("@/views/home/pushRecords.vue"),
    },

    {
      path: "taskList",
      meta: {
        title: "任务列表",
        isAuth: true,
      },
      component: () => import("@/views/home/taskList.vue"),
    },
    {
      path: "sshManage",
      meta: {
        title: "SSH管理",
        isAuth: true,
      },
      component: () => import("@/views/home/sshManage.vue"),
    },
    {
      path: "tempSubmission",
      meta: {
        title: "模版提交",
        isAuth: true,
      },
      component: () => import("@/views/home/tempSubmission.vue"),
    },
    {
      path: "gui",
      meta: {
        title: "图形界面",
        isAuth: true,
      },
      component: () => import("@/views/home/hosts.vue"),
    },
    {
      path: "hosts",
      meta: {
        title: "GPU实例",
        isAuth: true,
      },
      component: () => import("@/views/home/hosts.vue"),
    },
    {
      path: "create",
      meta: {
        title: "创建主机",
        isAuth: true,
      },
      component: () => import("@/views/home/create.vue"),
    },
    {
      path: "create1",
      meta: {
        title: "创建主机",
        isAuth: true,
      },
      component: () => import("@/views/home/create1.vue"),
    },
    {
      path: "vm",
      meta: {
        title: "虚拟机",
        isAuth: true,
      },
      component: () => import("@/views/home/vm.vue"),
    },
    {
      path: "fileTransfer",
      meta: {
        title: "文件传输",
        isAuth: true,
      },
      component: () => import("@/views/home/fileTransfer.vue"),
    },
    {
      path: "mirrorCenter",
      meta: {
        title: "镜像",
        isAuth: true,
      },
      component: () => import("@/views/home/mirrorCenter.vue"),
    },
    {
      path: "iconpage",
      meta: {
        title: "全部图标",
        isAuth: true,
      },
      component: () => import("@/views/system/iconpage.vue"),
    },
  ],
});

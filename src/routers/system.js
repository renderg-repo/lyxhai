import { RouterView } from "vue-router";
import defineRoute from "./defineRoute";

export default defineRoute({
  path: "/system",
  meta: {
    title: "",
  },
  component: RouterView,
  children: [
    {
      path: "managedNode",
      meta: {
        title: "管理节点",
      },
      component: () => import("@/views/system/managedNode.vue"),
    },
  ],
});

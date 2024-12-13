<template>
  <div class="menu">
    <div class="menu_con">
      <div class="logo">
        <img :src="logoUrl" alt="" class="logo_img" @click="logoClick" />
      </div>
      <div class="menu-box">
        <div class="operate team" style="padding: 19px 0px 20px 0px;">

          <div class="item select_none" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)"
            :class="[isActive(item.url) || current_url == '/pushRecords' ? 'active_i' : '']" v-for="item in dashboard"
            @click="itemClick(item)">
            <div class="item_con">
              <img :src="loadImage(
                hoverSet[`${getLastPathSegment(item.url)}Hover`] || isActive(item.url) || current_url == '/pushRecords'
                  ? item.iconActive
                  : item.icon
              )" alt="" />
              <div class="title">{{ item.title }}</div>
            </div>
            <div class="active_hr" v-show="isActive(item.url)"></div>
          </div>
        </div>
        <div class="hr"></div>
        <div class="operate team" style="padding: 19px 0px 20px 0px;">

          <div class="item select_none" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)"
            :class="[isActive(item.url) || current_url == '/create' ? 'active_i' : '']" v-for="item in aiOperate"
            @click="itemClick(item)">
            <div class="item_con">
              <img :src="loadImage(
                hoverSet[`${getLastPathSegment(item.url)}Hover`] || isActive(item.url) || current_url == '/create'
                  ? item.iconActive
                  : item.icon
              )" alt="" />
              <div class="title">{{ item.title }}</div>
            </div>
            <div class="active_hr" v-show="isActive(item.url) || current_url == '/create'"></div>
          </div>
        </div>
        <div class="hr"></div>
        <div class="other team">
          <div class="item select_none" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)"
            :class="[isActive(item.url) ? 'active_i' : '']" v-for="item in other" :key="item.title"
            @click="itemClick(item)">
            <div class="item_con">
              <img :src="loadImage(
                hoverSet[`${getLastPathSegment(item.url)}Hover`] || isActive(item.url)
                  ? item.iconActive
                  : item.icon
              )" alt="" />
              <div class="title">{{ item.title }}</div>
            </div>
            <div class="active_hr" v-show="isActive(item.url)"></div>
          </div>
        </div>
        <div class="hr"></div>
        <div class="other team" style="padding: 20px 0px 20px 0px;">
          <template v-for="(item, i) in mine" :key="(item, i).title">
            <div class="item select_none" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)"
              :class="[isActive(item.url) ? 'active_i' : '']" @click="itemClick(item)">
              <div class="item_con">
                <img :src="loadImage(
                  hoverSet[`${getLastPathSegment(item.url)}Hover`] || isActive(item.url)
                    ? item.iconActive
                    : item.icon
                )" alt="" />
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="active_hr" v-show="isActive(item.url)"></div>
            </div>
          </template>
        </div>
        <div class="hr"></div>
        <div class="other team ">
          <div class="item select_none" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)"
            v-for="item in customer" :key="item.title" @click="openGlobalDialog(item)">
            <div class="item_con">
              <img :src="loadImage(
                hoverSet[`${getLastPathSegment(item.url)}Hover`] || isActive(item.url)
                  ? item.iconActive
                  : item.icon
              )" alt="" />
              <div class="title">{{ item.title }}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed, inject } from "vue";
const globalDialog = inject('globalDialog');

const logoUrl = import.meta.env.VITE_APP_LOGO;
const route = useRoute();
const router = useRouter();
import { useMineStore } from "@/store/mine";

const hoverSet = reactive({
  dashboardHover: false,
  taskListHover: false,
  sshManageHover: false,
  tempSubmissionHover: false,
  guiHover: false,
  fileTransferHover: false,
  mirrorCenterHover: false,
  accountSecurityHover: false,
  secretKeyManageHover: false,
});

const getLastPathSegment = (path) => {
  const lastSlashIndex = path.lastIndexOf("/");
  return path.substring(lastSlashIndex + 1);
};

const hoverItem = (item) => {
  hoverSet[`${getLastPathSegment(item.url)}Hover`] = true;
};

const leaveItem = (item) => {
  hoverSet[`${getLastPathSegment(item.url)}Hover`] = false;
};

const dashboard = ref([
  {
    icon: "dashboard@2x",
    iconActive: "dashboard_click@2x",
    title: "控制台",
    url: "/dashboard",
  },
]);
const mineStore = useMineStore();
const operate = ref([
  {
    icon: "taskList@2x",
    iconActive: "taskList_click@2x",
    title: "任务列表",
    url: "/taskList",
  },
  {
    icon: "sshManage@2x",
    iconActive: "sshManage_click@2x",
    title: "SSH管理",
    url: "/sshManage",
  },
  {
    icon: "tempSubmission@2x",
    iconActive: "tempSubmission_click@2x",
    title: "模板提交",
    url: "/tempSubmission",
  },
  {
    icon: "gui@2x",
    iconActive: "gui_click@2x",
    title: "图形界面",
    url: "/gui",
  },
]);

const aiOperate = ref([
  {
    icon: "GPU_Normal@2x",
    iconActive: "GPU_Hover@2x",
    title: "GPU实例",
    url: "/hosts",
  },
]);

const other = ref([
  {
    icon: "fileTransfer@2x",
    iconActive: "fileTransfer_click@2x",
    title: "网盘",
    url: "/fileTransfer",
  },
  {
    icon: "mirrorCenter@2x",
    iconActive: "mirrorCenter_click@2x",
    title: "镜像",
    url: "/mirrorCenter",
  },
]);
const customer = ref([{
  icon: "chat_fill_normal",
  iconActive: "chat_fill_hover",
  title: "客服支持",
  url: "/chat_fill",
},])

const mine = ref([
  {
    icon: "finance",
    iconActive: "finance_click",
    title: "充值中心",
    url: "/mine/recharge",
  },
  // {
  //   icon: "finance",
  //   iconActive: "finance_click",
  //   title: "充值中心1",
  //   url: "/mine/recharge1",
  // },
  {
    icon: "bill@2x",
    iconActive: "bill_click",
    title: "我的订单",
    url: "/mine/orderlist",
  },
  {
    icon: "taskList@2x",
    iconActive: "taskList_click@2x",
    title: "账单明细",
    url: "/mine/accountDetails",
  },
  {
    icon: "accountSecurity@2x",
    iconActive: "accountSecurity_click@2x",
    title: "账户安全",
    url: "/mine/accountSecurity",
  },
  {
    icon: "secretKeyManage@2x",
    iconActive: "secretKeyManage_click@2x",
    title: "密钥管理",
    url: "/mine/secretKeyManage",
  },
]);

const aiMine = ref([
  {
    icon: "finance",
    iconActive: "finance_click",
    title: "充值中心",
    url: "/mine/recharge?activeName=online",
  },
  {
    icon: "bill@2x",
    iconActive: "bill_click",
    title: "账单明细",
    url: "/mine/accountDetails",
  },
  {
    icon: "accountSecurity@2x",
    iconActive: "accountSecurity_click@2x",
    title: "账户安全",
    url: "/mine/accountSecurity",
  },
  {
    icon: "secretKeyManage@2x",
    iconActive: "secretKeyManage_click@2x",
    title: "密钥管理",
    url: "/mine/secretKeyManage",
  },
]);
const openGlobalDialog = (params) => {
  mineStore.dialogytype = 1
  globalDialog.openDialog();
};
// 将 current_url 改为 ref
const current_url = ref(route.path);

// 使用 watch 来保持 current_url 与实际路由同步
watch(() => route.path, (newPath) => {
  current_url.value = newPath;
});

const isActive = (url) => {
  return current_url.value === url || current_url.value.startsWith(url);
};

const itemClick = (item) => {
  current_url.value = item.url;
  router.push({
    path: `${item.url}`,
  });
};

const logoClick = () => {
  const app = localStorage.getItem("application");
  router.push({
    path: `/hosts`,
  });

};

const loadImage = (name) => {
  return new URL(`../assets/images/menu/${name}.svg`, import.meta.url).href;
};


import Bus from "@/utils/bus";
const switchToggle = ref(true);
const application = ref("");
if (localStorage.hasOwnProperty("application")) {
  application.value = localStorage.getItem("application");
}
onMounted(() => {
  Bus.on("switch-app", (type) => {
    console.log(type);
    application.value = type;
    router.push({
      path: "/hosts",
    });

  });
});
</script>


<style lang="less" scoped>
.menu {
  max-width: 250px;

  overflow: hidden;
  background: #1d222a;;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .menu_con {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .logo {
      margin: 0 auto;
      border-bottom: 1px solid #26303e;

      .logo_img {
        height: 63px;
        display: block;
        margin: 0 auto;
        cursor: pointer;
      }
    }

    .menu-box {
      flex: 1; // 使 menu-box 占据剩余的高度
      overflow-y: auto;
    }
    .team {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .item {
        background: #1d222a;
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;

        &:hover {
          background: #151b24;

          .title {
            color: rgba(255, 255, 255, 0.85);
          }
        }

        .item_con {
          width: 100%;
          display: flex;
          align-items: center;
          padding-left: 58px;

        }

        .active_hr {
          width: 2px;
          height: 30px;
          background: #2696ff;
          position: absolute;
          right: 0;
          top: 17px;
        }

        img {
          width: 20px;
          height: 20px;
          margin-top: 1px;
          display: block;
        }

        .title {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          margin-left: 16px;
          line-height: 20px;
        }
      }

      .active_i {
        background: #3070E1 !important;

        .title {
          color: #ffffff !important;
        }
      }
    }

    .hr {
      width: 200px;
      height: 1px;
      margin: 0 auto;
      background: #26303e;
    }

    .dashboard {
      padding: 20px 0;
    }

    .operate {
      padding: 20px 0;
    }

    .other {
      padding: 19px 0px 20px 0px
    }

    .mine {
      padding: 50px 0;

      .hr {
        margin: 20px 0;
      }
    }
  }

  .qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    margin-bottom: 43px;

    .bd {
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .des {
      margin-top: 16px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
</style>

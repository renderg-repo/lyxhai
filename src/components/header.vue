<template>
  <div class="header">
    <div class="header_con">
      <div class="left" @mouseenter="returnHover = true" @mouseleave="returnHover = false">
      </div>
      <div class="right">
        <div class="ssh" style="margin:0px 24px 0px 0px">
          <template v-if="application == 'sc'">
            <img src="@/assets/images/header/ssh@2x.png" alt="" class="icon" style="margin-right: 20px"
              @mouseenter="sshHover = true" v-if="!sshHover" />
            <img v-else src="@/assets/images/header/ssh_hover@2x.png" alt="" class="icon" style="margin-right: 20px"
              @click="connectNowClick" @mouseleave="sshHover = false" />
          </template>
          <img src="@/assets/images/header/transfer@2x.svg" alt="" class="icon" @mouseenter="transferHover = true"
            v-if="!transferHover" />
          <img v-else src="@/assets/images/header/transfer_hover@2x.svg" alt="" class="icon" @click="temporarilyClick"
            @mouseleave="transferHover = false" />
        </div>
        <div class="hr"></div>

        <div class="guide" style="margin:0px 0px 0px 27px">
          <img src="@/assets/images/header/help@2x.svg" alt="" class="icon" @mouseenter="helpHover = true"
            v-if="!helpHover" />
          <img v-else src="@/assets/images/header/help_hover@2x.svg" alt="" class="icon" style=""
            @mouseleave="helpHover = false" @click="getHelp" />
        </div>

        <div class="guide" style="margin:0px 25px 0px 32px">
          <img src="@/assets/images/header/chat_normal.svg" alt="" class="icon" @mouseenter="customerHover = true"
            v-if="!customerHover" />
          <img v-else src="@/assets/images/header/chat_hover.svg" alt="" class="icon" style=""
            @mouseleave="customerHover = false" @click="openGlobalDialog('1')" />
        </div>
        <!-- <div class="guide">
          <img src="@/assets/images/menu/chat_fill_normal.svg" alt="" class="icon" @mouseenter="customerHover = true"
            v-if="!customerHover" />
          <img v-else src="@/assets/images/menu/chat_fill_hover.svg" alt="" class="icon" style=""
            @mouseleave="customerHover = false" @click="openGlobalDialog('2')" />
        </div> -->
        <div class="hr mr30"></div>

        <div class="portrait" @click="Querybalance">
          <el-dropdown trigger="click">
            <div class="portrait_con">{{ username }}</div>
            <template #dropdown>
              <el-dropdown-menu class="list" popper-class="custom-popper">
                <div class="top">
                  <div class="top_info" style="display: flex; align-items: center">
                    <div class="portrait_view">{{ username }}</div>
                    <div class="info" style="flex: 1">
                      <div class="title">
                        <span class="portrait_username">
                          {{ userInfo.username }}
                        </span>
                        <div class="usertype">
                          <div class="typeitem">
                            <span v-if="
                              Account.verifyStatus == 0 ||
                              Account.verifyStatus == 1
                            ">{{
                              dictMate("verifyType", Account.verifyType)
                            }}</span>
                            <span v-else>未认证</span>
                          </div>
                          <div class="typeitem" style="width: 49px">
                            {{ dictMate("accountType", Account.accountType) }}
                          </div>
                        </div>
                      </div>
                      <div class="desc">{{ userInfo.phone }}</div>
                    </div>
                  </div>
                </div>
                <div class="balance">
                  <div class="left">
                    <div class="left-top">
                      <span class="cf6">余额</span>
                      <span class="highlight" @click="router.push({
                        path: '/mine/recharge',
                        query: { activeName: 'online' }
                      })">充值</span>
                    </div>
                    <div class="highlight">
                      <span class="cf6 f12" style="padding-left: 2px">￥ </span>
                      <span class="f18" style="line-height: 26px" @click="router.push({
                        path: '/mine/recharge',
                        query: { activeName: 'online' }
                      })">{{
                        Account.balance }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <div class="cf6 toptitle">
                      <div>支付券</div>
                      <div class="linkbtn" @click="govoucher">{{ Account.currentCoupons }}张</div>
                    </div>
                    <div class="bottom" @click="govoucher">
                      <span class="f12" style="padding-left: 2px">￥ </span>
                      <span class="f18" style="line-height: 26px">{{
                        Account.currentCouponsAmount
                      }}</span>
                    </div>
                  </div>
                </div>
                <el-dropdown-item class="item" @click="websiteClick">
                  <img src="@/assets/images/header/www_hover.svg" alt="" class="icon" />
                  <div class="title">前往官网</div>
                </el-dropdown-item>
                <!-- <el-dropdown-item class="item">
                  <img
                    src="@/assets/images/header/moshi.png"
                    alt=""
                    class="icon"
                  />
                  <div class="title">切换至浅色模式</div>
                </el-dropdown-item> -->
                <el-dropdown-item class="item" @click="loginOut">
                  <img src="@/assets/images/header/log-out.svg" alt="" class="icon" />
                  <div class="title">退出登录</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { ElMessage } from "element-plus";
import { useMineStore } from "@/store/mine";
import { computed, ref } from "vue";
import Bus from "@/utils/bus";
import { getAccount } from "@/api/recharge";
import { queryDictType, queryDictData } from "@/api/dictionary";
const requiredDictTypes = ["accountType", "verifyType", "verifyStatus"];
const route = useRoute();
const router = useRouter();
const mineStore = useMineStore();
const globalDialog = inject('globalDialog');
const allDicts = reactive({
  products: [],
  payMethod: [],
  orderProduct: [],
  payStatus: [],
  project: [],
  chargeType: [],
});
const userInfo = computed(() => {
  return mineStore.userInfo;
});

function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return "";
  }
  var firstLetter = str.charAt(0).toUpperCase();
  return firstLetter;
}

const username = computed(() => {
  return capitalizeFirstLetter(userInfo.value.username);
});
const Account = ref({});
function Querybalance() {
  getAccount().then((res) => {
    Account.value = res.data;
    mineStore.userAccount = res.data;
  });
}
Querybalance();

const showInfo = ref(false);

const current_url = computed(() => {
  return route.path;
});

const returnHover = ref(false);
const returnConsole = () => {
  if (application.value == "ai") {
    router.push({
      path: `/hosts`,
    });
  }
  if (application.value == "sc") {
    router.push({
      path: `/sshManage`,
    });
  }
};

const sshHover = ref(false);
const transferHover = ref(false);
const helpHover = ref(false);
const customerHover = ref(false);
const noticeHover = ref(false);
const govoucher = () => {      
  router.push({ path: '/mine/recharge', query: { activeName: 'voucher' } })
  mineStore.handleTabClick({ paneName: 'voucher' })
}
const connectNowClick = () => {
  window.open(`${location.origin}/system/managedNode`, "_blank");
};

const globalUploader = inject("globalUploader");
const temporarilyClick = () => {
  globalUploader.value.panelShow = !globalUploader.value.panelShow;
  globalUploader.value.collapse = false;
};

const accountClick = () => {
  router.push({ path: `/mine/accountSecurity` });
  showInfo.value = false;
};

const websiteClick = () => {
  window.open("http://www.lyxhai.com/", "_blank");
};

const loginOut = () => {
  globalUploader.value.panelShow = false;
  // 退出时清除cookies
  Cookies.remove("token", { domain: '.lyxhai.com', path: '/' })
  Cookies.remove("name", { domain: '.lyxhai.com', path: '/' })
  Cookies.remove("tokenHead", { domain: '.lyxhai.com', path: '/' })
  Cookies.remove("tokenInfo", { domain: '.lyxhai.com', path: '/' })
  sessionStorage.clear()
  mineStore.tokenInfo = {};
  // 发送退出登录消息到另一个网页
  try {
    const message = {
      type: "EXIT_SUCCESS"
    };
    const targetOrigin = "https://www.lyxhai.com"; // 确保这是正确的目标源
    
    // 检查 window.opener 是否存在
    if (window.opener) {
      console.log("Sending exit message to opener window");
      window.opener.postMessage(message, targetOrigin);
    } else {
      console.log("No opener window found. Exit message not sent.");
    }
  } catch (error) {
    console.error("Error sending exit message:", error);
  }

  // 清除本地存储中的登录信息
  window.localStorage.removeItem("mine");

  // 跳转到登录页面
  router.push({ path: `/user/login` });
};


const application = ref("");
application.value = localStorage.getItem("application");
const handleSwitch = (type) => {
  application.value = type;
  Bus.emit("switch-app", type);
  localStorage.setItem("application", type);
};

const getHelp = () => {
  window.open(
    "https://help.spacehpc.com/document/faststart.html",
    "_blank"
  );
};
const openGlobalDialog = (params) => {
  mineStore.dialogytype = params
  globalDialog.openDialog();
};
const fetchDicts = async () => {
  try {
    const promises = requiredDictTypes.map(async (dictType) => {
      const result = await queryDictData({ type: dictType });
      return { dictType, result };
    });
    const results = await Promise.all(promises);
    results.forEach((item) => {
      if (item.result && item.result.data) {
        allDicts[item.dictType] = item.result.data;
      } else {
        console.error(`No data found for dictType: ${item.dictType}`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
fetchDicts();

const dictMate = (type, val) => {
  const dict = allDicts[type] || [];

  const match = dict.find((item) => item.dictValue == val);
  return match ? match.dictLabel : "";
};
</script>

<style lang="less" scoped>
.header {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 64px;
  background: #E9EBEE;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);

  .header_con {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px 0 25px;

    .left {
      display: flex;
      align-items: center;
      cursor: pointer;

      .return_icon {
        display: block;
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }

      .title {
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);

        &:hover {
          color: #fff;
        }
      }

      .app-radio {
        border-radius: 6px;
        background-color: #0b1320;

        :deep(.el-radio-button__inner) {
          width: 72px;
          border: none;
          color: rgba(255, 255, 255, 0.85);
          --el-radio-button-checked-bg-color: #2156b3;
          --el-radio-button-checked-border-color: #2156b3;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;

      .icon {
        width: 20px;
        height: 20px;
        display: block;
        cursor: pointer;
      }

      .hr {
        width: 1px;
        height: 12px;
        background: #3d3d3d;

      }

      .ssh {

        display: flex;
        align-items: center;
      }

      .guide {

        display: flex;
        align-items: center;
      }

      .portrait {
        .portrait_con {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #3070e1;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          text-align: center;
          font-size: 14px;
          outline: none;
          font-weight: 500;
          color: #fff;
        }


      }
    }
  }
}

.portrait_view {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background: #3070e1;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
.portrait_username {
  display: inline-block;
  width: 88px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.top_info {
  width: 100%;

  .info {

    // width: 240px;
    // background: #1d222a !important;
    // border-radius: 10px 10px 10px 10px;
    // overflow: hidden;
    .title {
      font-size: 12px;
      font-weight: 700;
      justify-content: space-between;
      display: flex;
      color: rgba(255, 255, 255, 0.85);

      .usertype {
        display: flex;

        .typeitem {
          width: 50px;
          height: 20px;
          line-height: 16px;
          font-size: 12px;
          box-sizing: border-box;
          border-radius: 8px;
          text-align: center;
          padding: 1px 6px;
          margin-right: 8px;
          color: #fff;
          background: #2156b3;
        }
      }
    }
  }

  .top {
    .desc {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.45);
    }
  }
}

.list {
  width: 280px;

  .top {
    padding-right: 0px;
  }

  .balance {
    padding: 10px;
    background: #D7DBE2;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.3);
    height: 66px;
    display: flex;
    box-sizing: border-box;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 16px;
    font-size: 12px;

    .left {
      flex: 1;
      width: 125px;
      height: 100%;
      border-right: 1px solid #26303e;

      .left-top {
        display: flex;
        justify-content: space-between;
        padding-right: 10px;

        .highlight {
          color: #2696ff;
        }

        .highlight:hover {
          color: #56b7ed;
          cursor: pointer;
        }
      }

      .highlight:hover {
        color: #56b7ed;
        cursor: pointer;

        .f12 {
          color: #56b7ed !important;
        }
      }
    }

    .right {
      padding-left: 8px;
      flex: 1;

      .toptitle {
        display: flex;

        justify-content: space-between;
      }

      .bottom {
        .f12 {
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .bottom:hover {
        cursor: pointer;
        color: #56b7ed !important;

        .f12 {
          color: #56b7ed !important;
        }
      }
    }
  }
}
</style>

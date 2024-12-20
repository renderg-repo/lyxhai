<template>
  <div class="dashboard">
    <div class="dashboardleft">
      <div class="leftcard1 leftcard">
        <div class="title f18 fw700"> 实例</div>
        <div class="content">
          <div class="contentcard cf6">
            <div class="contentcardtitle">
              <div style="margin-right: 111px">
                <div class="titletext">GPU实例</div>
                <div class="titletextnumber1 titletextnumber" @click="router.push({ path: 'hosts' })">
                  {{ vmlist.vmCount }}
                </div>
              </div>
              <div>
                <div class="titletext">运行中</div>
                <div class="titletextnumber1 titletextnumber" @click="
                  router.push({ path: 'hosts', query: { status: 'ready' } })
                  ">
                  {{ vmlist.vmRunning }}
                </div>
              </div>
            </div>
          </div>
          <div class="contentcard cf6" style="
              border-left: 1px solid #26303e;
              border-right: 1px solid #26303e;
            ">
            <div class="contentcardtitle">
              <div style="margin-right: 78px">
                <div class="titletext">
                  即将到期
                  <el-popover 
                    placement="top" 
                    popper-class="dashboard_pop" 
                    :width="277" 
                    trigger="hover"
                    content="包日/包月实例，距离到期时间不足3天的，将会在此处显示。">
                    <template #reference>
                      <i class="spacehpc_iconfont hpc_basic_icon_question_circle cf30"></i>
                    </template>
                  </el-popover>
                </div>
                <div class="titletextnumber2 titletextnumber">
                  {{ vmlist.willExpire }}
                </div>
              </div>
              <div>
                <div class="titletext">
                  即将删除
                  <el-popover placement="top" popper-class="dashboard_pop" :width="277" trigger="hover"
                    content="关机状态持续 7 天自动删除，删除前 3 天内会统计在此处。">
                    <template #reference>
                      <i class="spacehpc_iconfont hpc_basic_icon_question_circle cf30"></i>
                    </template>
                  </el-popover>
                </div>
                <div class="titletextnumber2 titletextnumber">
                  {{ vmlist.willDestroy }}
                </div>
              </div>
            </div>
          </div>
          <div class="contentcard cf6">
            <div class="contentcardtitle">
              <div style="margin-right: 51px">
                <div class="titletext titletext1">
                  自动删除通知
                  <el-popover placement="top" popper-class="dashboard_pop" :width="299" trigger="hover"
                    content="按量/包日/包月等场景删除前：24小时、12小时、6小时发送通知。">
                    <template #reference>
                      <i class="spacehpc_iconfont hpc_basic_icon_question_circle cf30"></i>
                    </template>
                  </el-popover>
                </div>

                <div class="switch-container">
                  <el-switch v-model="deleteSwitch" size="small" @change="setAutoDelete" />
                  <span class="f14 cf6 ml10">{{
                    deleteSwitch ? "已开启" : "未开启"
                  }}</span>
                </div>
                <div class="f14 linkbtn" style="margin-top: 12px; line-height: 22px;height: 24px;"
                  @click="router.push({ path: 'pushRecords' })">
                  推送记录
                </div>
              </div>
              <div>
                <div class="titletext titletext1">
                  余额预警
                  <el-popover placement="top" popper-class="dashboard_pop" :width="277" trigger="hover"
                    content="用户可以自己设置余额预警的阈值，当账户余额小于预警阈值时，发送一次通知。">
                    <template #reference>
                      <i class="spacehpc_iconfont hpc_basic_icon_question_circle cf30"></i>
                    </template>
                  </el-popover>
                </div>
                <div class="flex">
                  <div class="switch-container">
                    <el-switch v-model="earlyWarningSwitch" size="small" @change="setBalanceAlarm" />
                    <span class="f14 cf6 ml10">{{
                      earlyWarningSwitch ? "已开启" : "未开启"
                    }}</span>
                  </div>
                  <p class="linkbtn f14" style="margin-left: 10px; line-height: 24px" @click="revise">
                    修改
                  </p>
                </div>
                <div class="f14 bcf45 text-ellipsis" v-show="earlyWarningSwitch" style="margin-top: 12px; line-height: 22px">
                  (余额不足 {{ alarmBalance || 0 }} 元预警)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="leftcard2 leftcard">
        <div class="title f18 fw700">数据存储</div>
        <div class="content">
          <div class="contentcard cf6 flex">
            <div class="storagetext">
              <div class="storagetop">实例磁盘容量</div>
              <div class="cf30 f14 storagebottom">付费扩容大小</div>
            </div>
            <div>
              <span class="storagenumber">{{ storage.vmPaidSize }}</span>
              <span class="cf30 f14">GB</span>
            </div>
          </div>

          <div class="contentcard cf6 flex" style="
              border-left: 1px solid #26303e;
              border-right: 1px solid #26303e;
            ">
            <div class="storagetext">
              <div class="storagetop">镜像</div>
              <div class="cf30 f14 storagebottom">付费容量</div>
            </div>
            <div>
              <span class="storagenumber">{{ storage.imgPaidSize }}</span>
              <span class="cf30 f14">GB</span>
            </div>
          </div>


          <div class="contentcard cf6 flex">
            <div class="storagetext">
              <div class="storagetop">文件存储</div>
              <div class="cf30 f14 storagebottom">付费扩容</div>
            </div>
            <div>
              <span class="storagenumber">{{ storage.panPaidSize }}</span>
              <span class="cf30 f14">GB</span>
            </div>

          </div>
        </div>
      </div>
      <div class="leftcard3 leftcard">
        <div class="title">
          <div class="titleleft">
            <div class="portrait_con">{{ username }}</div>
            <div class="username">{{ userInfo.username }}</div>
            <div style="
                height: 32px;
                background-color: #26303e;
                width: 1px;
                margin-left: 15px;
                margin-right: 15px;
              "></div>
            <div class="flex">
              <div class="usernameright" style="width: 49px">
                {{ accountType }}
              </div>
              <div class="usernameright">{{ verifyType }}</div>
            </div>
          </div>
          <div class="titleright">
            <div class="cf6 f14">
              <span>支付券：</span>
              <div class="flex cursor" @click="
                router.push({
                  path: 'mine/recharge',
                  query: { activeName: 'voucher' },
                })
                ">
                <span class="cf85 cursor">{{
                  "￥" + mineStore.userAccount.currentCouponsAmount
                }}</span>
                <div class="rightcard cursor">
                  {{ Account.currentCoupons }}张
                </div>
              </div>
            </div>
            <div class="hr1"></div>
            <div>
              信用额度：
              <span class="cf85">{{
                "￥" + mineStore.userAccount.creditAmount
              }}</span>
            </div>
            <div class="hr1"></div>
            <div class="f14">
              优惠券：
              <div class="rightcard cursor" @click="
                router.push({
                  path: 'mine/recharge',
                  query: { activeName: 'coupons' },
                })">
                {{ Account.currentDiscountCoupons }}张
              </div>
            </div>
          </div>
        </div>
        <div class="balance-container">
          <div class="balance">
            <div class="decimal-part">￥</div>
            <div class="integer-part number">
              {{ formattedBalance.integerPart }}.
            </div>
            <div class="f18 number">{{ formattedBalance.decimalPart }}</div>
          </div>
        </div>
        <div class="leftcard3bottom">
          <div class="linkbtn" @click="router.push({ path: 'mine/orderlist' })">
            查看订单
          </div>
          <div class='hr'></div>
          <div class="linkbtn" @click="router.push({ path: 'mine/accountDetails' })">
            账单明细
          </div>
          <div class='hr'></div>
          <div class="linkbtn" @click="router.push({ path: 'mine/accountSecurity' })">
            账户安全
          </div>
          <div class='hr'></div>
          <div class="linkbtn" @click="router.push({ path: 'mine/recharge',
          query: { activeName: 'online' } })">
            充值中心
          </div>
        </div>
      </div>
    </div>
    <div class="dashboardright">
      <div class="dashboardrighttop">
        <div class="title">
          <div class="f18 cf85 fw700 flex">
            邀请得奖励
            <i class="spacehpc_iconfont hpc_basic_icon_question_circle bcf45 cursor"
              style="margin-left: 6px; margin-top: 1px" @click="openurl"></i>
          </div>
          <el-button class="bgBtn" text bg @click="share()">复制邀请链接</el-button>
        </div>
        <div class="invitecard">
          <div class="card">
            <div class="f12 bcf45 lh18">已获得奖励</div>
            <div class="cf85">
              <span class="f12">￥</span>
              <span class="f24 number">{{
                Account.totalAwardAmount
                  ? Account.totalAwardAmount.toFixed(2)
                  : "0.00"
              }}</span>
            </div>
          </div>
          <div class="card cardcenter">
            <div class="f12">
              <span class="bcf45">已邀请用户</span>
              <span class="linkbtn" @click="
                router.push({
                  path: 'mine/recharge',
                  query: { activeName: 'inviterecord' },
                })
                ">查看</span>
            </div>
            <div class="cf85">
              <span class="f24" style="font-family: 'HelveticaNeue-Thin'">{{
                Account.invitedUserCount
              }}</span>
            </div>
          </div>
          <div class="card">
            <div class="f12 cardcode" st>
              <span class="bcf45">我的邀请码</span>
              <span class="linkbtn" @click="copycode()">复制</span>
            </div>
            <div class="cf85">
              <span class="f24" style="font-family: 'HelveticaNeue-Thin'">{{
                Account.inviteCode
              }}</span>
            </div>
          </div>
        </div>

        <div class="f14 flex cardbottom space-between" style="">
          <div class="flex bottomleft">
            <div class="tag">赠送</div>
            <span class="activity linkbtn" @click="offerPopUps()">20元支付券</span>
          </div>
          <span class="linkbtn" @click="
            router.push({
              path: 'mine/recharge',
              query: { activeName: 'inviterecord' },
            })
            ">
            查看邀请记录</span>
        </div>
      </div>
      <div class="dashboardrightbottom">
        <div class="flex justity-between">
          <div class="f18 fw700">快速创建实例</div>
          <div class="f14 linkbtn" @click="gocreate">镜像中心</div>
        </div>
        <div class="rightcardbox">
          <div class="rightcard cursor" v-for="(item, index) in imageMarketList" :key="item"
            :class="{ rightcardactive: selectedIndex == index }" @click="handleactive(index)">
            <img :src="item.iconUrl" width="32px" alt="" style="margin-right: 20px" />
            <div class="flex-1">
              <div class="f16 fw700 flex" style="line-height: 22px; color: #2696ff;justify-content: space-between;">
                <div style="height: 24px; width: 179px; text-overflow: ellipsis; overflow:hidden; white-space: nowrap;" class="lh22">
                  {{
                    item.imageName }}</div>
                <div class="imgApp">
                  <div style="min-width: 20px;margin-left: 6px;"> <img src="@/assets/images/hosts/hot.svg" v-if="item.star" height="20" alt="" /></div> 
                </div>
              </div>
              <div class="f14" style="line-height: 20px; margin-top: 2px">
                {{ item.osName }}{{ item.osVersion }}&numsp;|&numsp;{{
                  item.imgSize
                }}GB
              </div>
            </div>
          </div>
          <div v-if="!imageMarketList"></div>
        </div>
        <el-button class="rightbutton" type="primary" size="default" @click="quicklyCreate()">立即创建</el-button>
      </div>
    </div>
    <el-dialog title="余额预警" class="earlyWarningdialog" v-model="earlyWarningVisible" style="width: 480px"
      :before-close="handleClose">
      <div class="flex" style="margin: 24px 0px 8px 0px">
        余额低于：

        <el-input v-model="amount" class="input-bg" placeholder="请输入余额预警阈值" style="width: 318px; margin: 0px 10px"
          clearable @input="onInput"></el-input>元
      </div>
      <div class="flex f12 cf6" style="margin-left: 80px; margin-bottom: 16px">
        将通过短信发送通知。
      </div>
      <template #footer>
        <span>
          <el-button style="width: 76px; height: 32px" class="ghostbtn"
            @click="earlyWarningVisible = false">取消</el-button>
          <el-button style="width: 76px; height: 32px" class="primarybtn" type="primary" :loading="loading"
            @click="modifyTheQuota">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="preferentialVisible" class="preferentialdialog" width="450px" :show-close="false"
      style="width: 450px">
      <template #header>
        <div class="f16 cf85 fw700">20元支付券</div>
      </template>
      <div class="imgbox">
        <img :src="QRCodeUrl" alt="" />
      </div>
      <div class="f14 cf6">扫码添加客服企业微信，额外获得 20 元支付券。</div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, reactive, onMounted } from "vue";
import { imageMarket, zoneAll } from "@/api/hosts";
import { ElMessage } from "element-plus";
import { useMineStore } from "@/store/mine";
import { queryDictType, queryDictData } from "@/api/dictionary";
import { getAccount } from "@/api/recharge";
import Cookies from "js-cookie";
import {
  setBalanceAlarmSw,
  setAutoDeleteNotify,
  getNotifyConfig,
  setAlarmAmount,
  getVmCount,
  storageInfo,
  getPartakeCouponInfo,
} from "@/api/dashboard";
import { min } from "lodash";

const route = useRoute();
const router = useRouter();
const deleteSwitch = ref(false);
const earlyWarningSwitch = ref(false);
const earlyWarningVisible = ref(false);
const preferentialVisible = ref(false);
const selectedIndex = ref(null);
const mineStore = useMineStore();
const alarmBalance = ref(null);
const amount = ref(null);
const loading = ref(false);
const QRCodeUrl = ref(null);
const zoneId = ref(null)

watch(
  () => earlyWarningVisible.value,
  (val) => {
    if (val) {
      amount.value = null;
    }
  }
);
const userInfo = computed(() => {
  return mineStore.userInfo;
});
const formattedBalance = computed(() => {
  const balance = mineStore.userAccount.balance;
  if (balance !== undefined && balance !== null) {
    const formatted = balance.toFixed(2);
    const [integerPart, decimalPart] = formatted.split(".");
    return { integerPart, decimalPart };
  } else {
    return { integerPart: "0", decimalPart: "00" };
  }
});

const Account = ref({ currentCoupons: 0, invitedUserCount: 0, inviteCode: 0 });

function Querybalance() {
  getAccount().then((res) => {
    Account.value = res.data;
    mineStore.userAccount = res.data;
    getDictType();
  });
}
Querybalance();

function NotifyConfig() {
  getNotifyConfig().then((res) => {
    if (res.code == 200) {
      deleteSwitch.value = res.data.autoDeleteNotifySw;
      earlyWarningSwitch.value = res.data.balanceAlarmSw;
      alarmBalance.value = res.data.alarmBalance;
    }
  });
}
NotifyConfig();
//切割用户名
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
function revise() {
  earlyWarningVisible.value = true;
}
const imageMarketList = ref([]);
//关闭按钮
function handleClose(done) {
  earlyWarningVisible.value = false;
  done();
}
//选择镜像
function handleactive(index) {
  selectedIndex.value = index;
}
// 获取区域列表
function getZoneList () {
  zoneAll().then((res) => {
    console.log('resZone', res)
    if (res.code == 200) {
      zoneId.value = res.data[0].id
      // console.log('zoneId', zoneId.value)
      getimageMarket(zoneId.value)
    } else {
      ElMessage({
        message: res.message,
        type: "error",
      });
    }
  })
}
getZoneList()
//获取镜像列表
function getimageMarket(zoneId) {
  let obj = {
    imageType: 1,
    searchValue: "",
    zoneId: zoneId
  };
  imageMarket(obj).then((res) => {
    if (res.code == 200) {
      imageMarketList.value = res.data.slice(0, 7);
    }
  });
}
// getimageMarket();
//镜像中心跳转
const gocreate = () => {
  window.open("http://www.lyxhai.com/mirror", "_blank");
};
//立即创建按钮
function quicklyCreate() {
  if (selectedIndex.value == null) {
    ElMessage({
      message: "请选择镜像",
      type: "warning",
    });
    return;
  }
  router.push({
    path: `/create`,
    query: { osName: imageMarketList.value[selectedIndex.value].imageName, imgType: 1 },
  });
}
//余额预警
function setBalanceAlarm(val) {
  let obj = { enable: earlyWarningSwitch.value };
  setBalanceAlarmSw(obj).then((res) => {
    if (res.code == 200) {
      ElMessage({
        message: "设置成功",
        type: "success",
      });
    }
  });
}
//删除预警
function setAutoDelete(val) {
  let obj = { enable: deleteSwitch.value };
  setAutoDeleteNotify(obj).then((res) => {
    if (res.code == 200) {
      ElMessage({
        message: "设置成功",
        type: "success",
      });
    }
  });
}
function openurl() {
  window.open(
    "https://help.spacehpc.com/document/activities/invitation_rewards_program/invitation_rewards_program.html"
  );
}
//设置预警金额
function modifyTheQuota() {
  loading.value = true;
  let obj = { amount: amount.value };
  setAlarmAmount(obj).then((res) => {
    if (res.code == 200) {
      loading.value = false;
      NotifyConfig();
      ElMessage({
        message: "设置成功",
        type: "success",
      });
      earlyWarningVisible.value = false;
    }
  });
}

const vmlist = reactive({
  vmCount: 0,
  vmRunning: 0,
  willDestroy: 0,
  willExpire: 0,
});

function getVmCountlist() {
  getVmCount().then((res) => {
    if (res.code == 200) {
      Object.assign(vmlist, res.data);
    }
  });
}
getVmCountlist();
const storage = reactive({
  imgPaidSize: 0,
  panPaidSize: 0,
  vmPaidSize: 0,
});
storageInfo().then((res) => {
  if (res.code == 200) {
    Object.assign(storage, res.data);
  }
});
const verifyType = ref("未认证");
const accountType = ref("主账户");
//查询用户类型
async function getDictType() {
  try {
    const res = await queryDictData({ type: "verifyType" });
    const res1 = await queryDictData({ type: "accountType" });
    const res3 = await queryDictData({ type: "verifyStatus" });
    if (res.code == 200) {
      if (Account.value.verifyStatus == 0 || Account.value.verifyStatus == 1) {
        res.data.forEach((element) => {
          if (element.dictValue == Account.value.verifyType) {
            verifyType.value = element.dictLabel;
          }
        });
      } else {
        verifyType.value = "未认证";
      }
      res1.data.forEach((element) => {
        if (element.dictValue == Account.value.accountType) {
          accountType.value = element.dictLabel;
        }
      });
    } else {
      console.log(res.message);
    }
  } catch (error) {
    console.log(error);
  }
}

const onInput = (event) => {
  console.log(event, "eeee");
  let value = event;
  // 只允许输入正整数
  value = value.replace(/[^\d]/g, "");
  // 去掉前导零
  value = value.replace(/^0+/, "");
  // 限制最大5位数
  if (value.length > 5) {
    value = value.slice(0, 5);
  }
  amount.value = value;
};
//复制分享链接
function share() {
  // 获取基础 URL
  const baseUrl = window.location.origin;
  const inviteCode = encodeURIComponent(Account.value.inviteCode); // 编码 osName 以确保 URL 的正确性
  const shareLink = `${baseUrl}/user/register?inviteCode=${inviteCode}`;
  console.log(baseUrl, "baseUrlbaseUrlbaseUrl");
  // 检查浏览器是否支持 navigator.clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // 将链接复制到剪贴板
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        // 提供用户反馈，告知链接已复制
        ElMessage({
          message: "邀请链接已复制到剪贴板",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("复制失败:", err);
        this.$message.error("复制邀请链接失败");
      });
  } else {
    copyFallback(shareLink);
  }
}
// 创建一个临时文本框并将文本复制到其中
function copyFallback(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  // 提示用户链接已复制
  ElMessage({
    message: "邀请链接已复制到剪贴板",
    type: "success",
  });
}
//复制邀请码
function copycode() {
  const input = document.createElement("input");
  input.value = Account.value.inviteCode;
  console.log(Account.value.inviteCode);
  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
  ElMessage({
    message: "邀请码复制成功",
    type: "success",
  });
}
//活动弹窗
function offerPopUps() {
  preferentialVisible.value = true;
}
const getPartakeCouponInfos = async () => {
  const res = await getPartakeCouponInfo();
  if (res.code === 200) {
    QRCodeUrl.value = res.data.QRCodeUrl;
  }
};
getPartakeCouponInfos();
function handleMessage(event) {
  // 确保消息来自预期的源
  if (event.origin !== "http://192.168.30.200:3002") return;

  console.log("Received message:", event.data);
  // 处理接收到的消息
  // ...
}

onMounted(() => {
  try {
    const mineString = window.localStorage.getItem("mine");
    if (mineString) {
      const mine = JSON.parse(mineString);
      
      if (mine && mine.tokenInfo && mine.tokenInfo.token && mine.tokenInfo.tokenHead) {
        const message = {
          type: "LOGIN_SUCCESS",
          token: mine.tokenInfo.token,
          tokenHead: mine.tokenInfo.tokenHead,
          name: mine.userInfo.username,
        };
        Cookies.set("tokenInfo", JSON.stringify(mine.tokenInfo), { domain: '.lyxhai.com', path: '/' })
        const targetOrigin = "https://www.lyxhai.com";
        // 检查 window.opener 是否存在
        if (window.opener) {
          console.log("Sending message to opener window");
          window.opener.postMessage(message, targetOrigin);
        } else {
          console.log("No opener window found. Message not sent.");
        }
      } else {
        console.log("Token information is incomplete or missing");
      }
    } else {
      console.log("No login information found in localStorage");
    }
  } catch (error) {
    console.error("Error processing login information:", error);
  }
});
</script>

<style lang="less" scoped>
@import '../../assets/css/dashboard.less';
</style>
<style lang="less">
.dashboard_pop {
  --el-text-color-regular: rgba(0, 0, 0, 0.85);
  --el-popover-padding: 5px 8px;
  line-height: 22px;
  font-weight: 350 !important;
  line-height: 22px !important;
  border: none !important;
}
</style>

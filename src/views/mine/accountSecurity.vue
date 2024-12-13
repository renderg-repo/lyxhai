<template>
  <div class="container">
    <div class="title lh26">账户安全</div>
    <div class="accountSecurity">
      <div class="accountSecurity_con">
        <div class="list" >
          <div class="item">
            <div class="title ">用户名</div>
            <div class="desc">
              <div class="left">{{ userInfo.username }}</div>
              <div class="right">
                <div class="isok">
                  <div class="ok" v-if="userInfo.username">
                    <img src="../../assets/images/mine/ok_circle.svg" alt="" /><span style="line-height: 22px">已设置
                    </span>
                  </div>
                </div>
                <div class="revise linkbtn" @click="editName">修改</div>
              </div>
            </div>
          </div>
          <!-- <div class="item" v-if="false">
            <div class="left">
              <div class="title">公司/学校/个人</div>
              <div class="desc">
                {{
                userInfo.company
                ? userInfo.company
                : "完善用户信息用以获得更精确的服务"
                }}
              </div>
            </div>
            <div class="right">
              <div class="btn ghostbtn" @click="editInfo">编辑资料</div>
            </div>
          </div> -->
          <div class="item">
            <div class="title">登录密码</div>
            <div class="desc">
              <div class="left" v-if="userInfo.passwordSet">********</div>
              <div class="left" v-else>登录密码未设置，密码至少8个字符。包括字母和数字。</div>
              <div class="right">
                <div class="isok">
                  <div class="ok" v-if="userInfo.passwordSet">
                    <img src="../../assets/images/mine/ok_circle.svg" alt="" /><span style="line-height: 22px">已设置
                    </span>
                  </div>
                </div>
                <div class="revise linkbtn" v-if="userInfo.passwordSet" @click="editPassword">修改</div>
                <div class="revise linkbtn" v-else @click="setAPassword">设置</div>
              </div>
            </div>
          </div>

          <div class="item">
            <div class="title">邮箱绑定</div>
            <div class="desc">
              <div class="left">
                {{
                  userInfo.email
                    ? userInfo.email
                    : "可用于重置密码和接收邮件通知"
                }}
              </div>
              <div class="right">
                <div class="isok">
                  <div class="ok" v-if="userInfo.email">
                    <img src="../../assets/images/mine/ok_circle.svg" alt="" /><span style="line-height: 22px">已绑定
                    </span>
                  </div>
                </div>
                
                <div v-if="userInfo.email" class="revise linkbtn" @click="editEmail">解绑</div>
                <div v-else class="revise linkbtn" @click="editEmail">绑定</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="title">手机绑定</div>
            <div class="desc">
              <div class="left">
                {{
                  userInfo.phone
                    ? hideMiddleDigits(userInfo.phone)
                    : "可用于重置密码和接收重要通知"
                }}
              </div>
              <div class="right">
                <div class="isok">
                  <div class="ok" v-if="userInfo.phone">
                    <img src="../../assets/images/mine/ok_circle.svg" alt="" /><span style="line-height: 22px">已绑定
                    </span>
                  </div>
                </div>
                <div class="revise linkbtn" @click="editPhone">
                  {{ userInfo.phone ? "修改" : "绑定" }}
                </div>
              </div>
            </div>
          </div>

          <div class="item">
            <div class="title">微信绑定</div>
            <div class="desc">
              <div class="left">
                {{
                  userInfo.bindWeChat
                    ? "已绑定"
                    : "绑定后可以使用微信登录和接收通知"
                }}
              </div>
              <div class="right">
                <div class="isok">
                  <div class="ok" v-if="userInfo.bindWeChat">
                    <img src="../../assets/images/mine/ok_circle.svg" alt="" /><span style="line-height: 22px">已绑定
                    </span>
                  </div>
                </div>
                <div class="revise linkbtn" @click="editWechat">
                  {{ userInfo.bindWeChat ? "解绑" : "绑定" }}
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="title">实名认证</div>
            <div class="desc">
              <div class="left">
                {{
                  VerifyInfo.verifyStatus
                    ? VerifyInfo.realName
                    : "完成认证可以享受更专业的服务。"
                }}
                {{
                  VerifyInfo.verifyStatus
                    ? "/" + dictMate("verifyType", VerifyInfo.verifyType)
                    : " "
                }}
              </div>
              <div class="right">
                <div class="isok">
                  <div class="ok" v-if="VerifyInfo.verifyStatus">
                    <img :src="statusImage" alt="" />
                    <span :style="{ color: statusColor, lineHeight: '22px' }">
                      <span v-if="VerifyInfo.verifyReason">{{ VerifyInfo.verifyReason }}</span>
                      <span v-else> {{ dictMate("verifyStatus", VerifyInfo.verifyStatus) }}</span>
                    </span>
                  </div>
                </div>
                <div class="revise linkbtn" @click="router.push({ path: 'accountSecurity/realNameAuth' })">
                  {{ VerifyInfo.verifyStatus ? "查看" : "认证" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <securityDialog :info="info" :dialogType="dialogType" :isDialog="isDialog" @closeDialog="closeDialog"
        ref="childRef" @confirmDialog="confirmDialog">
      </securityDialog>
    </div>
  </div>
</template>

<script setup>
import { basicInfo, getVerifyInfo } from "@/api/login";
import { useMineStore } from "@/store/mine";
import { hideMiddleDigits } from "@/utils/tools";
import { ref, computed } from "vue";
import { queryDictType, queryDictData } from "@/api/dictionary";
import QRCodeVue3 from "qrcode-vue3"
const route = useRoute();
const router = useRouter();
const mineStore = useMineStore();
const childRef = ref(null);
const userInfo = computed(() => {
  return mineStore.userInfo;
});
const allDicts = reactive({
  products: [],
  payMethod: [],
  orderProduct: [],
  payStatus: [],
  project: [],
  chargeType: [],
});
const statusColor = computed(() => {
  switch (VerifyInfo.value.verifyStatus) {
    case 2:
      return "#FF9000";
    case 3:
      return "#DF444D";
    default:
      return "#3bbf63"; // 默认颜色
  }
});
// 导入图片资源
import okCircle from "@/assets/images/mine/ok_circle.svg";
import fileNotice from "@/assets/images/filetransfer/fileNotice.svg";
import circleFilled from "@/assets/images/system/circle_filled.svg";
// 计算属性，用于动态获取图片路径
const statusImage = computed(() => {
  switch (VerifyInfo.value.verifyStatus) {
    case 1:
      return okCircle;
    case 2:
      return fileNotice;
    case 3:
      return circleFilled;
    default:
      return ""; // 默认图片路径
  }
});
const requiredDictTypes = ["verifyType", "verifyStatus"];
// 查询基本信息接口
function basicInfoFn() {
  basicInfo().then((infoRes) => {
    mineStore.userInfo = infoRes.data;
    if (mineStore.userInfo.bindWeChat) {
      childRef.value.stopBasicInfoFn();
    }
  });
}
basicInfoFn();

const VerifyInfo = ref({});
function getVerify() {
  getVerifyInfo().then((res) => {
    VerifyInfo.value = res.data;
    // console.log("VerifyInfo", VerifyInfo);
  });
}
getVerify();

const securityDialog = defineAsyncComponent(() =>
  import("./component/securityDialog.vue")
); //弹窗组件
const isDialog = ref(false); //弹窗开关
// dialogType= 1修改用户名 2编辑资料 3修改密码 4绑定邮箱  6解绑邮箱（确认） 7绑定微信  8解绑微信 9验证当前手机号 10验证新手机号 11绑定手机号
const dialogType = ref(0); //弹窗类型
const basicInfoIntervalId = ref(null);
// 打开弹框
function btnClick() {
  isDialog.value = true;
}
// 子组件控制关闭弹窗
function closeDialog() {
  // console.log("closeDialog");
  isDialog.value = false;
  childRef.value.stopBasicInfoFn();
}
const securityDialogRef = ref(null);
const info = ref({});
// 子组件控制确定
function confirmDialog(obj = {}) {
  info.value = obj;
  console.log("confirmDialog", obj);
  closeDialog();
  if (dialogType.value == 9) {
    dialogType.value == 10;
    openDialog({ type: 10 });
    return;
  }
  basicInfoFn();
}

const openDialog = ({ flag = true, type }) => {
  dialogType.value = type;
  isDialog.value = flag;
};

const editName = () => {
  info.value.username = userInfo.value.username || "";
  openDialog({ type: 1 });
};
const editInfo = () => {
  info.value.company = userInfo.value.company || "";
  openDialog({ type: 2 });
};
const editPassword = () => {
  openDialog({ type: 3 });
};
const setAPassword = () => {
  openDialog({ type: 12 });
};
const editEmail = () => {
  if (userInfo.value.bindEmail) {

    openDialog({ type: 6 });
  } else {
    openDialog({ type: 4 });
  }
};
const editPhone = () => {
  if (userInfo.value.bindPhone) {
    openDialog({ type: 9 });
    info.value.phone = userInfo.value.phone;
  } else {
    openDialog({ type: 11 });
  }
};
const editWechat = () => {
  if (userInfo.value.bindWeChat) {
    openDialog({ type: 8 });
  } else {
    openDialog({ type: 7 });
  }
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
.container {
  padding: 20px 30px 20px 30px;
  margin: 0px 20px 20px 20px;
  height: calc(100% - 20px);
  box-sizing: border-box;
}

.title {
  font-size: 18px;
  font-weight: 700;

  color: rgba(0, 0, 0, 0.6);
}

.accountSecurity {
  display: flex;
  flex-direction: column;
  align-items: center;

  .accountSecurity_con {
    width: 900px;
    margin: 0 auto;

    .list {
      .item {
        display: flex;
        margin-top: 30px;

        justify-content: space-between;
        flex-direction: column;
        border-bottom: 1px solid #26303e;

        .title {
          font-weight: 700;
          font-size: 14px;
          line-height: 20px;
          color: rgba(0, 0, 0, 0.85);
        }

        .desc {
          margin-top: 26px;
          padding-bottom: 20px;
          padding-right: 46px;
          height: 24px;
          display: flex;
          justify-content: space-between;
          line-height: 22px;
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;

          .right {
            display: flex;

            .isok {
              display: flex;
              align-items: center;
              color: #3bbf63;
              padding-right: 16px;
              border-right: 1px solid #26303e;

              .ok {
                display: flex;
                place-items: center;
              }

              img {
                height: 16px;
                width: 16px;
                margin-right: 6px;
              }
            }

            .revise {
              padding-left: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
// 改
:deep(.el-dialog) {
  width: 450px;
  // height: 175px;
  background: #1d222a;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
}

:deep(.accountSecuritylog) {
  --el-dialog-padding-primary: 15px 20px 20px 20px;
}

:deep(.el-dialog__header) {
  padding-bottom: 0px;
}

:deep(.el-dialog__body) {
  padding: 0px;
}

:deep(.el-form-item) {
  width: 100%;
}

:deep(.el-input) {
  // opacity: 1;
  --el-input-placeholder-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-input__wrapper) {
  background: #0b1320;
  border-radius: 8px 8px 8px 8px;
  border: none;
  // box-shadow: 0 0 0 1px #2696FF;
  box-shadow: 0 0 0 0;
}

:deep(.el-form-item__error) {
  height: 22px;
  font-size: 14px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #d63939;
  line-height: 22px;
  position: inherit;
}

:deep(.el-dialog__footer) {
  padding-top: 20px;
}
</style>

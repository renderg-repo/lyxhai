<template>
  <div class="realNameAuth">
    <div class="page-header">
      <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/mine/accountSecurity' }">
          <span class="f14 cf6" style="font-weight: 400">账户安全</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="fw700 f14 cf85">实名认证</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="content-card content-card1">
        <div class="header">
          <div class="header-left">
            <span>个人认证</span>
            <el-popover popper-class="notice_pop" placement="right" :offset="10" trigger="hover" width="auto"
              popper-style="padding: 5px 8px;">
              <template #reference>
                <i class="spacehpc_iconfont hpc_basic_icon_info_circle cf6"
                  style="margin-left: 10px; font-size: 19px; margin-top: 4px"></i>
              </template>
              <div class="notice_card">
                <div class="notice_content" style="color: rgba(255, 255, 255, 0.85)">
                  您的认证信息将会加密保存，不会泄露给第三方。
                </div>
              </div>
            </el-popover>
          </div>

          <div class="header-right">
            <div class="authe" v-if="VerifyInfo.verifyStatus == 1 && VerifyInfo.verifyType == 1">
              <img src="../../assets/images/mine/ok_circle.svg" alt="" /><span style="line-height: 22px">{{
                dictMate("verifyStatus", VerifyInfo.verifyStatus) }}
              </span>
            </div>
            <div class="cred" v-if="VerifyInfo.verifyStatus == 1 && VerifyInfo.verifyType == 1"
              @click="withdrawVisible = true">
              撤销
            </div>
            <div class="linkbtn" @click="authVisiblebtn()"
              v-if="VerifyInfo.verifyStatus == 1 && VerifyInfo.verifyType == 1">
              重新认证
            </div>
            <div class="linkbtn" @click="authVisiblebtn()" v-if="
              VerifyInfo.verifyStatus !== 1 || VerifyInfo.verifyType !== 1
            ">
              开始认证
            </div>
          </div>
        </div>
        <div class="content">
          <div class="left">
            <el-descriptions :column="1" v-if="VerifyInfo.verifyStatus && VerifyInfo.verifyType !== 2">
              <el-descriptions-item label="账号类型：">{{
                dictMate("verifyType", VerifyInfo.verifyType)
              }}</el-descriptions-item>
              <el-descriptions-item label="姓名：">{{
                VerifyInfo.realName
              }}</el-descriptions-item>
              <el-descriptions-item label="身份证号码：">{{
                VerifyInfo.idCard
              }}</el-descriptions-item>
              <el-descriptions-item label="认证时间：">{{
                VerifyInfo.verifiedAt
              }}</el-descriptions-item>
            </el-descriptions>
            <li v-if="!VerifyInfo.verifyStatus || VerifyInfo.verifyType == 2">
              真实姓名+身份证号
            </li>
          </div>
        </div>
      </div>
      <div class="content-card content-card2">
        <div class="header">
          <div class="header-left">
            <span>企业认证</span>
            <el-popover popper-class="notice_pop" placement="right" :offset="10" trigger="hover" width="auto"
              popper-style="padding: 5px 8px;">
              <template #reference>
                <i class="spacehpc_iconfont hpc_basic_icon_info_circle cf6"
                  style="margin-left: 10px; font-size: 19px; margin-top: 4px"></i>
              </template>
              <div class="notice_card">
                <div class="notice_content" style="color: rgba(255, 255, 255, 0.85)">
                  您的认证信息将会加密保存，不会泄露给第三方。
                </div>
              </div>
            </el-popover>
          </div>
          <div class="flex header-center" v-if="VerifyInfo.verifyStatus == 2 && VerifyInfo.verifyType == 2">
            <div class="flex">
              <img src="../../assets/images/mine/ok_blue.svg" alt="" style="height: 24px; margin-right: 8px" /><span
                class="cf65 f14" style="line-height: 24px">填写信息</span>
            </div>
            <div class="line"></div>
            <div class="flex">
              <div class="underReview f14 fw500">2</div>
              <span class="cf85 f14" style="line-height: 24px">后台审核</span>
            </div>
            <div class="line"></div>
            <div class="flex">
              <div class="finish f14 fw500">3</div>
              <span class="cf45 f14" style="line-height: 24px">认证完成</span>
            </div>
          </div>
          <div class="header-right">
            <div class="authe" v-if="VerifyInfo.verifyStatus && VerifyInfo.verifyType !== 1">
              <img :src="statusImage" alt="" />
              <span :style="{ color: statusColor, lineHeight: '22px' }">
                <span v-if="VerifyInfo.verifyReason">{{ VerifyInfo.verifyReason }}</span>
                <span v-else> {{ dictMate("verifyStatus", VerifyInfo.verifyStatus) }}</span>
              </span>
            </div>
            <div class="cred" v-if="VerifyInfo.verifyStatus && VerifyInfo.verifyType !== 1"
              @click="withdrawVisible = true">
              撤销
            </div>
            <div class="linkbtn" @click="handleClick()"
              v-if="VerifyInfo.verifyStatus == 0 || (VerifyInfo.verifyType == 1 && VerifyInfo.verifyStatus == 1)">
              开始认证
            </div>
            <div class="linkbtn" @click="handleClick()"
              v-if="VerifyInfo.verifyStatus !== 0 && VerifyInfo.verifyType == 2">
              重新认证
            </div>
          </div>
        </div>
        <div class="content">
          <div class="left">
            <el-descriptions :column="1" v-if="VerifyInfo.verifyStatus && VerifyInfo.verifyType !== 1">
              <el-descriptions-item label="账号类型：">{{
                dictMate("verifyType", VerifyInfo.verifyType)
              }}</el-descriptions-item>
              <el-descriptions-item label="企业名称：">{{
                VerifyInfo.companyName
              }}</el-descriptions-item>
              <el-descriptions-item label="企业证号码：">{{
                VerifyInfo.licenseNumber
              }}</el-descriptions-item>
              <el-descriptions-item label="认证时间：">{{
                VerifyInfo.verifiedAt
              }}</el-descriptions-item>
            </el-descriptions>
            <div v-if="!VerifyInfo.verifyStatus || VerifyInfo.verifyType == 1"
              style="margin-top: 12px; line-height: 17px">
              <span class="cf30 f14">预计：</span><span class="cf85 f14">一个工作日</span>
            </div>
            <li v-if="!VerifyInfo.verifyStatus || VerifyInfo.verifyType == 1">
              请准备企业名称、企业营业执照、企业证件号
            </li>
            <li v-if="!VerifyInfo.verifyStatus || VerifyInfo.verifyType == 1">
              法人/被授权人，真实姓名、身份证号码、身份证正反面照片
            </li>
          </div>
        </div>
      </div>
    </div>
    <!-- 认证弹窗 -->
    <el-dialog class="authDialog" title="实名认证" style="width: 450px" v-model="authVisible" @close="closedialog">

      <div class="title">
        <img src="@/assets/images/filetransfer/fileNotice.svg" alt="" />
        <p>实名认证信息，需要和手机号码实名信息一致。</p>
      </div>
      <el-input class="input-bg" style="width: 100%" maxlength="14" v-model="authParams.realName"
        placeholder="请输入您的真实姓名" />
      <el-input class="input-bg" v-model="authParams.idCard" placeholder="请输入您的身份证号码" />
      <el-input class="input-bg" maxlength="14" v-model="phone" disabled placeholder="请输入手机号" />


      <template #footer>
        <div class="dialog-footer" style="padding-right: 5px">
          <el-button style="border: 1px solid rgba(255, 255, 255, 0.15)" class="newbtn ghostbtn"
            @click="closedialog()">取消</el-button>

          <el-button v-if="VerifyInfo.verifyStatus" class="primarybtn button newbtn" type="primary" :loading="loading"
            @click="reVerifyInfo()">确定</el-button>
          <el-button v-if="!VerifyInfo.verifyStatus" class="primarybtn button newbtn" type="primary" :loading="loading"
            @click="personalInfo()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 支付宝弹窗 -->
    <el-dialog title="该操作需要先完成人脸验证" class="qrdialog" v-model="qrVisible" style="width: 450px" @close="closedialog">
      <div class="qr-box">
        <div class="title cf6"> 请使用个人<span style="color: #2696FF;">支付宝</span>，进行扫码验证</div>
        <div class="qrcode_con">
          <QRCodeVue3 :width="300" :height="300" v-if="scanInfo?.certifyUrl" :value="scanInfo?.certifyUrl"
            :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' }"
            :imageOptions="{ hideBackgroundDots: true, imageSize: 0.2, margin: 0 }" margin="0" :image="alipaylogo"
            :dotsOptions="{
              type: 'none',
              color: '#000',
              gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                  { offset: 0, color: '#000' },
                  { offset: 1, color: '#000' },
                ],
              },
            }" :cornersSquareOptions="{ type: 'square', color: '#000', }"
            :cornersDotOptions="{ type: 'square', color: '#000', }" />
          <div class="qrcode_mask" v-if="expireQrCode">
            <img
              src="https://img0.baidu.com/it/u=3232582821,3516640051&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1694624400&t=9e7252c7a5a41ac57e3f55666be42e50"
              alt="" class="refresh_icon" @click="refreshQrCode" />
            <div class="text">点击刷新</div>
          </div>
          <div class="cf6" style="margin-top: 18px;">此二维码有效时间：10分钟</div>
          <div style=" margin:26px 0px 8px 0px ">请勿将二维码转发给其他人，否则可能造成损失</div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" class="primarybtn" @click="checkpersonalEnd">认证完成</el-button>
      </template>
    </el-dialog>


    <!-- 确认弹窗 -->
    <el-dialog class="withdrawDialog" :show-close="false" style="width: 424px" v-model="withdrawVisible">
      <div class="flex">
        <i style="
            margin: 0px 12px 0 0;
            color: rgba(38, 150, 255, 1);
            font-size: 20px;
          " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i>

        <div class="flex confirmContent">确认要撤销认证吗？</div>
      </div>

      <template #footer>
        <el-button class="ghostbtn newbtn" @click="withdrawVisible = false">取消</el-button>
        <el-button class="primarybtn newbtn" type="primary" @click="withdrawauth" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useMineStore } from "@/store/mine";
import { ArrowRight } from "@element-plus/icons-vue";
import { queryDictType, queryDictData } from "@/api/dictionary";
import QRCodeVue3 from "qrcode-vue3"
import alipaylogo from "../../assets/images/recharge/alipaylogo.svg";
import {
  basicInfo,
  getVerifyInfo,
  personal,
  personalVerify,
  withdraw,
  reVerify,
  personalEnd,
  enterpriseReVerify,
  PersonalReVerify,
} from "@/api/login";
import { validateIdCard } from "@/utils/checkUtil";

const route = useRoute();
const router = useRouter();
const authVisible = ref(false);
const qrVisible = ref(false)
const withdrawVisible = ref(false);
const expireQrCode = ref(false);
const mineStore = useMineStore();
let interval = null;
const loading = ref(false);
const scanInfo = ref({});
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
const phone = userInfo.value.phone
  ? userInfo.value.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
  : "请绑定手机号";

const authParams = ref({
  realName: "",
  idCard: "",
  phone: userInfo.value.phone,
});
const VerifyInfo = ref({});
//获取认证信息
function getVerify() {
  getVerifyInfo().then((res) => {
    VerifyInfo.value = res.data;
  });
}
getVerify();
function handleClick() {
  if (VerifyInfo.value.verifyType == 1) {
    ElMessage.error("请先撤销个人认证，再进行企业认证");
    return;
  }
  if (VerifyInfo.value.verifyStatus) {
    // 重新认证
    router.push({
      path: "/mine/accountSecurity/enterpriseAuth",
      query: { action: "reVerify" },
    });
  } else {
    // 开始认证
    router.push({
      path: "/mine/accountSecurity/enterpriseAuth",
    });
  }
}

function checkpersonalEnd() {
  let isEnd = true
  personalEnd(scanInfo.value.certifyNo, isEnd).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.message)
      qrVisible.value = false
      getVerify()
    } else {
      ElMessage.error(res.message)
    }
  })

}

function closedialog() {
  authVisible.value = false;
  authParams.value = {
    realName: "",
    idCard: "",
    phone: userInfo.value.phone,
  };
}

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
//认证按钮
function personalInfo() {
  if (authParams.value.realName == "" || authParams.value.idCard == "") {
    ElMessage.error("请填写完整信息");
    return;
  }
  if (!validateIdCard(authParams.value.idCard)) {
    ElMessage.error("请输入正确的身份证号码");
    return;
  }
  loading.value = true;
  personalVerify(authParams.value).then((res) => {
    loading.value = false;
    if (res.code == 200) {
      authVisible.value = false;
      qrVisible.value = true;
      scanInfo.value = res.data
      authParams.value = {
        realName: "",
        idCard: "",
        phone: userInfo.value.phone,
      };
      getVerify();
      startPolling(); // 调用轮询方法
    } else {
      ElMessage.error(res.message);
    }
  });
}
//重新认证按钮
function reVerifyInfo() {
  if (authParams.value.realName == "" || authParams.value.idCard == "") {
    ElMessage.error("请填写完整信息");
    return;
  }
  if (!validateIdCard(authParams.value.idCard)) {
    ElMessage.error("请输入正确的身份证号码");
    return;
  }
  loading.value = true;
  PersonalReVerify(authParams.value).then((res) => {
    loading.value = false;
    if (res.code == 200) {
      authVisible.value = false;
      qrVisible.value = true;
      scanInfo.value = res.data
      authParams.value = {
        realName: "",
        idCard: "",
        phone: userInfo.value.phone,
      }
      getVerify();
      startPolling(); // 调用轮询方法
    } else {
      ElMessage.error(res.message);
    }
  });
}
//撤销认证按钮
function withdrawauth() {
  loading.value = true;
  withdraw().then((res) => {
    loading.value = false;
    if (res.code == 200) {
      ElMessage.success("撤销成功");
      withdrawVisible.value = false;
      getVerify();
      authVisible.value = false;
      authParams.value = {
        realName: "",
        idCard: "",
        phone: userInfo.value.phone,
      };
    } else {
      ElMessage.error(res.message);
    }
  });
}
function authVisiblebtn() {
  if (VerifyInfo.value.verifyType == 2) {
    ElMessage.error("请先撤销企业认证，再进行个人认证");
  } else {
    // 开始认证
    authVisible.value = true;
  }
}
function startPolling() {
  const isEnd = true;
  interval = setInterval(() => {
    personalEnd(scanInfo.value.certifyNo, isEnd).then((res) => {
      if (res.code == 200) {
        ElMessage.success(res.message);
        qrVisible.value = false;
        getVerify();
        clearInterval(interval); // 停止轮询
      } else {

      }
    }).catch((error) => {
      console.error("Error in personalEnd request:", error);
      clearInterval(interval); // 在错误情况下也停止轮询，以免无限循环
    });
  }, 3000); // 每3秒钟检查一次，时间间隔可以根据需要调整
}
// 监测 qrVisible 变化，当其为 false 时停止轮询
watch(qrVisible, (newVal) => {
  if (!newVal && interval) {
    clearInterval(interval);
  }
});
// 当路由切换时停止轮询
router.beforeEach((to, from, next) => {
  if (interval) {
    clearInterval(interval);
  }
  next();
});
// 组件卸载前停止轮询
onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<style lang="less" scoped>
.realNameAuth {
  .page-header {
    position: fixed;
    top: 64px;
    left: 250px;
    width: 100%;
  }

  .page-content {
    margin-top: 23px;
    padding: 20px;

    .content-card {
      padding: 20px 56px 30px 30px;
      display: flex;
      flex-flow: column;

      border-radius: 10px;
      box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.64),
        0px 3px 6px 0px rgba(0, 0, 0, 0.48),
        0px 5px 12px 1px rgba(0, 0, 0, 0.36);
      box-sizing: border-box;
      position: relative;
      z-index: 1;

      .header {
        display: flex;
        justify-content: space-between;

        .header-left {
          display: flex;
          font-size: 18px;
          line-height: 26px;
        }

        .header-center {
          line-height: 24px;

          .flex {
            .underReview {
              width: 24px;
              border-radius: 50%;
              background-color: #177ddc;
              height: 24px;

              display: flex;
              font-weight: 400;
              place-content: center;
              place-items: center;
              margin-right: 8px;
            }

            .finish {
              width: 24px;
              display: flex;

              border-radius: 50%;
              background: rgba(0, 0, 0, 0.15);
              border: 1px solid rgba(255, 255, 255, 0.12);
              height: 24px;
              font-weight: 400;
              place-content: center;
              place-items: center;
              margin-right: 8px;
            }
          }
        }

        .line {
          width: 160px;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin: 0px 8px;
        }

        .header-right {
          font-weight: 500;
          display: flex;
          font-size: 14px;
          line-height: 22px;
          text-align: center;

          .authe {
            font-size: 14px;
            display: flex;
            color: #3bbf63;
            flex-wrap: nowrap;
            padding-right: 16px;

            img {
              height: 16px;
              margin-top: 4px;
              padding-right: 6px;
              width: 16px;
            }
          }

          .cred {
            padding: 0px 16px;
            border-left: 1px solid #26303e;
            border-right: 1px solid #26303e;
          }

          .linkbtn {
            padding-left: 16px;
          }
        }

        font-weight: 700;

        img {
          margin-left: 10px;
          height: 20px;
        }
      }

      :deep(.el-descriptions__cell:first-child) {
        padding-bottom: 0px;
        padding-top: 12px;
      }

      :deep(.el-descriptions__cell) {
        line-height: 24px;

        .el-descriptions__label {
          --el-text-color-primary: rgba(0, 0, 0, 0.6);
          display: inline-block;
          width: 90px;
          text-align: right;
          margin-right: 7px;
        }

        .el-descriptions__content {
          --el-text-color-regular: rgba(0, 0, 0, 0.85);

          .content_tip {
            color: rgba(0, 0, 0, 0.3);
            font-size: 12px;
            line-height: 17px;
            margin-left: 90px;
            margin-top: 5px;
            display: flex;
            place-items: center;
          }
        }
      }

      .content {
        display: flex;

        .left {
          width: 600px;
          margin-left: -5px;

          li {
            padding-top: 12px;
            font-weight: 500;
            font-size: 14px;
            padding-left: 6px;
            line-height: 20px;
          }
        }

        .right {
          :deep(.el-descriptions__label) {
            width: 98px;
          }
        }
      }
    }
    .content-card2{
      margin-top: 18px;
    }
  }
}

:deep(.authDialog) {
  background: #1d222a !important;
  padding: 16px 24px 24px 24px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);
  border-radius: 10px 10px 10px 10px;

  .el-dialog__header {
    --el-dialog-padding-primary: 18px;
  }

  .el-dialog__title {
    font-weight: 700;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 23px;
    text-align: left;
  }

  .el-dialog__body {
    padding-bottom: 6px;
    padding-top: 10px;
    border-top: 1px solid #26303e;

    .input-bg {
      margin-top: 10px;
    }

    .title {
      display: flex;
      box-sizing: border-box;
      height: 40px;
      align-items: center;
      flex-wrap: nowrap;
      padding: 8px 0px;
      color: rgba(255, 255, 255, 0.6);

      font-size: 16px;

      img {
        height: 20px;
        margin-top: 2px;
        margin-right: 9px;
      }

      p {
        line-height: 23px;
      }
    }

    .el-input__wrapper {
      outline: none;
    }
  }

  .el-dialog__footer {
    .el-button {
      width: 76px;
    }
  }

  .input-bg {
    height: 40px;
  }

  .el-form-item__label {
    font-weight: 500;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }

  .el-form-item__content {
    .volume {
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
    }

    .des {
      font-weight: 400;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.3);
      line-height: 17px;
      margin: 8px 0 20px;
    }

    .currency {
      font-size: 12px;
      color: #df444d;
    }

    .price {
      font-size: 24px;
      color: #df444d;
    }
  }
}

:deep(.qrdialog) {
  background: #1d222a !important;
  padding: 16px 24px 24px 24px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);
  border-radius: 10px 10px 10px 10px;
  font-size: 16px;

  .el-dialog__header {
    --el-dialog-padding-primary: 16px;
  }

  .qr-box {
    display: flex;
    flex-flow: column;
    place-items: center;

    .qrcode_con {
      display: flex;
      flex-flow: column;
      place-items: center;
    }

    .title {
      line-height: 23px;
      margin-bottom: 18px;

    }
  }

  .el-dialog__title {
    font-weight: 700;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 23px;
    text-align: left;
  }

  .el-dialog__body {

    padding-top: 18px;
    border-top: 1px solid #26303e;

    .input-bg {
      margin-top: 10px;
    }

    .title {
      display: flex;
      box-sizing: border-box;
      height: 40px;
      align-items: center;
      flex-wrap: nowrap;
      padding: 8px 0px;
      color: rgba(255, 255, 255, 0.6);

      font-size: 16px;

      img {
        height: 20px;
        margin-top: 2px;
        margin-right: 9px;
      }

      p {
        line-height: 23px;
      }
    }

    .el-input__wrapper {
      outline: none;
    }
  }

  .el-dialog__footer {
    .el-button {
      width: 100%;
    }
  }

}

:deep(.withdrawDialog) {
  padding: 32px 32px 30px 32px;

  .el-dialog__footer {
    --el-dialog-padding-primary: 18px;
  }

  .confirmContent {
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    
 
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__footer {
    .el-button {
      width: 76px;
    }
  }
}
</style>

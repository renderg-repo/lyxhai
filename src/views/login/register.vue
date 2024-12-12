<template>
  <preTemp>
    <div class="form">
      <div class="top">
        <div class="title">
          {{ current_step == 1 || current_step == 2 ? "欢迎注册龙游星海" : "欢迎加入！" }}
        </div>
        <div class="title-desc">WELCOME!</div>
        <div class="right_icon">
          <div class="return_login_text flex-align-center" @click="returnLoginClick">
            <el-icon class="back-icon"><Back /></el-icon>
            {{ current_step == 1 || current_step == 2 ? "返回登录" : "" }}
          </div>
        </div>
      </div>
      <template v-if="current_step == 1">
        <div class="item_view">
          <div class="item">
            <div class="input_view" :class="[
              isPhoneError
                ? 'not_border'
                : form.phone.length && !isPhoneError
                  ? 'ok_border'
                  : '',
            ]">
              <el-input 
                id="username" 
                autocomplete="username" 
                v-model.trim="form.phone" 
                placeholder="请输入手机号"
                class="input" 
                @blur="checkPhone" 
                maxlength="11" >
                <template #prefix>
                  <img src="../../assets/images/username.svg" style="width: 16px; height: 16px;" alt="">
                  <!-- <el-icon class="el-input__icon"><User /></el-icon> -->
                </template>
              </el-input>
            </div>
            <div class="tip">
              <template v-if="isPhoneError || isHavePhoneText">{{
                isHavePhoneText ? isHavePhoneText : "请输入正确的手机号"
              }}</template>
            </div>
          </div>
          <div class="item">
            <div class="input_view flex-between flex-align-center" :class="[
              smsCodetext
                ? 'not_border'
                : form.smsCode.length && !smsCodetext
                  ? 'ok_border'
                  : '',
            ]">
              <el-input 
                v-model.trim="form.smsCode" 
                placeholder="请输入验证码" 
                class="input"
                @keyup.enter.native="submitClickDebounce" >
                <template #prefix>
                  <!-- <el-icon class="el-input__icon"><Message /></el-icon> -->
                  <img src="../../assets/images/smsCode.svg" style="width: 16px; height: 16px;" alt="">
                </template>
              </el-input>
              <div class="code_text select_none" @click="stabilization">
                {{ yzCode }}
              </div>
            </div>
            <div class="tip">
              <template v-if="smsCodetext">{{ smsCodetext }}</template>
            </div>
          </div>
          <div class="item">
            <div class="input_view" :class="[
              isPass1Error
                ? 'not_border'
                : form2.password.length && !isPass1Error
                  ? 'ok_border'
                  : '',
            ]">
              <el-input 
                id="new-password" 
                autocomplete="new-password" 
                name="new-password" 
                v-model.trim="form.password"
                placeholder="请输入密码" 
                class="input" 
                :type="`${showPass1 ? 'text' : 'password'}`" 
                @blur="checkPass1()" >
                <template #prefix>
                  <!-- <el-icon class="el-input__icon"><Lock /></el-icon> -->
                  <img src="../../assets/images/password.svg" style="width: 16px; height: 16px;" alt="">
                </template>
              </el-input>
              <!-- <img src="@/assets/images/plan/eyes_icon.png" alt="" class="eyes_icon" v-if="!hoverPassIcon1"
                @mouseenter="hoverPassIcon1 = true" />
              <img src="@/assets/images/plan/eyes_hover_icon.png" alt="" class="eyes_icon" v-else
                @mouseleave="hoverPassIcon1 = false" @click="() => (showPass1 = !showPass1)" /> -->
            </div>
            <div class="tip">
              <template v-if="isPass1Error">
                密码长度为8-20个字符，包含数字和字母组合</template>
            </div>
          </div>
          <div class="item">
            <div class="input_view" :class="[isinviterCodeErro ? 'not_border' : isinviterCodeErro]">
              <el-input 
                v-model.trim="form.inviterCode" 
                placeholder="邀请码(非必填)" 
                @blur="checkInvite" class="input" >
                <template #prefix>
                  <img src="../../assets/images/inviterCode.svg" style="width: 16px; height: 16px;" alt="">
                  <!-- <el-icon class="el-input__icon">
                    <MessageBox />
                  </el-icon> -->
                </template>
              </el-input>
            </div>
            <div class="tip">
              <template v-if="isinviterCodeErro"> 邀请码错误</template>
            </div>
          </div>
          <div class="item" style="margin-top: 16px">
            <div class="flex">
              <el-checkbox style="position: relative ;top: 1px;" v-model.trim="agree"></el-checkbox>
              <div class="agreement">
                <span class="one cursor" style="" @click="clickagree">我同意</span>
                <el-link href="https://help.spacehpc.com/document/agreements/service_agreement.html" type="primary"
                  target="_blank" style="font-size: 16px">服务协议</el-link>
              </div>
            </div>

            <div class="tip">
              <template v-if="isagree"> 请先阅读协议并同意 </template>
            </div>
          </div>
        </div>
      </template>
      <template v-if="current_step == 2">
        <div class="item_view">
          <el-input autocomplete="username" v-show="false" v-model.trim="form.phone" placeholder="用户名" class="input" />
        </div>
      </template>

      <template v-else-if="current_step == 3">
        <img src="@/assets/images/plan/register_logo.svg" alt="" class="register_logo" />
      </template>

      <el-button type="primary" class="submit_btn" @click="submitClickDebounce" :loading="loading">
        {{ current_step == 1 ? "注册" : "立即登录" }}
      </el-button>

      <div class="return_superior" @click="returnSuperiorClick" v-if="current_step == 2"
        @mouseenter="returnHover = true" @mouseleave="returnHover = false">
        <img src="@/assets/images/plan/return_icon.svg" alt="" class="return_icon" v-if="!returnHover" />
        <img v-else src="@/assets/images/plan/return_hover.svg" alt="" class="return_icon" />
        <div class="text">返回上级</div>
      </div>

      <!-- <div class="steps">
        <div
          class="steps_item"
          v-for="(item, index) in 3"
          :key="index"
          :class="[current_step == index + 1 ? 'steps_item_active' : '']"
        ></div>
      </div> -->

      <!-- <div class="bottom_tip">{{ errorText ? errorText : "" }}</div> -->
    </div>
  </preTemp>
</template>

<script setup>
import preTemp from "./preTemp.vue";
import Cookies from "js-cookie";
import {
  queryPhone,
  queryUsername,
  sendCode,
  register,
  initPassword,
  token,
  getQrCode,
  checkQrCode,
  basicInfo,
  phone,
  checkCode,
  forgetPassword,
  bind,
  checkInviteCode,
} from "@/api/login";
import { ElMessage } from "element-plus";
import { useMineStore } from "@/store/mine";

import {
  validatePhoneNumber,
  validateInput,
  validatePassword,
} from "@/utils/checkUtil";
import { reactive, ref } from "vue";
import { debounce, throttle } from "@/utils/tools";
import CryptoJS from "crypto-js";
const VITEAPP = import.meta.env.VITE_APP;
const mineStore = useMineStore();
const route = useRoute();
const router = useRouter();
const agree = ref(true);
const current_step = ref(1);
const smsCodetext = ref("");
const showPass1 = ref(false);
const showPass2 = ref(false);
const hoverPassIcon1 = ref(false);
const hoverPassIcon2 = ref(false);
const isagree = ref(false);
const loading = ref(false);
const returnLoginClick = () => {
  router.push({
    path: `/user/login`,
  });
};

const returnHover = ref(false);
const returnSuperiorClick = () => {
  current_step.value = 1;
};

const errorText = ref("");
const form = reactive({
  phone: "",
  smsCode: "",
  password: "",
  inviterCode: "",
});
const inviteCode = route.query.inviteCode;
if (inviteCode) {
  form.inviterCode = inviteCode;
}

console.log(inviteCode, "inviteCodeinviteCodeinviteCodeinviteCode");
const yzCode = ref("发送验证码");
const yzmTimer = ref(null);
const yzmCount = ref(60);
const yzmFlag = ref(true);
const registBtnDisabled = ref(false);
const yzCodeClick = () => {
  if (!validatePhoneNumber(form.phone)) {
    ElMessage({
      message: `请输入正确的手机号码！`,
      type: "error",
    });
    return;
  }
  if (!yzmFlag.value) {
    return;
  }
  queryPhone({ phone: form.phone.trim() })
    .then((res) => {
      if (res.code == 200) {
        isHavePhoneText.value = "";
        isPhoneError.value = false;
        clearInterval(yzmTimer.value);
        errorText.value = "";
        yzmFlag.value = false;
        yzCode.value = "发送中......";
        registBtnDisabled.value = true;
        sendCode({ phone: form.phone, type: 1 })
          .then((res) => {
            if (res.code == 1008) {
              yzmTimer.value = setInterval(() => {
                res.data -= 1;
                yzCode.value = `${res.data}秒`;
                if (!res.data) {
                  errorText.value = "";
                  yzCode.value = "发送验证码";
                  yzmFlag.value = true;
                  yzmCount.value = 60;
                  clearInterval(yzmTimer.value);
                }
              }, 1000);
            }
            if (res.code == 200) {
              registBtnDisabled.value = false;
              yzmTimer.value = setInterval(() => {
                yzmCount.value -= 1;
                yzCode.value = `${yzmCount.value}秒`;
                if (!yzmCount.value) {
                  yzCode.value = "发送验证码";
                  yzmFlag.value = true;
                  yzmCount.value = 60;
                  clearInterval(yzmTimer.value);
                }
              }, 1000);
            } else {
              errorText.value = res.message;
            }
          })
          .catch((err) => {
            console.log(err);
            yzmFlag.value = true;
            yzCode.value = "发送验证码";
            errorText.value = err.message;
          });
      } else {
        isHavePhoneText.value = res.message;
        isPhoneError.value = true;
        errorText.value = "";
        yzCode.value = "发送验证码";
        yzmFlag.value = true;
        yzmCount.value = 60;
        return
      }
    })
    .catch((err) => {
      console.log(err);
      isHavePhoneText.value = err.message;
    });

};

const password2 = ref("");
const form2 = reactive({
  passToken: "",
  password: "",
});
function handleFilings() {
  window.open("https://beian.miit.gov.cn/#/Integrated/index", "_blank");
}

function encryptPassword(password) {
  let keyStr = CryptoJS.enc.Utf8.parse("42b634e8e6854d6a");
  var encrypted = CryptoJS.AES.encrypt(password, keyStr, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

const submitClick = () => {
  // 配置请求头
  isinviterCodeErro.value = false
  let config = {};
  if (import.meta.env.VITE_APP === "chenyu") {
    config.headers = {
      "Tenant-ID": "1",
    };
  }
  if (import.meta.env.VITE_APP === "renderg") {
    config.headers = {
      "Tenant-ID": "0",
    };
  }
  errorText.value = "";
  smsCodetext.value = "";
  if (current_step.value == 1) {
    let hasError = false;
    if (!agree.value) {
      errorText.value = "请先阅读协议并同意";
      isagree.value = true;
      hasError = true;
    }
    if (checkPhone()) {
      hasError = true;
    }
    if (!form.smsCode) {
      smsCodetext.value = "验证码不能为空！";
      hasError = true;
    }
    if (checkPass1()) {
      hasError = true;
    }
    if (hasError) {
      return;
    }
    loading.value = true;
    register(form, config)
      .then((res) => {
        if (res.code == 200) {
          loading.value = false;
          current_step.value = 3;
          return;
        }
        if (res.message == "验证码无效！") {
          loading.value = false;
          smsCodetext.value = "验证码无效！";
        } else {
          loading.value = false;
          ElMessage({
            message: res.message,
            type: "error",
          });
        }
      })
      .catch((err) => {
        loading.value = false;
        errorText.value = err.message;
      });
  }
  if (current_step.value == 2) {
    if (checkPass2()) {
      return;
    }

    initPassword(form2)
      .then((res) => {
        if (res.code == 200) {
          current_step.value = 3;
        } else {
          errorText.value = res.message;
        }
      })
      .catch((err) => {
        errorText.value = err.message;
      });
    return;
  }
  if (current_step.value == 3) {
    loading.value = true;

    const encryptedPassword = encryptPassword(form.password);
    // console.log(encryptedPassword, "encryptedPassword");
    let obj = {
      username: form.phone,
      password: encryptedPassword,
    };
    token(obj).then((res) => {
      if (res.data && res.data.token) {
        loading.value = false;
        ElMessage({
          message: `登录成功`,
          type: "success",
        });

        mineStore.tokenInfo = res.data;
        Cookies.set("tokenInfo", JSON.stringify(res.data), { domain: '.spacehpc.com', path: '/' });
        // Cookies.set("tokenHead", res.data.tokenHead, { domain: '.spacehpc.com', path: '/' });
        // Cookies.set("token", res.data.token, {
        //   expires: res.data.expiresIn * 1000,
        //   domain: '.spacehpc.com',
        //   path: '/'
        // });
        basicInfo().then((infoRes) => {
          mineStore.userInfo = infoRes.data;
          const app = localStorage.getItem("application");
          const redirectedFrom = router.currentRoute.value.redirectedFrom;
          console.log(redirectedFrom);
          if (redirectedFrom) {
            router.push({ path: redirectedFrom.fullPath });
          } else {
            switch (app) {
              case "ai":
                router.push({ path: "/dashboard" });
                break;
              default:
                router.push({ path: "/dashboard" });
                break;
            }
          }
        });
      } else {
        errorText.value = res.message;
        loading.value = false;
      }
    });
  }
};
const submitClickDebounce = debounce(submitClick, 1000);
const stabilization = throttle(yzCodeClick, 10000)
const isHaveNameText = ref("");
const isNameError = ref(false);
const checkName = () => {
  if (!validateInput(form.smsCode.trim())) {
    isNameError.value = true;
  } else {
    queryUsername({ username: form.username.trim() })
      .then((res) => {
        if (res.code == 200) {
          isHaveNameText.value = "";
          isNameError.value = false;
        } else {
          isHaveNameText.value = res.message;
          isNameError.value = true;
        }
      })
      .catch((err) => {
        isHaveNameText.value = err.message;
      });
  }
  return isNameError.value;
};
function clickagree() {
  agree.value = !agree.value
}
const isHavePhoneText = ref("");
const isPhoneError = ref(false);
const checkPhone = () => {
  if (!validatePhoneNumber(form.phone.trim())) {
    isPhoneError.value = true;
  }
  // else {

  // }
  return isPhoneError.value;
};

const isPass1Error = ref(false);
const checkPass1 = () => {
  if (!validatePassword(form.password.trim())) {
    isPass1Error.value = true;
  } else {
    isPass1Error.value = false;
  }
  return isPass1Error.value;
};
const isinviterCodeErro = ref(false);
function checkInvite() {
  if (form.inviterCode.trim()) {
    checkInviteCode({ inviteCode: form.inviterCode.trim() })
      .then((res) => {
        if (res.code == 200) {
          isinviterCodeErro.value = false;
        } else {
          isinviterCodeErro.value = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
watch(
  () => agree.value,
  (val) => {
    if (val) {
      isagree.value = false;
    }
  }
);

onMounted(() => {
  if (route.query.phone) {
    form.phone = route.query.phone;
    yzCodeClick();
  }
});
</script>

<style lang="less" scoped>
@import url('../../assets/css/login.less');
.form {
  position: relative;
  :deep(.el-checkbox__inner::after) {
    position: absolute;
    height: 9px;
    left: 5px;
  }

  .top {
    .return_login_text {
      color: rgba(0, 0, 0, 0.5);
      font-size: 16px;
      cursor: pointer;
      position: absolute;
      top: 30px;
      .back-icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }
  }

  .register_logo {
    margin-top: 100px;
    margin-bottom: 110px;
  }

  .item_view {
    margin-top: 0 !important;
    padding-top: 0;
    .item {
      .agreement {
        display: flex;
        align-items: center;

        margin-left: 6px;
        font-size: 16px;

        .one {
          color: rgba(0, 0, 0, 0.6);
        }

        .two {
          color: #2696ff;
          cursor: pointer;

          &:hover {
            color: #69b7ff;
          }
        }
      }
    }
  }
  .tip {
    font-size: 12px;
    color: #d63939;
  }
  .code_text {
    width: 180px;
    height: 55px;
    color: #fff;
    border-radius: 5px;
    line-height: 55px;
    text-align: center;
    margin-left: 20px;
    background: linear-gradient(270deg, #3771FF 0%, #6FADFF 67.9%, #89CAFF 100%);
  }
}
</style>
<style lang="less">
.input_view {
  .el-input {
    height: 55px;
    border: 1px solid #3771FF;
    border-radius: 5px;
    .el-input__wrapper {
      background-color: rgba(48, 104, 255, 0.05) !important;
    }
  }
}
.el-input .el-input__icon {
  font-size: 16px;
}
.el-input__prefix-inner>:last-child {
  padding-right: 12px;
  border-right: 1px solid #ccc;
}
</style>
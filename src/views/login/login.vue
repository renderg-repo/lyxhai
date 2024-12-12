<template>
  <preTemp>
    <div class="form">
      <div class="top">
        <div class="title"> 欢迎登录龙游星海 </div>
        <div class="title-desc">WELCOME!</div>
      </div>

      <template v-if="loginType == '1'">
        <div class="item_view">
          <div class="item">
            <div class="input_view" :class="{
              input_border: phoneFocus,
              error_border: isError,
              phone_border: phoneisError,
            }">
              <el-input 
                id="username" 
                autocomplete="username" 
                v-model.trim="form.username" 
                placeholder="请输入手机号"
                class="input" 
                oninput="if(value.length>11)value=value.slice(0,11)"
                @blur="atPhoneFocus"
                @focus="atPhoneFocus" @change="atPhonechange">
                <template #prefix>
                  <el-icon style="font-size: 16px; color: #8793B6;"class="el-input__icon"><User /></el-icon>
                </template>
              </el-input>
            </div>

            <div class="tip">
              <!-- <template v-if="isPhoneError">手机号码不正确</template> -->
            </div>
          </div>
          <div class="item">
            <div class="input_view" :class="{ input_border: codeFocus, error_border: isError }">
              <el-input 
                autocomplete="password" 
                v-model.trim="form.password" 
                :type="`${showPass ? 'text' : 'password'}`"
                placeholder="密码" 
                class="input" 
                @focus="atCodeFocus" 
                @blur="atCodeFocus"
                @keyup.enter.native="submitClickDebounce" >
                <template #prefix>
                  <el-icon style="font-size: 16px; color: #8793B6;"class="el-input__icon"><Lock /></el-icon>
                </template>
              </el-input>
            </div>
          </div>
        </div>

        <div class="operate flex-between">
          <el-checkbox v-model="remember">记住密码</el-checkbox>
          <div class="forget_pass" @click="forgetClick">忘记密码</div>
        </div>
        <el-button type="primary" style="margin-top: 60px" class="submit_btn"
          @click="submitClickDebounce">立即登录</el-button>
        <div class="describe flex-center">
          <div class="text">还没有账户？</div>
          <div class="register_now_btn" @click="registerClick">立即注册</div>
        </div>
      </template>
      <div class="bottom_tip">{{ errorText ? errorText : "" }}</div>
    </div>
  </preTemp>
</template>

<script setup>
import preTemp from "./preTemp.vue";
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
  wechatLogin,
  checkCode,
  forgetPassword,
  bind,
} from "@/api/login";
import QrcodeVue from "qrcode.vue";
import { debounce, throttle } from "@/utils/tools";
import Cookies from "js-cookie";
import { ElMessage } from "element-plus";
import { useMineStore } from "@/store/mine";
import { validatePhoneNumber, validatePassword } from "@/utils/checkUtil";
import { handleError, ref, onUnmounted, onMounted } from "vue";
import QRCodeVue3 from "qrcode-vue3"
import CryptoJS from "crypto-js";
const VITEAPP = import.meta.env.VITE_APP;
const loginType = ref(1);
const route = useRoute();
const router = useRouter();
const mineStore = useMineStore();
const isSmallViewport = ref(false);
const phoneFocus = ref(false);
const codeFocus = ref(false);
const remember = ref(true);
const form = reactive({
  password: "",
  username: "",
  isKeepAlive: true,
});
const hoverPhoneIcon = ref(false);
const hoverScanIcon = ref(false);
const hoverPassIcon = ref(false);
const showPass = ref(false);
const loginFailFlag = ref(false);
const errorText = ref("");
const isError = ref(false);
const wxForm = reactive({
  phone: "",
  smsCode: "",
  wxTicket: "",
});
const phoneisError = ref(false);
const atPhoneFocus = () => {
  isError.value = false;
  phoneFocus.value = !phoneFocus.value;
};
const atCodeFocus = () => {
  codeFocus.value = !codeFocus.value;
};
const atPhonechange = () => {
  phoneisError.value = false;
  errorText.value = "";
  if (!validatePhoneNumber(form.username)) {
    errorText.value = "请输入正确的手机号码！";
    phoneisError.value = true;
    return;
  }
};
function encryptPassword(password) {
  let keyStr = CryptoJS.enc.Utf8.parse("42b634e8e6854d6a");
  var encrypted = CryptoJS.AES.encrypt(password, keyStr, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

if (!localStorage.hasOwnProperty("application")) {
  localStorage.setItem("application", "ai");
}
function checkViewportSize() {
  isSmallViewport.value = window.innerWidth <= 768;
}
//验证码登录按钮
const loginTitleClick = () => {
  phoneForm.phone = form.username;
  form.password = "";
  hoverPhoneIcon.value = true;
  errorText.value = "";
  isError.value = false;
  loginType.value = 2;
  if (validatePhoneNumber(phoneForm.phone)) {
    let obj = { phone: phoneForm.phone, type: 0 };
    console.log(obj);
    yzCodeClick("phonecode");
  }
};
//账号登录按钮
const phoneClick = () => {
  yzCode.value = "发送验证码";
  yzmFlag.value = true;
  yzmCount.value = 60;
  form.username = "";
  scanInfo.value = "";
  loading.value = true;
  clearInterval(yzmTimer.value);
  isPhoneError.value = false;
  clearInterval(scanTimer.value);
  phoneForm.smsCode = "";
  wxForm.phone = "";
  wxForm.smsCode = "";
  hoverPhoneIcon.value = false;
  errorText.value = "";
  isError.value = false;
  phoneisError.value = false;
  passKey.value++;
  loginType.value = 1;
};

const passKey = ref(1);
const submitClick = async () => {
  let res = null;
  try {
    if (loginType.value == 1) {
      if (form.username && form.password) {
        //加密
        const encryptedPassword = encryptPassword(form.password);
        let obj = {
          username: form.username,
          password: encryptedPassword,
        };
        res = await token(obj);
      } else {
        errorText.value = "请输入正确的手机号和验证码";
        isError.value = true;
        return;
      }
    } else if (loginType.value == 2) {
      if (phoneForm.phone && phoneForm.smsCode) {
        res = await phone(phoneForm);
        if (res.code == 1001) {
          errorText.value = "手机号码未注册，将为您跳转至注册页面。";
          setTimeout(
            () =>
              router.push({
                path: "/user/register",
                query: { phone: phoneForm.phone },
              }),
            3000
          );

          return;
        }
      } else {
        errorText.value = "请输入正确的手机号和验证码";
        return;
      }
    } else if (loginType.value == 4) {
      loading.value = true;
      res = await wechatLogin(wxForm);
      if (res.code == 200) {
        loading.value = false;
      }
    }
    if (res.data && res.data.token) {

      ElMessage({
        message: `登录成功`,
        type: "success",
      });
      isError.value = false;
      loginFailFlag.value = false;
      mineStore.tokenInfo = res.data;
      Cookies.set("tokenInfo", JSON.stringify(res.data), { domain: '.spacehpc.com', path: '/' })
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
          router.push({
            path: redirectedFrom.path,
            query: redirectedFrom.query,
          });
        } else {
          router.push({ path: "/dashboard" });
        }
      });
    } else {
      loading.value = false;
      isError.value = true;
      errorText.value = res.message;
    }
  } catch (error) {
    console.log(error);
  }
};
const submitClickDebounce = throttle(submitClick, 1000);
const phoneForm = reactive({
  phone: "",
  smsCode: "",
});

const yzCode = ref("发送验证码");
const yzmTimer = ref(null);
const yzmCount = ref(60);
const yzmFlag = ref(true);
const yzCodeClick = (val) => {
  let obj = {};
  if (val == "phonecode") {
    obj = { phone: phoneForm.phone, type: 0 };
    if (!validatePhoneNumber(phoneForm.phone)) {
      ElMessage({
        message: `请输入正确的手机号码！`,
        type: "error",
      });
      return;
    }
    if (!yzmFlag.value) {
      return;
    }
  }
  if (val == "wxcode") {
    console.log("wxcode");
    obj = { phone: wxForm.phone, type: 5 };
    if (!validatePhoneNumber(wxForm.phone)) {
      ElMessage({
        message: `请输入正确的手机号码！`,
        type: "error",
      });
      return;
    }
    if (!yzmFlag.value) {
      return;
    }
  }
  sendCode(obj)
    .then((res) => {
      if (res.code == 1001) {
        errorText.value = "手机号码未注册，将为您跳转至注册页面。";
        setTimeout(
          () =>
            router.push({
              path: "/user/register",
              query: { phone: phoneForm.phone },
            }),
          3000
        );
        return;
      }
      if (res.code == 1008) {
        yzmTimer.value = setInterval(() => {
          res.data -= 1;
          yzCode.value = `${res.data}秒`;
          if (!res.data) {
            yzCode.value = "发送验证码";
            yzmFlag.value = true;
            yzmCount.value = 60;
            clearInterval(yzmTimer.value);
          }
        }, 1000);
        return;
      }
      if (res.code == 200) {
        yzCode.value = "发送中......";
        yzmFlag.value = false;
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
      loginFailFlag.value = true;
      ElMessage({
        message: `${err.message}`,
        type: "error",
      });
    });
};

const scanInfo = ref({});
const scanTimer = ref(null);
const expireQrCode = ref(false);
const loading = ref(true);
const scanClick = () => {
  errorText.value = "";
  form.password = "";
  form.username = "";
  phoneForm.phone = "";
  phoneForm.smsCode = "";
  isError.value = false;
  expireQrCode.value = false;
  clearInterval(scanTimer.value);
  loginType.value = 3;
  getQrCode().then((res) => {
    if (res.code == 200) {
      loading.value = false;
    }
    scanInfo.value = res.data;
    scanTimer.value = setInterval(() => {
      scanInfo.value.expire_seconds -= 2;
      checkQrCode({ ticket: scanInfo.value.ticket })
        .then((check) => {
          if (check.code == 400) {
            expireQrCode.value = true;
            clearInterval(scanTimer.value);
          }
          if (check.code == 1002) {
            loginType.value = 4;
            wxForm.wxTicket = check.data;
          }
          if (check.code == 1006) {
            expireQrCode.value = true;
            errorText.value = "手机号已绑定其他微信";
          }
          if (check.data.token) {
            clearInterval(scanTimer.value);
            ElMessage({
              message: `登录成功`,
              type: "success",
            });
            loginFailFlag.value = false;
            mineStore.tokenInfo = check.data;
            Cookies.set("tokenInfo", JSON.stringify(check.data), { domain: '.spacehpc.com', path: '/' });
            // Cookies.set("tokenHead", check.data.tokenHead, { domain: '.spacehpc.com', path: '/' });
            // Cookies.set("token", check.data.token, {
            //   expires: check.data.expiresIn * 1000,
            //   domain: '.spacehpc.com',
            //   path: '/'
            // });
            expireQrCode.value = true;
            basicInfo().then((infoRes) => {
              mineStore.userInfo = infoRes.data;
              router.push({ path: `/` });
            });
          } else {
            expireQrCode.value = true;
            errorText.value = check.message;
          }
        })
        .catch((checkErr) => {
          console.log(checkErr);
          if (checkErr.code == 400) {
            expireQrCode.value = true;
            clearInterval(scanTimer.value);
          }
        });
      if (scanInfo.value.expire_seconds <= 0) {
        expireQrCode.value = true;
        clearInterval(scanTimer.value);
      }
    }, 2000);
  });
};
const refreshQrCode = () => {
  scanClick();
};

const forgetClick = () => {
  router.push({
    path: `/user/resetPassword`,
  });
};
const registerClick = () => {
  router.push({
    path: `/user/register`,
  });
};

const isPhoneError = ref(false);
const checkPhone = () => {
  if (!validatePhoneNumber(phoneForm.phone.trim())) {
    isPhoneError.value = true;
  } else {
    isPhoneError.value = false;
  }
  return isPhoneError.value;
};
const holdBoxHover = ref(false);
function handleEnter() {
  holdBoxHover.value = true;
}
function handleLeave() {
  holdBoxHover.value = false;
}

function handleFilings() {
  window.open("https://beian.miit.gov.cn/#/Integrated/index", "_blank");
}

onMounted(() => {
  checkViewportSize();
  clearInterval(scanTimer.value);
  window.addEventListener("resize", checkViewportSize);
  const mine = JSON.parse(window.localStorage.getItem("mine"));
  if (mine && mine.tokenInfo && mine.tokenInfo.token) {
    router.push({ path: "/dashboard" });
  }
});
onUnmounted(() => {
  clearInterval(scanTimer.value);
});
</script>

<style lang="less" scoped>
@import url('../../assets/css/login.less');
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
.holdBox {
  .el-checkbox__inner {
    border-color: #409eff;
  }
}

.textHover {
  color: #fff !important;
}
</style>

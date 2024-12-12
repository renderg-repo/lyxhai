<template>
  <preTemp>
    <div class="form">
      <div class="top flex-between flex-align-center">
        <div class="title">
          {{ current_step == 3 ? "密码已重置！" : "重置密码" }}
        </div>
        <div class="right_icon">
          <div
            class="return_login_text"
            @click="returnLoginClick"
            v-show="current_step != 3"
          >
            返回登录
          </div>
        </div>
      </div>
      <template v-if="current_step == 1">
        <div class="item_view">
          <div class="item">
            <div
              class="input_view"
              :class="[
                isPhoneError
                  ? 'not_border'
                  : form1.phone.length && !isPhoneError
                  ? 'ok_border'
                  : '',
              ]"
            >
              <el-input
                v-model="form1.phone"
                placeholder="请输入手机号码"
                class="input"
                @blur="checkPhone">
                <template #prefix>
                  <el-icon class="el-input__icon"><User /></el-icon>
                </template>
              </el-input>
            </div>
            <div class="tip">
              <template v-if="isPhoneError">手机号码不正确</template>
            </div>
          </div>
          <div class="item">
            <div
              class="input_view flex-between flex-align-center"
              :class="[
                smsCodetext
                  ? 'not_border'
                  : form1.phone.length && !smsCodetext
                  ? 'ok_border'
                  : '',
              ]"
            >
              <el-input
                v-model="form1.smsCode"
                placeholder="验证码"
                class="input"
              >
                <template #prefix>
                  <el-icon class="el-input__icon"><Message /></el-icon>
                </template>
              </el-input>
              <div class="code_text select_none" @click="yzCodeClick">
                {{ yzCode }}
              </div>
            </div>
            <div class="tip">
              <template v-if="smsCodetext">{{ smsCodetext }}</template>
            </div>
          </div>
          <div class="item">
            <div
              class="input_view"
              :class="[
                isPass1Error
                  ? 'not_border'
                  : form2.password.length && !isPass1Error
                  ? 'ok_border'
                  : '',
              ]"
            >
              <el-input
                v-model="form1.password"
                :type="`${showPass1 ? 'text' : 'password'}`"
                placeholder="新密码"
                class="input"
                @blur="checkPass1()"
              >
                <template #prefix>
                  <el-icon class="el-input__icon"><Lock /></el-icon>
                </template>
              </el-input>
              <!-- <img
                src="@/assets/images/plan/eyes_icon.png"
                alt=""
                class="eyes_icon"
                v-if="!hoverPassIcon1"
                @mouseenter="hoverPassIcon1 = true"
              />
              <img
                src="@/assets/images/plan/eyes_hover_icon.png"
                alt=""
                class="eyes_icon"
                v-else
                @mouseleave="hoverPassIcon1 = false"
                @click="() => (showPass1 = !showPass1)"
              /> -->
            </div>
            <div class="tip">
              <template v-if="isPass1Error">
                密码长度为8-20个字符，包含数字和字母组合</template
              >
            </div>
          </div>
        </div>
      </template>

      <template v-if="current_step == 2">
        <div class="item_view">
          <div class="item">
            <div
              class="input_view"
              :class="[
                isPass2Error
                  ? 'not_border'
                  : password2.length && !isPass2Error
                  ? 'ok_border'
                  : '',
              ]"
            >
              <el-input
                v-model="password2"
                :type="`${showPass2 ? 'text' : 'password'}`"
                placeholder="确认新密码"
                class="input"
                @blur="checkPass2()"
              />
              <!-- <img
                src="@/assets/images/plan/eyes_icon.png"
                alt=""
                class="eyes_icon"
                v-if="!hoverPassIcon2"
                @mouseenter="hoverPassIcon2 = true"
              />
              <img
                src="@/assets/images/plan/eyes_hover_icon.png"
                alt=""
                class="eyes_icon"
                v-else
                @mouseleave="hoverPassIcon2 = false"
                @click="() => (showPass2 = !showPass2)"
              /> -->
            </div>
            <div class="tip" v-if="isPass2Error">俩次密码不相同</div>
          </div>
        </div>
      </template>

      <template v-else-if="current_step == 3">
        <img
          src="@/assets/images/plan/register_logo.svg"
          alt=""
          class="register_logo"
        />
      </template>

      <el-button
        type="primary"
        style="margin-top: 60px"
        class="submit_btn"
        @click="submitClick"
      >
        {{ current_step == 3 ? "立即登录" : "确定" }}
      </el-button>

      <div
        class="return_superior"
        @click="returnSuperiorClick"
        v-if="current_step == 2"
        @mouseenter="returnHover = true"
        @mouseleave="returnHover = false"
      >
        <img
          src="@/assets/images/plan/return_icon.svg"
          alt=""
          class="return_icon"
          v-if="!returnHover"
        />
        <img
          v-else
          src="@/assets/images/plan/return_hover.svg"
          alt=""
          class="return_icon"
        />
        <div class="text">返回上级</div>
      </div>

      <!-- <div class="steps">
        <div
          class="steps_item"
          v-for="(item, index) in 3"
          :key="index"
          :class="[current_step >= index + 1 ? 'steps_item_active' : '']"
        ></div>
      </div> -->

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
  checkCode,
  forgetPassword,
  bind,
} from "@/api/login";
import {
  validatePhoneNumber,
  validateInput,
  validatePassword,
} from "@/utils/checkUtil";

const route = useRoute();
const router = useRouter();
const smsCodetext = ref("");
const showPass1 = ref(false);
const showPass2 = ref(false);
const hoverPassIcon1 = ref(false);
const hoverPassIcon2 = ref(false);

const form1 = reactive({
  phone: "",
  smsCode: "",
  password: "",
});

const form2 = reactive({
  password: "",
  phone: "",
  smsCode: "",
});

const password2 = ref("");
const isPass1Error = ref(false);
const checkPass1 = () => {
  if (!validatePassword(form1.password.trim())) {
    isPass1Error.value = true;
  } else {
    isPass1Error.value = false;
  }
  return isPass1Error.value;
};

const isPass2Error = ref(false);
const checkPass2 = () => {
  if (form2.password.trim() != password2.value.trim()) {
    isPass2Error.value = true;
  } else {
    isPass2Error.value = false;
  }
  return isPass2Error.value;
};

const current_step = ref(1);
const returnHover = ref(false);
const returnSuperiorClick = () => {
  current_step.value = 1;
};

const returnLoginClick = () => {
  router.push({
    path: `/user/login`,
  });
};
const errorText = ref("");
const yzCode = ref("发送验证码");
const yzmTimer = ref(null);
const yzmCount = ref(60);
const yzmFlag = ref(true);
const yzCodeClick = () => {
  if (!validatePhoneNumber(form1.phone)) {
    ElMessage({
      message: `请输入正确的手机号码！`,
      type: "error",
    });
    return;
  }
  if (!yzmFlag.value) {
    return;
  }
  clearInterval(yzmTimer.value);
  errorText.value = "";
  yzmFlag.value = false;
  sendCode({ phone: form1.phone, type: 3 })
    .then((res) => {
      if (res.code == 200) {
        yzCode.value = "发送中......";
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
      yzmFlag.value = true;
      errorText.value = err.message;
    });
};

const submitClick = () => {
  console.log(current_step.value);
  errorText.value = "";
  if (current_step.value == 1) {
    if (checkPhone()) {
      return;
    }
    if (!form1.smsCode) {
      smsCodetext.value = "请输入验证码！";
      return;
    }
    if (checkPass1()) {
      return;
    }
    forgetPassword(form1)
      .then((res) => {
        if (res.code == 200) {
          current_step.value = 3;
        } else {
          ElMessage({
            message: res.message,
            type: "error",
          });
        }
      })
      .catch((err) => {
        errorText.value = err.message;
      });

    return;
    // checkCode({
    //   keyword: form1.phone,
    //   smsCode: form1.code,
    //   type: 3,
    // })
    //   .then((res) => {

    //   })
    //   .catch((err) => {
    //     errorText.value = err.message;
    //   });
    // return;
  }
  if (current_step.value == 2) {
    if (checkPass2()) {
      return;
    }
  }
  if (current_step.value == 3) {
    router.push({
      path: `/user/login`,
    });
    return;
  }
};

const isPhoneError = ref(false);
const checkPhone = () => {
  if (!validatePhoneNumber(form1.phone.trim())) {
    isPhoneError.value = true;
  } else {
    isPhoneError.value = false;
  }
  return isPhoneError.value;
};
</script>

<style lang="less" scoped>
@import url('../../assets/css/login.less');
</style>
<style lang="less" scoped>
.form {
  .item_view {
    padding-top: 0;
    margin-top: 0 !important;
    box-sizing: border-box;

    .item {
      margin-top: 40px;
    }
  }
  .title {
    font-size: 24px;
  }
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
.tip {
  font-size: 12px;
  color: #d63939;
}
.register_logo {
  margin-top: 100px;
  margin-bottom: 83px;
}
.return_login_text {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
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
</style>

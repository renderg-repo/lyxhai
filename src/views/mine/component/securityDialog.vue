<!-- 账户安全弹框 -->
<template>
  <el-dialog v-model="props.isDialog" :close-on-click-modal="true" width="450px" align-center class="accountSecuritylog"
    :show-close="dialogFrom.isRigthCloseX" destroy-on-close :before-close="closeDialog">
    <template #header>
      <div class="dialog_title">{{ dialogFrom.title }}</div>
    </template>
    <!-- 中间内容 -->
    <div class="conter_text">{{ dialogFrom.conterText }}</div>
    <!-- 修改用户名 -->
    <template v-if="dialogFrom.type == 1">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top"  :inline="true" @submit.stop.prevent>
        <el-form-item prop="username" style="margin: 0px !important;">
          <el-input input-style="color:#000;" clearable style="width: 410px; height: 40px" v-model="form.username"
            placeholder="用户名" @keyup.enter="confirmDialog(ruleFormRef)">
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 编辑资料 -->
    <template v-if="dialogFrom.type == 2">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent>
        <el-form-item prop="company">
          <el-input input-style="color:#000;" style="width: 410px; height: 40px" v-model="form.company"
            placeholder="资料" @keyup.enter="confirmDialog(ruleFormRef)">
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 修改密码 -->
    <template v-if="dialogFrom.type == 3">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent style="margin-top: 20px;">
        <el-form-item prop="oldPassword" style="margin:0px 0px 10px 0px" >
          <!-- input-style="color:#FFFFFF;" -->
          <el-input type="password" autocomplete="current-password" show-password 
            style="width: 410px; height: 40px; color: #fff;" v-model="form.oldPassword" placeholder="现在的密码" />
        </el-form-item>
        <el-form-item style="margin:0px 0px 10px 0px" prop="password">
          <el-input id="new-password" type="password" name="newPassword" autocomplete="new-password" show-password
             style="width: 410px; height: 40px" v-model="form.password"
            placeholder="新密码长度为8-20个字符，包含数字和字母组合" />
        </el-form-item>
        <el-form-item prop="newPassword2" style="margin:0px 0px 10px 0px" >
          <el-input id="confirm-new-password" type="password" name="confirmNew" autocomplete="new-password"
            show-password  style="width: 410px; height: 40px" v-model="form.newPassword2"
            placeholder="确认新密码" @keyup.enter="confirmDialog(ruleFormRef)">
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 设置密码 -->
    <template v-if="dialogFrom.type == 12">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent>
        <el-form-item prop="password">
          <el-input id="new-password" type="password" name="newPassword" autocomplete="new-password" show-password
            input-style="color:#000;" style="width: 410px; height: 40px" v-model="form.password"
            placeholder="新密码长度为8-20个字符，包含数字和字母组合" />
        </el-form-item>
        <el-form-item prop="newPassword2">
          <el-input id="confirm-new-password" type="password" name="confirmNew" autocomplete="new-password"
            show-password input-style="color:#000;" style="width: 410px; height: 40px" v-model="form.newPassword2"
            placeholder="确认新密码" @keyup.enter="confirmDialog(ruleFormRef)">
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 绑定邮箱 -->
    <template v-if="dialogFrom.type == 4">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent  >
        <el-form-item prop="email">
          <el-input input-style="color:#000;" style="width: 410px; height: 40px" v-model="form.email"
            placeholder="邮箱地址" />
        </el-form-item>
        <el-form-item prop="smsCode">
          <div class="input_box">
            <el-input input-style="color:#000;" style="width: 260px; height: 40px" v-model="form.smsCode"
              placeholder="验证码" @change="codeChange">
            </el-input>
            <el-button class="code_btn" :disabled="sms.disabled" @click="codeClick(1)">{{ sms.codeText }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <!-- 解绑邮箱 -->
    <!-- <template v-if="dialogFrom.type == 5">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent>
        <el-form-item prop="email">
          <el-input input-style="color:#FFFFFF;" style="width: 410px; height: 40px" v-model="form.email"
            placeholder="邮箱地址" />
        </el-form-item>
        <el-form-item prop="smsCode">
          <div class="input_box">
            <el-input input-style="color:#FFFFFF;" style="width: 260px; height: 40px" v-model="form.smsCode"
              placeholder="验证码" @change="codeChange">
            </el-input>
            <el-button class="code_btn" :disabled="sms.disabled" @click="codeClick(2)">{{ sms.codeText }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </template> -->
    <!-- 绑定微信  -->
    <template v-if="dialogFrom.type == 7">
      <div>
        <div class="qrcode_con">
          <QRCodeVue3 :width="150" :height="150" v-if="scanInfo?.url" :value="scanInfo?.url"
            :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' }"
            :imageOptions="{ hideBackgroundDots: true, imageSize: 0.5, margin: 5 }" margin="0"
            image="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzE5MzY0NjU5ODc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1MjQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTIzNi4yNCAzMjMuNzY5YzAgMjQuMDA1IDE5LjMyIDQzLjMyNSA0My4zMjUgNDMuMzI1czQzLjMyNi0xOS4zMiA0My4zMjYtNDMuMzI1YzAtMjQuMDA1LTE5LjMyMS00My4zMjUtNDMuMzI2LTQzLjMyNS0yNC4wMDQgMC00My4zMjUgMTkuMzItNDMuMzI1IDQzLjMyNXogbTMzNi4wNjQgMjIzLjA2N2MwIDE4LjczNSAxNS4yMjMgMzMuOTU4IDMzLjk1OCAzMy45NThzMzMuOTU4LTE1LjIyMyAzMy45NTgtMzMuOTU4LTE1LjIyMy0zMy45NTgtMzMuOTU4LTMzLjk1OC0zMy45NTggMTUuMjIzLTMzLjk1OCAzMy45NTh6TTQ1Ni4zOCAzMjMuNzY5YzAgMjQuMDA1IDE5LjMyIDQzLjMyNSA0My4zMjUgNDMuMzI1IDI0LjAwNSAwIDQzLjMyNS0xOS4zMiA0My4zMjUtNDMuMzI1IDAtMjQuMDA1LTE5LjMyLTQzLjMyNS00My4zMjUtNDMuMzI1LTI0LjAwNSAwLTQzLjMyNSAxOS4zMi00My4zMjUgNDMuMzI1eiIgcC1pZD0iMTUyNSIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Ik04NTguMDE3IDBIMTY1Ljk4M0M3NC42NDggMCAwLjI5MyA3NC4zNTYgMC4yOTMgMTY2LjI3NnY2OTAuODYzYzAgOTEuOTIgNzQuMzU1IDE2Ni4yNzYgMTY1LjY5IDE2Ni4yNzZoNjkyLjAzNGM5MS4zMzUgMCAxNjUuNjktNzQuMzU2IDE2NS42OS0xNjYuMjc2VjE2Ni4yNzZDMTAyMy43MDcgNzQuOTQgOTQ5LjM1MiAwIDg1OC4wMTcgMHpNMzg0LjM2NiA2ODYuMThjLTM4LjY0MiAwLTY5LjY3Mi04LjE5Ny0xMDguODk5LTE1LjgwOEwxNjcuMTU0IDcyNC44MmwzMS4wMy05My4wOUMxMjAuMzE2IDU3Ny4yOCA3NC4wNjMgNTA3LjAyMiA3NC4wNjMgNDIyLjEyOGMwLTE0Ny41NCAxMzkuOTI5LTI2NC4wNSAzMTAuMzAzLTI2NC4wNSAxNTIuODEgMCAyODYuMjk4IDkzLjA5IDMxMy4yMyAyMTcuNzk4YTI1NS4zNDEgMjU1LjM0MSAwIDAgMC0yOS44NTktMS43NTdjLTE0Ny41NCAwLTI2NC4wNSAxMTAuMDctMjY0LjA1IDI0NS4zMTUgMCAyMi44MzQgMy41MTMgNDQuNDk2IDkuMzY3IDY0Ljk4OC05LjM2NyAxLjE3MS0xOC43MzUgMS43NTctMjguNjg4IDEuNzU3eiBtNDU3Ljg0MyAxMDguMzEzbDIzLjQyIDc3LjI4My04NC44OTUtNDYuODM4Yy0zMS4wMyA3LjYxLTYyLjA2IDE1LjgwOC05My4wOSAxNS44MDgtMTQ3LjU0MSAwLTI2NC4wNTEtMTAwLjcwMy0yNjQuMDUxLTIyNS40MSAwLTEyNC4xMiAxMTYuNTEtMjI1LjQwOCAyNjQuMDUtMjI1LjQwOCAxMzkuMzQ0IDAgMjYzLjQ2NSAxMDEuMjg4IDI2My40NjUgMjI1LjQwOS0wLjU4NSA3MC44NDMtNDYuODM4IDEzMi45MDMtMTA4Ljg5OSAxNzkuMTU2eiIgcC1pZD0iMTUyNiIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Ik03NDEuNTA3IDU0Ni44MzZjMCAxOC43MzUgMTUuMjIzIDMzLjk1OCAzMy45NTggMzMuOTU4czMzLjk1OC0xNS4yMjMgMzMuOTU4LTMzLjk1OC0xNS4yMjMtMzMuOTU4LTMzLjk1OC0zMy45NThjLTE5LjMyIDAtMzMuOTU4IDE1LjIyMy0zMy45NTggMzMuOTU4eiIgcC1pZD0iMTUyNyIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPjwvc3ZnPg=="
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
          <!-- <qrcode-vue v-if="scanInfo?.url" :value="scanInfo?.url" size="150" level="H"></qrcode-vue> -->
          <div class="qrcode_mask" v-if="expireQrCode">
            <img
              src="https://img0.baidu.com/it/u=3232582821,3516640051&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1694624400&t=9e7252c7a5a41ac57e3f55666be42e50"
              alt="" class="refresh_icon" @click="refreshQrCode" />
            <div class="text">点击刷新</div>
          </div>
        </div>
        <div class="qrcode_tip">绑定微信后可以使用微信登录和接收通知</div>
      </div>
    </template>
    <!-- 验证当前手机号 -->
    <template v-if="dialogFrom.type == 9">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent>
        <!-- <el-form-item prop="phone">
          <el-input :disabled="true" input-style="color:#FFFFFF;" style="width: 410px; height: 40px" v-model="form.phone"
            placeholder="现在的手机号" />
        </el-form-item> -->
        <div class="phone_text">{{ hideMiddleDigits(form.phone) }}</div>
        <el-form-item prop="oldSmsCode">
          <div class="input_box">
            <el-input input-style="color:#000;" style="width: 260px; height: 40px" v-model="form.oldSmsCode"
              placeholder="验证码" @change="codeChange" @keyup.enter="confirmDialog(ruleFormRef)">
            </el-input>
            <el-button class="code_btn" :disabled="sms.disabled" @click="codeClick(3)">{{ sms.codeText }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <!-- 验证新手机号 -->
    <template v-if="dialogFrom.type == 10">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent>
        <el-form-item prop="newPhone">
          <el-input input-style="color:#000;" style="width: 410px; height: 40px" v-model="form.newPhone"
            placeholder="新的手机号" />
        </el-form-item>
        <el-form-item prop="newSmsCode">
          <div class="input_box">
            <el-input input-style="color:#000;" style="width: 260px; height: 40px" v-model="form.newSmsCode"
              placeholder="验证码" @change="codeChange" @keyup.enter="confirmDialog(ruleFormRef)">
            </el-input>
            <el-button class="code_btn" :disabled="sms.disabled" @click="codeClick(4)">{{ sms.codeText }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <!-- 绑定手机号 -->
    <template v-if="dialogFrom.type == 11">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true" @submit.stop.prevent>
        <el-form-item prop="newPhone">
          <el-input input-style="color:#000;" style="width: 410px; height: 40px" v-model="form.newPhone"
            placeholder="新的手机号" />
        </el-form-item>
        <el-form-item prop="newSmsCode">
          <div class="input_box">
            <el-input input-style="color:#000;" style="width: 260px; height: 40px" v-model="form.newSmsCode"
              placeholder="验证码" @change="codeChange" @keyup.enter="confirmDialog(ruleFormRef)">
            </el-input>
            <el-button class="code_btn" :disabled="sms.disabled" @click="codeClick(4)">{{ sms.codeText }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </template>

    <!-- <el-form label-position="top" :inline="true" @submit.stop.prevent>
      <el-form-item prop="code">
        <el-input input-style="color:#FFFFFF;" style="width: 410px; height: 40px" v-model="formCon.name" placeholder="用户名"
          @keyup.enter="onQuery()">
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="formCon.name" type="password" show-password input-style="color:#FFFFFF;"
          style="width: 410px; height: 40px" placeholder="现在的密码" @keyup.enter="onQuery()">
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="input_box">
          <el-input input-style="color:#FFFFFF;" style="width: 260px; height: 40px" v-model="formCon.name"
            placeholder="验证码" @keyup.enter="onQuery()">
          </el-input>
          <div class="code_btn" @click="codeClick">发送验证码</div>
        </div>
      </el-form-item>
    </el-form> -->

    <slot name="insert"> </slot>
    <template #footer>
      <template v-if="dialogFrom.type != 7">
        <div class="dialog_footer" v-if="dialogFrom.type == 9">
          <div class="next_btn" v-if="dialogFrom.isConfirm" type="primary" @click="confirmDialog(ruleFormRef)">
            下一步
          </div>
        </div>
        <div class="dialog_footer" v-else>
          <div class="close_btn" v-if="dialogFrom.isClose" @click="closeDialog(ruleFormRef)">
            {{ dialogFrom.closeText }}
          </div>
          <div class="confirm_btn" v-if="dialogFrom.isConfirm" type="primary" @click="confirmDialog(ruleFormRef)">
            {{ dialogFrom.confirmText }}
          </div>
        </div>
      </template>
    </template>
  </el-dialog>
</template>

<script setup>
import QrcodeVue from "qrcode.vue";
import {
  validatePhoneNumber,
  validateName,
  validateEmail,
  validatePassword,
} from "@/utils/checkUtil";
import { useMineStore } from "@/store/mine";
import {
  updateUserName,
  updateBasicInfo,
  updatePassword,
  bindPhone,
  changePhone,
  sendEmailCode,
  bindEmail,
  unbindEmail,
  getQrCode,
  unbindWeChat,
  sendCode,
  sendCheckCode,
  checkCode,
  checkSendCode,
  setPassword,
} from "@/api/mine";
import { checkQrCode, basicInfo } from "@/api/login";
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { hideMiddleDigits } from "@/utils/tools";
import Cookies from "js-cookie";
import QRCodeVue3 from "qrcode-vue3"
const mineStore = useMineStore();
const route = useRoute();
const router = useRouter();
const userInfo = computed(() => {
  return mineStore.userInfo;
});

const props = defineProps({
  // dialogType= 1修改用户名 2编辑资料 3修改密码 4绑定邮箱 5解绑邮箱（输入） 6解绑邮箱（确认） 7解绑微信 8验证当前手机号 9验证新手机号
  dialogType: {
    //弹窗类型
    type: Number,
    default: () => {
      return 0;
    },
  },
  isDialog: {
    //弹框开关
    type: Boolean,
    default: () => false,
  },
  info: {
    type: Object,
    default: () => ({}),
  },
});

// 弹框配置
let dialogFrom = reactive({
  type: 0,
  title: "提示",
  conterText: "", //提示内容
  isClose: true,
  closeText: "取消",
  isConfirm: true,
  confirmText: "确定",
  isRigthCloseX: false, //X按钮
});

// 表单校验
// let rules = reactive({})
const rules = reactive({
  username: [{ validator: valiName, trigger: "blur" }],
  company: [
    { required: true, message: "名称必须在20字符以内", trigger: "blur" },
    { min: 1, max: 20, message: "名称必须在20字符以内", trigger: "blur" },
  ],
  oldPassword: [{ validator: valiPassword, trigger: "blur" }],
  password: [{ validator: valiNewpassword1, trigger: "blur" }],
  newPassword2: [{ validator: valiNewpassword2, trigger: "blur" }],
  email: [{ validator: valiMailbox, trigger: "blur" }],
  smsCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { validator: valiCode, trigger: "blur" },
  ],
  newSmsCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { validator: valiCode, trigger: "blur" },
  ],
  oldSmsCode: [{ validator: valiCode, trigger: "blur" }],
  phone: [{ validator: valiPhone, trigger: "blur" }],
  newPhone: [{ validator: valiPhone, trigger: "blur" }],
});
// 验证手机号
function valiPhone(rule, value, callback) {
  let success = validatePhoneNumber(value);
  if (success) {
    return callback();
  }
  callback(new Error("手机号输入错误，请重新输入。"));
}
// 验证邮箱
function valiMailbox(rule, value, callback) {
  let success = validateEmail(value);
  if (success) {
    return callback();
  }
  callback(new Error("邮箱输入错误，请重新输入。"));
}
// 验证名字
function valiName(rule, value, callback) {
  let success = validateName(value);
  if (success) {
    return callback();
  }
  callback(new Error("必须为5~20字符。仅限小写字母和数字，必须小写字母开头。"));
}
let oldPasswordText = "";
// 验证旧密码
function valiPassword(rule, value, callback) {
  if (!oldPasswordText) {
    return callback();
  }
  callback(new Error("现在的密码不正确"));
}
// 验证新密码
function valiNewpassword1(rule, value, callback) {
  let success = validatePassword(value);
  if (success) {
    return callback();
  }
  callback(new Error("必须为8~20字符。包括字母和数字。"));
}
// 验证二输新密码
function valiNewpassword2(rule, value, callback) {
  if (value == formPassword.password) {
    return callback();
  }
  callback(new Error("两次密码输入不一致"));
}
// 验证短信验证码
let codeText = 1; //接口报错赋值
function valiCode(rule, value, callback) {
  if (!codeText) {
    return callback();
  }
  callback(new Error("请输入验证码"));
}
// 监听输入
function codeChange(e) {
  console.log("输入", e);
  codeText = e ? "" : 1;
}

// 表单内容
let form = reactive({});
const formName = reactive({
  username: "",
});
const formInformation = reactive({
  company: "",
});
const formPassword = reactive({
  oldPassword: "",
  password: "",
  newPassword2: "",
});
const formMailbox = reactive({
  email: "",
  smsCode: "",
});
const formPhone = reactive({
  phone: "",
  newPhone: "",
  newSmsCode: "",
  oldSmsCode: "",
});
// 验证码计时器
const sms = reactive({
  disabled: false,
  total: 60,
  count: 0,
  codeText: "发送验证码",
});
let timer = ""; //计时器
// 计时器处理器
const timerHandler = () => {
  sms.count = sms.total;
  sms.disabled = true;

  timer = setInterval(() => {
    if (sms.count > 1 && sms.count <= sms.total) {
      sms.codeText = sms.count + " 秒";
      sms.count--;
    } else {
      sms.codeText = "发送验证码";
      sms.disabled = false;
      clearInterval(timer);
    }
  }, 1000);
};
// 绑定表单
const ruleFormRef = ref(null);

watch(
  () => props.isDialog,
  (newValue) => {
    console.log("watch", newValue, ruleFormRef.value);
    if (newValue && props.dialogType == 7) {
      basicInfoIntervalId = setInterval(basicInfoFn, 3000);
    }
    if (timer) {
      clearInterval(timer);
      sms.codeText = "发送验证码";
      sms.disabled = false;
    }
    if (ruleFormRef.value) {
      console.log("1", newValue);
      ruleFormRef.value.resetFields();
    }
  }
);
let basicInfoIntervalId = ref();
// 查询基本信息接口
function basicInfoFn() {
  basicInfo().then((infoRes) => {
    mineStore.userInfo = infoRes.data;
    if (mineStore.userInfo.bindWeChat) {
      ElMessage({
        type: "success",
        message: "绑定成功！",
      });
      window.clearInterval(basicInfoIntervalId);
    }
  });
}
const stopBasicInfoFn = () => {
  window.clearInterval(basicInfoIntervalId);
};

// 二维码
const scanInfo = ref({});
const scanTimer = ref(null);
const expireQrCode = ref(false);
const refreshQrCode = () => {
  scanClick();
};
const scanClick = () => {
  expireQrCode.value = false;
  clearInterval(scanTimer.value);
  getQrCode()
    .then((res) => {
      scanInfo.value = res.data;
      scanTimer.value = setInterval(() => {
        scanInfo.value.expire_seconds -= 2;
        checkQrCode({ ticket: scanInfo.value.ticket })
          .then((check) => {
            console.log(check.data);
            // expireQrCode.value = true;
            clearInterval(scanTimer.value);
            basicInfoIntervalId;
          })
          .catch((checkErr) => {
            console.log(checkErr);
            if (checkErr.code == 400) {
              expireQrCode.value = true;
            }
          });
        if (scanInfo.value.expire_seconds <= 0) {
          expireQrCode.value = true;
          clearInterval(scanTimer.value);
        }
      }, 2000);
    })
    .catch((err) => {
      messageTip(1, err);
    });
};
defineExpose({
  stopBasicInfoFn,
});

watch(
  () => props.dialogType,
  (newValue) => {
    // console.log("WATCH", newValue);
    if (timer) {
      clearInterval(timer);
      sms.codeText = "发送验证码";
      sms.disabled = false;
    }

    const type = (dialogFrom.type = props.dialogType);
    dialogFrom.conterText = "";
    if (type == 1) {
      form = formName;
      form.username = props.info.username;
      dialogFrom.title = "修改用户名";
    }
    if (type == 2) {
      form = formInformation;
      form.company = props.info.company;

      dialogFrom.title = "编辑资料";
    }
    if (type == 3) {
      form = formPassword;
      dialogFrom.title = "修改密码";
    }
    if (type == 4) {
      form = formMailbox;
      dialogFrom.title = "绑定邮箱";
    }
    if (type == 5) {
      form = formMailbox;
      form.email = props.info.email;
      dialogFrom.title = "解绑邮箱";
    }
    if (type == 6) {
      dialogFrom.title = "解绑邮箱";
      dialogFrom.conterText = "确定要解除邮箱绑定？您可以随时重新绑定邮箱。";
    }
    if (type == 7) {
      dialogFrom.title = "绑定微信";
      scanClick();
    }
    if (type == 8) {
      dialogFrom.title = "解绑微信";
      dialogFrom.conterText = "确定要解除微信绑定？您可以随时重新绑定微信。";
    }
    if (type == 9) {
      form = reactive({
        phone: props.info.phone,
        newPhone: "",
        newSmsCode: "",
        oldSmsCode: "",
      });
      dialogFrom.title = "验证当前手机号";
    }
    if (type == 10) {
      form = formPhone;
      dialogFrom.title = "验证新手机号";
    }
    if (type == 11) {
      form = formPhone;
      dialogFrom.title = "绑定手机号";
    } if (type == 12) {
      form = formPassword;
      dialogFrom.title = "设置密码";
    }
  },
  {
    immediate: true,
  }
);

//获取验证码
function codeClick(type) {
  // type= 1绑定邮箱 2解绑邮箱 3当前手机号 4新绑定手机号
  console.log("codeClick", type);
  sms.codeText = "发送中......";
  sms.disabled = true;
  if (type == 1) {
    sendEmailCodeFn(11);
  }
  if (type == 2) {
    sendEmailCodeFn(11);
  }
  if (type == 3) {
    checkSendCodeFn();
  }
  if (type == 4) {
    sendCodeFn();
  }
}
// 获取手机验证码
// function sendCodeFn(type) {
//   console.log(1);
//   let params = {
//     type,
//     phone: type === 0 ? form.phone : type === 2 ? form.newPhone : "",
//   };

//   if (type === 0 && !form.phone) {
//     checkSendCodeFn();
//     return;
//   }

//   if (type === 2 && !form.newPhone) {
//     confirmDialog();
//     return;
//   }
// }
// 获取旧手机号验证码
function checkSendCodeFn() {
  let params = {
    type: 2,
  };
  checkSendCode(params)
    .then((res) => {
      if (res.code == 200) {
        timerHandler();
      }
      else {
        ElMessage({
          type: "error",
          message: res.message,
        });
        sms.codeText = "发送验证码";
        sms.disabled = false;
      }
    })
    .catch((err) => {
      sms.codeText = "发送验证码";
      sms.disabled = false;
      ElMessage({
        type: "error",
        message: err.message,
      });
    });
}
// 获取新手机号验证码
function sendCodeFn() {
  //type 0:短信验证登录,1:注册,2:绑定手机号,3:忘记密码
  let params = {
    phone: form.newPhone,
    type: 4,
  };
  sendCode(params)
    .then((res) => {
      if (res.code == 200) {
        timerHandler();
      }
      else {
        ElMessage({
          type: "error",
          message: res.message,
        });
        sms.codeText = "发送验证码";
        sms.disabled = false;
      }
    })
    .catch((err) => {
      sms.codeText = "发送验证码";
      sms.disabled = false;
      ElMessage({
        type: "error",
        message: err.message,
      });
    });
}

// 父组件传递信息
function infoClick(obj) {
  form.oldSmsCode = obj.oldSmsCode;
}
// 获取邮箱验证码
function sendEmailCodeFn(type) {
  if (!form.email) {
    confirmDialog();
    return;
  }
  let params = {
    email: form.email,
    type: type, // 11:绑定邮箱
  };

  sendEmailCode(params)
    .then((res) => {
      timerHandler();
    })
    .catch((err) => {
      sms.codeText = "发送验证码";
      sms.disabled = false;
      ElMessage({
        type: "error",
        message: err.message,
      });
    });
}

const emits = defineEmits(["confirmDialog", "closeDialog"]);
// 取消
function closeDialog(El) {
  emits("closeDialog");
  ruleFormRef.value.resetFields();
}
// 确定
function confirmDialog() {
  if (dialogFrom.type == 6) {
    unbindEmailFn(form);
    return;
  }
  if (dialogFrom.type == 7) {
    // 绑定微信接口
    // getQrCodeFn();
    return;
  }
  if (dialogFrom.type == 8) {
    // 解绑微信
    unbindWeChatFn(form);
    return;
  }
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      if (dialogFrom.type == 1) {
        updateUserNameFn(form);
      }
      if (dialogFrom.type == 2) {
        updateBasicInfoFn(form);
      }
      if (dialogFrom.type == 3) {
        updatePasswordFn(form);
      }
      if (dialogFrom.type == 4) {
        bindEmailFn(form);
      }
      // if (dialogFrom.type == 5) {
      //   // form.email = props.info.email;
      //   // form.smsCode = props.info.smsCode;
      //   // emits("confirmDialog", form);
      // }
      if (dialogFrom.type == 9) {
        // 校验验证码
        checkCodeFn(form);
        // emits("confirmDialog", form);
      }

      if (dialogFrom.type == 10) {
        form.oldSmsCode = props.info.oldSmsCode;
        changePhoneFn(form);
      }
      if (dialogFrom.type == 12) {
        let obj = {
          password: form.password
        }
        Passwordset(obj)
      }
    } else {
      console.log("error submit!", fields);
      // 表单校验不通过，进行相应处理
    }
  });
}
// 修改用户名
function updateUserNameFn(obj) {
  updateUserName(obj)
    .then((res) => {
      messageTip(1, res);
    })
    .catch((err) => {
      messageTip(1, err);
    });
}
//设置密码
function Passwordset(obj) {
  setPassword(obj).then((res) => {
    if (res.code == 200) {
      messageTip(1, res);
    } else {
      messageTip(1, err);
    }
  })
}
// 修改资料
function updateBasicInfoFn(obj) {
  updateBasicInfo(obj)
    .then((res) => {
      messageTip(1, res);
    })
    .catch((err) => {
      messageTip(1, err);
    });
}
// 修改密码
function updatePasswordFn(obj) {
  updatePassword(obj)
    .then((res) => {
      messageTip(1, res);
      if (res.code == 200) {
        setTimeout(() => {
          Cookies.remove("token", { domain: '.lyxhai.com', path: '/' })
          Cookies.remove("name", { domain: '.lyxhai.com', path: '/' })
          Cookies.remove("tokenHead", { domain: '.lyxhai.com', path: '/' })
          Cookies.remove('tokenInfo', { domain: '.lyxhai.com', path: '/' })
          mineStore.tokenInfo = {};
          router.push({ path: `/user/login` });
        }, 3000);
      }
    })
    .catch((err) => {
      if (err.message == "原始密码错误，无法修改！") {
        oldPasswordText = err.message;
        confirmDialog();
      } else {
        messageTip(1, err);
      }
    });
}
// 绑定邮箱
function bindEmailFn(obj) {
  bindEmail(obj)
    .then((res) => {
      messageTip(1, res);
    })
    .catch((err) => {
      if (err.message == "验证码错误！") {
        codeText = err.message;
        confirmDialog();
      } else {
        messageTip(1, err);
      }
    });
}
// 解绑邮箱
function unbindEmailFn() {
  unbindEmail()
    .then((res) => {
      messageTip(1, res);
    })
    .catch((err) => {
      messageTip(1, err);
    });
}
// 获取微信绑定二维码
function getQrCodeFn() {
  getQrCode()
    .then((res) => {
      console.log(res.data);
      // console.log(res.data);
      // messageTip(1, res);
    })
    .catch((err) => {
      messageTip(1, err);
    });
}
// 解绑微信
function unbindWeChatFn() {
  unbindWeChat()
    .then((res) => {
      messageTip(1, res);
    })
    .catch((err) => {
      messageTip(1, err);
    });
}
// 验证当前手机号验证码
function checkCodeFn(obj) {
  let params = {
    smsCode: obj.oldSmsCode,
    type: 2,
  };
  checkCode(params)
    .then((res) => {
      messageTip(1, res);
    })
    .catch((err) => {
      codeText = err.message;
      confirmDialog();
    });
}
// 更换手机号
function changePhoneFn(obj) {
  changePhone(obj)
    .then((res) => {
      messageTip(1, res);
    })
    .catch((err) => {
      messageTip(1, err);
    });
}
// 提示
function messageTip(type, res) {
  if (type == 2) {
    ElMessage({
      type: "warning",
      message: "不可操作",
    });
    return;
  }
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: res.message,
    });
    emits("confirmDialog", form);
  } else {
    ElMessage({
      type: "error",
      message: res.message,
    });
  }
}
</script>
<style lang="less" scoped>
.phone_text {
  width: 410px;
  height: 40px;
  background: #0b1320;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  margin-bottom: 10px;
  line-height: 40px;
  padding-left: 10px;
}

.dialog_title {
  font-size: 16px;
  line-height: 23px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  margin-bottom: 20px;
}

.conter_text {
  font-size: 16px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  line-height: 23px;
  margin-bottom: 15px;
}

.input_box {
  display: flex;
}

.code_btn {
  background: #1d222a;
  width: 120px;
  height: 40px;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 14px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  line-height: 40px;
  text-align: center;
  margin-left: 10px;
  flex-shrink: 0;
}

.dialog_footer {
  display: flex;
  justify-content: flex-end;
}

.close_btn {
  width: 80px;
  height: 36px;
  border-radius: 4px;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
}

.confirm_btn {
  width: 80px;
  height: 36px;
  background: #2156b3;
  border-radius: 4px;
  opacity: 1;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  line-height: 36px;
  text-align: center;
  margin-left: 20px;
  cursor: pointer;
}

.next_btn {
  cursor: pointer;
  width: 410px;
  height: 36px;
  background: #2156b3;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 36px;
  text-align: center;
}

.qrcode_con {
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin: 0 auto;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .qrcode_mask {
    position: absolute;
    width: 170px;
    height: 170px;
    background: #000000;
    opacity: 0.85;
    top: 15px;
    left: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .refresh_icon {
      width: 32px;
      height: 32px;
      display: block;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .text {
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.85);
    }
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.qrcode_tip {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}
</style>

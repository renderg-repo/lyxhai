<!-- 密码钥匙弹框 -->
<template>
  <el-dialog v-model="isDialog" :close-on-click-modal="true" width="550px" align-center :before-close="closeDialog"
    destroy-on-close>
    <template #header>
      <div class="dialog_title">
        {{
          dialogFrom.type == 1 && formName.type == 1
            ? dialogFrom.title
            : dialogFrom.type == 1 && formName.type == 2
              ? "导入钥匙对"
              : dialogFrom.type == 3 && formName.type == 1
                ? dialogFrom.title
                : ""
        }}
      </div>

      <!-- <div class="title_border"></div> -->
    </template>
    <!-- 中间内容 -->
    <!-- 创建密码钥匙对 -->
    <template v-if="dialogFrom.type == 1">
      <div style="margin-left: 30px">
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true"
          @submit.stop.prevent>
          <div class="conter_text_box">
            <template v-if="formName.type == 1">
              <img src="@/assets/images/ssh/warning_icon.png" alt="" />
              <div class="conter_text">
                创建完成后请一定下载私钥只有一次下载私钥的机会。
              </div>
            </template>
          </div>
          <el-form-item prop="name">
            <el-input input-style="color:#FFFFFF;" style="width: 450px; height: 40px" v-model="form.name"
              placeholder="密钥对名称">
            </el-input>
          </el-form-item>
          <div class="active_box">
            <div class="iconA" v-if="formName.type == 1">
              <div class="iconX"></div>
            </div>
            <div class="icon" style="margin-left: 0" v-else @click="typeClick(1)"></div>
            <div class="text" @click="typeClick(1)">创建密钥对</div>
            <div class="iconA" style="margin-left: 50px" v-if="formName.type == 2">
              <div class="iconX"></div>
            </div>
            <div class="icon" v-else @click="typeClick(2)"></div>
            <div class="text" @click="typeClick(2)">导入密钥对</div>
          </div>
          <el-form-item prop="key" v-if="formName.type == 2">
            <el-input input-style="color:#FFFFFF;" v-model="form.key" placeholder="请粘贴公钥"
              :autosize="{ minRows: 12, maxRows: 20 }" type="textarea">
            </el-input>
          </el-form-item>
          <div class="text_box" v-if="formName.type == 2" style="margin-right: 32px">
            <!-- <div class="text">Base64编码</div>
            <div class="text">导入样例</div> -->
          </div>
        </el-form>
      </div>
    </template>
    <!-- 导入密码钥匙对 -->
    <template v-if="dialogFrom.type == 2">
      <div style="margin: 0 20px">
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" :inline="true"
          @submit.stop.prevent>
          <div class="conter_text_box">
            <img src="@/assets/images/ssh/warning_icon.png" alt="" />
            <div class="conter_text">
              <!-- 创建完成后请一定下载私钥只有一次下载私钥的机会。 -->
            </div>
          </div>
          <div class="input_name">{{ form.name }}</div>
          <div class="active_box">
            <div class="iconA">
              <div class="iconX"></div>
            </div>
            <div class="text">创建密钥对</div>
            <div class="icon"></div>
            <div class="text">导入密钥对</div>
          </div>
          <div class="name_key">
            ssh-rsa
            AAAAB3NzaC1yc2EAAAADAQABAAABgQCwyUj/c8FmS+PKrp1+z6caIEWr3yFTHJndKXRU+U3zGYpV528f5/VdrQ1GQOCXv9cZmE2OEq/4NDE0bczm706HlXiWuI1xjB/a26+PaSFMXOCW0vmhWRuPe1mnjzCpcyAPyFz1iGLHef8eBgffWHDZuiFIdh+PvYvAbV9w0OPcOHC5lHnT8A3CWT6ADEHbwGBvp4YRifbrC05NLh/GzM5wxJvBNEUpfWDb8J/scw7vs3hesX0EX0iOiCiPa6QO5Xv+9t9jFJDF6sej10kz7Ndqmo5U8ifVsP+tt7aWIaNTjYGOnZkwWjbEpEOH5dA5ax/F2CF/mz43Tm5t2bGQcrf+esjiluktftKGBO62CsswaeTsAtJyuJuzw1lZ8dKJ30hR77RiRzERNigraYUmXrHcUxi71D8eqJ91Tmz/G6OoxAXu7h/rAOExpbLxUyG6tvU/6pi6Z1iV2rXcWYWYIwl6DhmH6E4jHOQ/mHtSf9P2vdc94dHX2v7xQY35ynJh8pU=
            user@ucloud.local
          </div>
          <div class="text_box">
            <!-- <div class="text">Base64编码</div>
            <div class="text">导入样例</div> -->
          </div>
        </el-form>
      </div>
    </template>
    <!-- 删除密码钥匙对 -->
    <template v-if="dialogFrom.type == 3">
      <div style="margin-left: 30px; margin-bottom: 12px">
        <div class="conter_text_box" style="justify-content: flex-start">
          <i class="icon hpc_basic_icon_info_circle f20 warning" style="color: #FF9000;"></i>
          <div class="conter_text" style="margin-bottom: 0">
            是否确认删除密钥：
            <span style="color: #2696ff">
              {{ props.names }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <slot name="insert"> </slot>
    <template #footer>
      <div class="dialog_footer">
        <div class="close_btn" v-if="dialogFrom.isClose" @click="closeDialog">
          {{ dialogFrom.closeText }}
        </div>
        <div class="confirm_btn" v-if="dialogFrom.isConfirm && !(dialogFrom.type == 3 && formName.type == 1)"
          @click="confirmDialog(ruleFormRef)">
          {{ dialogFrom.confirmText }}
        </div>
        <el-button type="primary" class="warningbtn"
          v-if="dialogFrom.isConfirm && (dialogFrom.type == 3 && formName.type == 1)"
          @click="confirmDialog(ruleFormRef)"> {{ dialogFrom.confirmText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { validateKeyname } from "@/utils/checkUtil";
import fileDownload from "js-file-download";
import {
  getSshKey,
  sshFile,
  sshSave,
  sshList,
  sshDel,
  enabled,
} from "@/api/ssh";
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
  names: {
    //删除名称
    type: String,
    default: () => "",
  },
});
const isDialog = computed({
  get() {
    return props.isDialog;
  },
  set(newValue) {
    props.isDialog = newValue;
  },
});

// 弹框配置
let dialogFrom = reactive({
  type: 0,
  title: "提示",
  isClose: true,
  closeText: "取消",
  isConfirm: true,
  confirmText: "确定",
  isRigthCloseX: false, //X按钮
});

// 绑定表单
const ruleFormRef = ref(null);
const radio1 = ref("1");

// 表单校验
// name: [{ validator: valiName, trigger: "blur" }],
const rules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  key: [{ required: true, message: "请输入密钥", trigger: "blur" }],
});
// 验证新密码
function valiName(rule, value, callback) {
  let success = validateKeyname(value);
  if (success) {
    return callback();
  }
  callback(new Error("请确保，输入长度为6~63位名称；只能包含中英文、数字。"));
}

// 表单内容
let form = reactive({ name: "" });
const formName = reactive({
  name: "",
  type: 1,
  key: "",
});

function typeClick(type) {
  formName.type = type;
}

watch(
  () => props.isDialog,
  (newValue) => {
    // console.log("watch", newValue, ruleFormRef.value);
    if (ruleFormRef.value) {

      ruleFormRef.value.resetFields();
    }
  }
);

watch(
  () => props.dialogType,
  (newValue) => {
    // console.log("WATCH", newValue);
    const type = (dialogFrom.type = props.dialogType);
    if (type == 1) {
      form = formName;
      dialogFrom.title = "创建密钥对";
    }
    if (type == 2) {
      form = formKeyName;
      dialogFrom.title = "创建密钥对";
    }
    if (type == 3) {
      dialogFrom.title = "删除密钥对";
    }
  },
  {
    immediate: true,
  }
);

const emits = defineEmits(["confirmDialog", "closeDialog"]);
// 取消
function closeDialog() {
  emits("closeDialog");
}
// 确定
function confirmDialog(El) {
  if (dialogFrom.type == 3) {
    // 删除接口
    emits("confirmDialog", form);
    return;
  }
  El.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      if (dialogFrom.type == 1) {
        let publicKey = "";
        if (formName.type != 1) {
          publicKey = formName.key;
        }
        sshSave({
          content: publicKey,
          title: form.name,
          type: formName.type == 1 ? "0" : "1",
        })
          .then((res) => {
            if (formName.type == 1) {
              fileDownload(res.data, "private_key.pem");
            }
            form.success = true;
            emits("confirmDialog", form);
          })
          .catch((err) => {
            console.log(err);
            ElMessage({
              message: `${error.message}`,
              type: "error",
            });
          });
      }
      // El.resetFields();
    } else {
      console.log("error submit!", fields);
      // 表单校验不通过，进行相应处理
    }
  });
}
</script>
<style lang="less" scoped>
.input_name {
  width: 450px;
  height: 40px;
  background: #0b1320;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #2696ff;
  margin-bottom: 20px;
}

.name_key {
  width: 450px;
  // height: 300px;
  background: #0b1320;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  font-size: 12px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
  line-height: 17px;
  padding: 10px 20px 63px;
  word-break: break-all;
  overflow: hidden;
  white-space: pre-wrap;
  margin-bottom: 4px;
  box-sizing: border-box;
}

.text_box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
    height: 22px;
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    line-height: 22px;
  }
}

.dialog_title {
  font-size: 16px;
  // line-height: 37px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
}

.title_border {
  margin-top: 15px;
  border-bottom: 1px solid #26303e;
}

.conter_text_box {
  display: flex;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }
}

.conter_text {
  margin-left: 10px;
  font-size: 16px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  line-height: 20px;
  margin-bottom: 28px;
}

.active_box {
  display: flex;
  margin-bottom: 20px;

  .iconA {
    width: 16px;
    height: 16px;
    border-radius: 40px 40px 40px 40px;
    opacity: 1;
    border: 2px solid #2696ff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;

    .iconX {
      width: 8px;
      height: 8px;
      background: #2696ff;
      opacity: 1;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .icon {
    margin-left: 50px;
    margin-right: 10px;
    width: 16px;
    height: 16px;
    border-radius: 40px 40px 40px 40px;
    opacity: 1;
    border: 2px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
  }

  .text {
    height: 22px;
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    line-height: 20px;
    cursor: pointer;
  }
}

.input_box {
  display: flex;
}

.code_btn {
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
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

.close_btn {
  width: 120px;
  height: 36px;
  background: #26303e;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 36px;
  text-align: center;
  cursor: pointer;
}

.warningbtn {
  width: 120px;
  height: 36px;
  margin-left: 30px;
}

.confirm_btn {
  width: 120px;
  height: 36px;
  background: #2156b3;
  border-radius: 4px;
  opacity: 1;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 36px;
  margin-left: 30px;
  text-align: center;
  cursor: pointer;
}

.next_btn {
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
  cursor: pointer;
}
</style>

<template>
  <div class="ssh">
    <div class="ssh_con">
      <div class="top select_none">
        <div class="title">连接SSH管理节点</div>
        <div class="reset" @click="resetClick">
          <img
            src="@/assets/images/ssh/repeat.png"
            alt=""
            class="repeat_icon"
          />
          <div>重置SSH连接密码</div>
        </div>
      </div>
      <div class="list">
        <div class="item">
          <div class="item_con">
            <div class="title">SSH连接信息</div>
            <div class="item_bottom">
              <div class="left">
                <div class="desc">
                  ssh {{ sshKeyInfo.username }}@{{ sshKeyInfo.sshConHost }}
                  <!-- ssh@ssh.spacehpc.com -->
                  <!-- SSH {{ sshKeyInfo.username }}@{{ sshKeyInfo.hostname }} -->
                </div>
                <img
                  src="@/assets/images/ssh/copy.png"
                  alt=""
                  class="copy_icon"
                  @click="
                    copyClick(
                      `ssh ${sshKeyInfo.username}@${sshKeyInfo.sshConHost}`
                    )
                  "
                />
              </div>
              <div class="right">
                <div class="code">
                  {{ showPass1 ? sshKeyInfo.password : "**********" }}
                </div>
                <img
                  src="@/assets/images/ssh/copy.png"
                  alt=""
                  class="copy_icon"
                  @click="copyClick(sshKeyInfo.password)"
                />
                <img
                  src="@/assets/images/ssh/pass.png"
                  alt=""
                  class="pass_icon"
                  v-show="showPass1"
                  @click="showPass1 = false"
                />
                <img
                  src="@/assets/images/ssh/not_pass.png"
                  alt=""
                  class="pass_icon"
                  v-show="!showPass1"
                  @click="showPass1 = true"
                />
              </div>
            </div>
          </div>
          <el-button class="btn" style="opacity: 0; cursor: default"
            >立即连接</el-button
          >
        </div>
        <div class="item">
          <div class="item_con">
            <div class="title">Web SSH连接</div>
            <div class="item_bottom">
              <div class="left">
                <div class="desc">通过网页远程控制节点</div>
              </div>
              <div class="right">
                <div class="code"></div>
              </div>
            </div>
          </div>
          <el-button class="btn" @click="connectNowClick">
            <template #default>
              <img
                src="@/assets/images/ssh/desktop.png"
                alt=""
                class="desktop_icon"
              />
              立即连接
            </template>
          </el-button>
        </div>
        <div class="item">
          <div class="item_con">
            <div class="title">XShell连接</div>
            <div class="item_bottom">
              <div class="left">
                <div class="desc">
                  XShell用户，可查看和复制密码，下载连接文件登录。
                </div>
              </div>
              <div class="right">
                <div class="code">
                  {{ showPass2 ? sshKeyInfo.password : "**********" }}
                </div>
                <img
                  src="@/assets/images/ssh/copy.png"
                  alt=""
                  class="copy_icon"
                  @click="copyClick(sshKeyInfo.password)"
                />
                <img
                  src="@/assets/images/ssh/pass.png"
                  alt=""
                  class="pass_icon"
                  v-show="showPass2"
                  @click="showPass2 = false"
                />
                <img
                  src="@/assets/images/ssh/not_pass.png"
                  alt=""
                  class="pass_icon"
                  v-show="!showPass2"
                  @click="showPass2 = true"
                />
              </div>
            </div>
          </div>
          <el-button class="btn" @click="downSshFile('xshell')">
            <template #default>
              <img
                src="@/assets/images/ssh/download.png"
                alt=""
                class="download_icon"
              />
              <!-- <img
                src="@/assets/images/ssh/download_hover.png"
                alt=""
                class="download_hover"
              /> -->
              连接文件
            </template>
          </el-button>
        </div>
        <div class="item">
          <div class="item_con">
            <div class="title">MobaXteam连接</div>
            <div class="item_bottom">
              <div class="left">
                <div class="desc">
                  MobaXteam用户，可查看和复制密码，下载连接文件登录。
                </div>
              </div>
              <div class="right">
                <div class="code">
                  {{ showPass3 ? sshKeyInfo.password : "**********" }}
                </div>
                <img
                  src="@/assets/images/ssh/copy.png"
                  alt=""
                  class="copy_icon"
                  @click="copyClick(sshKeyInfo.password)"
                />
                <img
                  src="@/assets/images/ssh/pass.png"
                  alt=""
                  class="pass_icon"
                  v-show="showPass3"
                  @click="showPass3 = false"
                />
                <img
                  src="@/assets/images/ssh/not_pass.png"
                  alt=""
                  class="pass_icon"
                  v-show="!showPass3"
                  @click="showPass3 = true"
                />
              </div>
            </div>
          </div>
          <el-button class="btn" @click="downSshFile('moba')">
            <template #default>
              <img
                src="@/assets/images/ssh/download.png"
                alt=""
                class="download_icon"
              />
              <!-- <img
                src="@/assets/images/ssh/download_hover.png"
                alt=""
                class="download_hover"
              /> -->
              连接文件
            </template>
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="isDialog"
      :close-on-click-modal="true"
      width="400px"
      align-center
      :before-close="closeDialog"
      destroy-on-close
    >
      <template #header>
        <div class="dialog_title">重置SSH连接密码</div>
      </template>
      <div style="display: flex; justify-content: center">
        <div class="conter_text_box" style="justify-content: flex-start">
          <img src="@/assets/images/ssh/warning_icon.png" alt="" />
          <div class="conter_text" style="margin-bottom: 0">
            新的SSH登录密码，由系统随机生成！
            <!-- <span style="color: #2696ff">
             {{ props.names }} 
            </span> -->
          </div>
        </div>
      </div>
      <slot name="insert"> </slot>
      <template #footer>
        <div class="dialog_footer">
          <div class="close_btn" @click="closeDialog">取消</div>
          <div
            class="confirm_btn"
            type="primary"
            @click="confirmDialog(ruleFormRef)"
          >
            确定
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getSshKey, sshFile, resetSshPassword } from "@/api/ssh";
import { ElMessage } from "element-plus";
import clipboard3 from "vue-clipboard3";

const sshKeyInfo = ref({});
const getSshKeyData = () => {
  getSshKey().then((res) => {
    console.log(res.data);
    sshKeyInfo.value = res.data;
  });
};
getSshKeyData();

const copyClick = async (text) => {
  const { toClipboard } = clipboard3();
  try {
    await toClipboard(text);
    ElMessage({
      message: `复制成功`,
      type: "success",
    });
  } catch (error) {
    ElMessage({
      message: `复制失败`,
      type: "error",
    });
  }
};

const showPass1 = ref(false);
const showPass2 = ref(false);
const showPass3 = ref(false);

const isDialog = ref(false);
// 取消
function closeDialog() {
  isDialog.value = false;
}
// 确定
function confirmDialog() {
  resetSshPassword().then((res) => {
    getSshKeyData();
    ElMessage({
      message: `重置成功`,
      type: "success",
    });
    closeDialog();
  });
}

const resetClick = () => {
  isDialog.value = true;
};

const connectNowClick = () => {
  window.open(`${location.origin}/system/managedNode`, "_blank");
};

const downSshFile = (name) => {
  sshFile({ type: name }).then((res) => {
    console.log(res.data);
    const blob = new Blob([res.data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `集群节点文件.${name == "xshell" ? "xsh" : "moba"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};
</script>

<style lang="less" scoped>
@import '../../assets/css/sshManage.less';
</style>

<style lang="less" scoped>
:deep(.el-textarea__inner) {
  background: #0b1320;
  box-shadow: 0 0 0 1px #0b1320;
}

:deep(.el-switch__core) {
  background: rgba(255, 255, 255, 0.15);
  border: 0px;
  width: 21px;
  height: 12px;
}

:deep(.el-checkbox__inner) {
  background: #26303e !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: #26303e !important;

  // color: #2696ff !important;
  .el-checkbox__inner {
    border: 1px solid #2696ff !important;
  }
}

:deep(.el-table) {
  --el-table-border-color: none;
}

:deep(.el-table__cell) {
  border-bottom: 1px solid #26303e !important;
}
:deep(.el-switch__core) {
  background: rgba(255, 255, 255, 0.15);
  border: 0px;
  width: 21px;
  height: 12px;
}

:deep(.el-checkbox__inner) {
  background: #26303e !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: #26303e !important;

  // color: #2696ff !important;
  .el-checkbox__inner {
    border: 1px solid #2696ff !important;
  }
}

:deep(.el-table) {
  --el-table-border-color: none;
}

:deep(.el-table__cell) {
  border-bottom: 1px solid #26303e !important;
}

:deep(.el-dialog) {
  --el-bg-color: #1d222a !important;
  --el-dialog-bg-color: #1d222a !important;
  width: 400px;
  // height: 175px;
  background: #1d222a !important;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
}

// 改

:deep(.el-dialog) {
  --el-bg-color: #1d222a !important;
  --el-dialog-bg-color: #1d222a !important;
  width: 400px;
  // height: 175px;
  background: #1d222a !important;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
}

:deep(.el-dialog__header) {
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #26303e;
  margin: 0;
  margin-bottom: 30px;
}

:deep(.el-dialog__headerbtn) {
  top: 2px;
}

:deep(.el-dialog__body) {
  padding: 0px 20px 0;
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
  border-radius: 4px 4px 4px 4px;
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
  padding-top: 2px;
}
</style>

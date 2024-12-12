<template>
  <div class="managedNode">
    <div class="top">
      <div class="left">
        <template v-for="(item, index) in list" :key="item.id">
          <div
            class="item"
            :class="[currentTab == item.id ? 'active' : '']"
            @click="itemClick(item.id)"
          >
            <div class="title">
              {{ sshKeyInfo.username }}@{{ sshKeyInfo.websshHost }}
            </div>
            <img
              src="@/assets/images/ssh/close.png"
              alt=""
              class="close_icon"
              @click.stop="closeClick(index)"
            />
          </div>
        </template>
        <img src="@/assets/images/ssh/hr.png" alt="" class="hr" />
        <img
          src="@/assets/images/ssh/add.png"
          alt=""
          class="add_icon"
          @click="addNodeClick"
        />
      </div>
      <div class="right">
        <img
          src="@/assets/images/ssh/transfer.png"
          alt=""
          class="icon"
          @mouseenter="hoverTransferIcon = true"
          v-show="!hoverTransferIcon"
        />
        <img
          src="@/assets/images/ssh/transfer_hover.png"
          alt=""
          class="icon"
          @mouseleave="hoverTransferIcon = false"
          @click="transferClick"
          v-show="hoverTransferIcon"
        />
        <img
          src="@/assets/images/ssh/help.png"
          alt=""
          class="icon"
          @mouseenter="hoverHelpIcon = true"
          v-show="!hoverHelpIcon"
        />
        <img
          src="@/assets/images/ssh/help_hover.png"
          alt=""
          class="icon"
          @mouseleave="hoverHelpIcon = false"
          @click="helpClick"
          v-show="hoverHelpIcon"
        />
        <img
          src="@/assets/images/ssh/full_screen.png"
          alt=""
          class="icon"
          @mouseenter="hoverFullScreenIcon = true"
          v-show="!hoverFullScreenIcon"
        />
        <img
          src="@/assets/images/ssh/full_screen_hover.png"
          alt=""
          class="icon"
          @mouseleave="hoverFullScreenIcon = false"
          @click="fullScreenClick"
          v-show="hoverFullScreenIcon"
        />
        <img
          src="@/assets/images/ssh/big_close.png"
          alt=""
          class="icon"
          @mouseenter="hoverBigCloseIcon = true"
          v-show="!hoverBigCloseIcon"
        />
        <img
          src="@/assets/images/ssh/big_close_hover.png"
          alt=""
          class="icon"
          @mouseleave="hoverBigCloseIcon = false"
          @click="bigCloseClick"
          v-show="hoverBigCloseIcon"
        />
      </div>
    </div>
    <div class="iframe_con">
      <div
        class="iframe_item"
        v-for="(item, index) in list"
        :key="item.id"
        v-show="currentTab == item.id">
        <iframe
          :src="item.url"
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
    <el-dialog
      v-model="isDialog"
      :close-on-click-modal="true"
      width="400px"
      align-center
      :before-close="closeDialog"
      destroy-on-close
      custom-class="no-header-dialog"
    >
      <div style="display: flex; justify-content: center">
        <div class="conter_text_box" style="justify-content: flex-start">
          <div class="conter_text" style="margin-bottom: 0">
            是否关闭所有标签页？
          </div>
        </div>
      </div>
      <slot name="insert"> </slot>
      <template #footer>
        <div class="dialog_footer">
          <div class="close_btn" @click="closeDialog">取消</div>
          <div class="confirm_btn" type="primary" @click="confirmDialog">
            确定
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Base64 } from "js-base64";
import { getSshKey, sshFile, resetSshPassword } from "@/api/ssh";
import { generateUUID } from "@/utils/tools";
import { onBeforeUnmount, onMounted } from "vue";
const hoverTransferIcon = ref(false);
const hoverHelpIcon = ref(false);
const hoverFullScreenIcon = ref(false);
const hoverBigCloseIcon = ref(false);
const transferClick = () => {
  temporarilyClick();
};
const helpClick = () => {
  temporarilyClick();
};

const temporarilyClick = () => {
  ElMessage({
    message: `功能开发中`,
    type: "warning",
  });
};

const isFullscreen = ref(false);
const fullScreenClick = () => {
  if (!isFullscreen.value) {
    // 进入全屏
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  isFullscreen.value = !isFullscreen.value;
};
const isDialog = ref(false);
const bigCloseClick = () => {
  isDialog.value = true;
};
// 取消
function closeDialog() {
  isDialog.value = false;
}
// 确定
function confirmDialog() {
  window.close();
}

const currentTab = ref(null);
const list = ref([]);
const sshKeyInfo = ref({});
const getSshKeyData = () => {
  getSshKey().then((res) => {
    let id = generateUUID();
    list.value.push({
      id,
      url: `https://v.spacehpc.com/webssh/?hostname=${
        res.data.websshHost
      }&username=${res.data.username}&password=${Base64.encode(
        res.data.password
      )}`,
    });
    currentTab.value = id;
    sshKeyInfo.value = res.data;
  });
};
getSshKeyData();

const itemClick = (id) => {
  currentTab.value = id;
  console.log(currentTab.value);
};
const closeClick = (index) => {
  list.value.splice(index, 1);
  if (list.value.length >= 1) {
    itemClick(list.value[list.value.length - 1].id);
  } else if (!list.value.length) {
    window.close();
  }
};
const addNodeClick = () => {
  let id = generateUUID();
  list.value.push({
    id,
    url: `https://v.spacehpc.com/webssh/?hostname=${
      sshKeyInfo.value.websshHost
    }&username=${sshKeyInfo.value.username}&password=${Base64.encode(
      sshKeyInfo.value.password
    )}`,
  });
  currentTab.value = id;
};
const handleIfMessage = event => {
  console.log(event)
  window.close();
}

onMounted(async ()=> {
  window.addEventListener("message", handleIfMessage);
});
onBeforeUnmount(()=> {
  window.removeEventListener("message");
})
</script>

<style lang="less" scoped>
.managedNode {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    height: 48px;
    background: #1d222a;
    display: flex;
    align-items: end;
    justify-content: space-between;
    padding: 0 20px;
    .left {
      display: flex;
      align-items: center;
      .active {
        background: #12161b !important;
        border-radius: 8px 8px 0px 0px;
        overflow: hidden;
        .title {
          color: #fff !important;
        }
      }
      .item {
        display: flex;
        align-items: center;
        background: #1d222a;
        padding: 0 10px;
        margin-right: 5px;
        height: 38px;
        cursor: pointer;
        &:hover {
          background: #12161b !important;
          border-radius: 8px 8px 0px 0px;
          overflow: hidden;
          .title {
            color: #fff !important;
          }
        }
        .title {
          width: 200px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .close_icon {
          width: 22px;
          height: 22px;
          display: block;
          cursor: pointer;
          margin-left: 6px;
        }
      }
      .hr {
        width: 1px;
        height: 12px;
        display: block;
      }
      .add_icon {
        width: 22px;
        height: 22px;
        display: block;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .right {
      display: flex;
      align-items: center;
      height: 100%;
      .icon {
        display: block;
        width: 24px;
        height: 24px;
        margin-left: 40px;
        cursor: pointer;
      }
    }
  }
  .iframe_con {
    flex: 1;
    .iframe_item {
      height: 100%;
    }
  }
}
.dialog_title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
}

.conter_text_box {
  display: flex;
  justify-content: center;
  padding-top: 50px;
  padding-bottom: 20px;

  img {
    width: 20px;
    height: 20px;
  }
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
.conter_text {
  margin-left: 10px;
  font-size: 16px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  line-height: 20px;
  margin-bottom: 28px;
}
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
  --el-input-placeholder-color: rgba(0, 0, 0, 0.3);
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

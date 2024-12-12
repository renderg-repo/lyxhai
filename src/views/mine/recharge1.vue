<template>
  <div class="container recharge flex-column flex-1">
    <div class="title">充值中心</div>
    <div class="account">
      <div class="img_div">
        <img class="img" src="@/assets/images/recharge/balance.svg" alt="" />
      </div>
      <div class="balance">
        <div style="line-height: 17px; margin-bottom: 10px;margin-top: 40px;height: 18px" class="lh22">账户余额：</div>
        <div class="num_div">
          <div style="color: #2696ff">￥ </div>
          <div class="num"> {{ accountInfo.balance }} </div>
        </div>
        <div class="flex space-between lh22" style="margin-top: 6px;">
          <div>
            支付券：
            <span style="color: #2696ff">
              <span>￥</span>
              {{ accountInfo.currentCouponsAmount }}
            </span>
          </div>
          <div class="flex">
            <div style="margin-right: 20px">
              邀请码: {{ accountInfo.inviteCode }}
            </div>
            <div class="linkbtn" @click="share()">邀请链接</div>
          </div>
        </div>
        <div class="linkbtn" style="
            text-align: right;
            position: relative;
            right: 0px;
            top: 63px;
            height: 19px;
            z-index: 1;
          ">
          <span class="linkbtn" v-show="activeName == 'inviterecord'" @click="godocumentation()">帮助文档</span>
        </div>
      </div>
    </div>
    <!-- tab pane -->
    <el-tabs v-model="activeName" class="tabs flex-1 flex-column" @tab-click="handleClick">
      <el-tab-pane label="线上充值" name="online">
        <OnLine ></OnLine>
      </el-tab-pane>
      <el-tab-pane label="线下汇款" name="offline"></el-tab-pane>
      <el-tab-pane label="支付券" name="voucher"></el-tab-pane>
      <el-tab-pane label="收支记录" name="rechargeList"></el-tab-pane>
      <el-tab-pane label="优惠券" name="coupons"></el-tab-pane>
      <el-tab-pane label="邀请记录" name="inviterecord"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import OnLine from './component/online.vue'
import { getAccount } from "@/api/recharge"

// 账户信息
const accountInfo = ref({
  balance: 0,
  inviteCode: 0,
  currentCouponsAmount: 0,
})

// 获取个人信息
function getAccountInfo() {
  getAccount().then((acinfo) => {
    console.log('acinfo', acinfo)
    if (acinfo.code == 200) {
      accountInfo.value = acinfo.data;
      sessionStorage.setItem('verifyStatus', acinfo.data.verifyStatus)
      // verifyStatus.value = acinfo.data.verifyStatus
    } else {
      ElMessage({
        message: `信息获取失败`,
        type: "error",
      })
    }
    
  });
}
getAccountInfo()

// 复制分享链接
function share() {
  // 获取基础 URL
  const baseUrl = window.location.origin;
  const inviteCode = encodeURIComponent(accountInfo.value.inviteCode); // 编码 osName 以确保 URL 的正确性
  const shareLink = `${baseUrl}/user/register?inviteCode=${inviteCode}`;

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

// 跳转至帮助文档
function godocumentation() {
  window.open(
    "https://help.spacehpc.com/document/activities/invitation_rewards_program/invitation_rewards_program.html"
  );
}

// tab切换
const activeName = ref('online')


</script>

<style lang="less" scoped>
@import '../../assets/css/recharge.less';
</style>
<style lang="less" scoped>
// element 样式修改
:deep(.tabs) {

  // tabs切换栏样式修改
  .el-tabs__header {
    margin-bottom: 0;
  }

  .el-tabs__item {
    margin-right: 30px;
  }

  .el-tabs__active-bar {
    width: 86px !important;
    height: 1px;
    background: rgba(38, 150, 255, 1);
  }

  .el-tabs__nav-wrap::after {
    height: 1px;
    background: #26303e;
  }

  .el-tabs__item {
    padding: 0;
    width: 86px;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
  }

  .is-active {
    color: rgba(38, 150, 255, 1);
  }

  // tabs切换栏样式修改 end
  // 线上充值样式修改
  .online {
    margin: 50px 0;

    .el-form-item {
      align-items: center;
      margin-bottom: 0px
    }

    .el-form-item__label {
      color: rgba(255, 255, 255, 0.6);
      justify-content: flex-start;
    }

    .amount {
      .el-radio-group .el-radio {
        display: flex;
        position: relative;
        width: 240px;
        height: 80px;
        margin-right: 10px;

        .el-radio__input {
          position: absolute;
          top: 21px;
          right: 19px;
        }
      }
    }

    // 单选框样式
    .el-radio__input {
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 40px 40px 40px 40px;
    }

    .el-radio__input.is-checked {
      border: 2px solid #2696ff !important;
      border-radius: 50%;
    }

    .el-radio__inner::after {
      width: 8px;
      height: 8px;
      background-color: #2696ff;
    }

    .el-radio.is-bordered.el-radio--large {
      border-color: rgba(11, 19, 32, 1);
      background-color: rgba(11, 19, 32, 1);
    }

    .el-radio.is-bordered.is-checked {
      border: 1px solid #2696ff !important;
      border-radius: 8px 8px 8px 8px;
    }

    .el-radio__input.is-checked .el-radio__inner {
      border-color: #0b1320;
      background: #0b1320;
    }

    // 单选框样式 end
  }

  // 线上充值样式修改 end
}

// element 样式修改 end
:deep(.el-dialog__body) {
  padding: 0px;
}
</style>

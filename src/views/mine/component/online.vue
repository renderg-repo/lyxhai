<template>
  <div class="online">
    <el-form label-width="90px" ref="rechargeForm" :model="rechargeFormData">
      <el-form-item label="充值金额：" class="amount">
        <el-radio-group v-model="radio1" @change="radio1change">
          <el-radio :label="100" size="large" border>
            ￥<span class="num">100</span>
          </el-radio>
          <el-radio :label="200" size="large" border>
            ￥<span class="num">200</span>
          </el-radio>
          <el-radio :label="500" size="large" border>
            ￥<span class="num">500</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-col :span="6" class="other">
        <el-form-item label="其他金额：" prop="amount" style="margin-top: 50px;">
          <el-input 
            v-model="otheramount" 
            type="text" 
            placeholder="请输入充值金额" 
            class="amountinput"
            :class="showtip ? 'is-error' : ''" autocomplete="off" 
            @input="amountChange" 
            @blur="amountblur"
            @click="amountclick" />
        </el-form-item>
        <div class="tip"><span v-if="showtip">最低至少充值1.0元</span></div>
      </el-col>
      <el-form-item label="支付方式：" class="payway">
        <el-radio-group v-model="rechargeFormData.rechargetype">
          <el-radio :label="1" size="large">
            <img class="img" src="@/assets/images/recharge/alipay.svg" alt="" />
          </el-radio>
          <el-radio :label="2" size="large">
            <img class="img" src="@/assets/images/recharge/wxpay.svg" alt="" />
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-col :span="5">
          <el-button class="primarybtn" type="primary" @click="submitRecharge">立即充值</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <!-- 充值弹窗 -->
    <el-dialog 
      class="dialog" 
      v-model="payDialog" 
      title="微信支付" 
      width="450"
      style="width: 450px; height: 309px; background: #1d222a" 
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="stopPolling">

      <div v-if="!paySuccess">
        <div class="wxpay">
          <div class="qr">
            <div class="code">
              <QRCodeVue3 
                :width="150" 
                :height="150" 
                v-if="orderData?.url" 
                :value="orderData?.url"
                :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' }"
                :imageOptions="{ hideBackgroundDots: true, imageSize: 0.5, margin: 5 }" 
                margin="0"
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
                }" 
                :cornersSquareOptions="{ type: 'square', color: '#000', }"
                :cornersDotOptions="{ type: 'square', color: '#000', }" />
              <!-- <qrcode-vue v-if="orderData?.url" :value="orderData?.url" :size="150" level="H">
              </qrcode-vue> -->.
              <!-- <Vue3NextQrcode text="hello vue3 next qrcode" /> -->
            </div>
          </div>
          <p>请使用微信支付扫码付款</p>
        </div>
      </div>

      <div class="paySuccess" v-else>
        <el-icon class="icon">
          <SuccessFilled />
        </el-icon>
        <!-- <img src="@/assets/images/recharge/pay_success.png" alt=""> -->
        <p class="text">支付成功！</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { recharge } from '@/api/recharge'
import QRCodeVue3 from "qrcode-vue3"

const rechargeFormData = reactive({
  amount: 100,
  rechargetype: 1,
})
const radio1 = ref(100)
const otheramount = ref(null)
const showtip = ref(false)
const paySuccess = ref(false)
let payDialog = ref(false)
let orderData = ref({})
const verifyStatus = sessionStorage.getItem('verifyStatus')
const logoImg = ref("")

// 充值金额切换
function radio1change() {
  rechargeFormData.amount = radio1
  showtip.value = false;
  otheramount.value = null
}

function amountblur(val) {
  if (rechargeFormData.amount >= 1) {
    showtip.value = false;
  }
}
function amountclick() {
  radio1.value = 0;
}
function amountChange(value) {
  // 先将输入的值进行处理
  let sanitizedValue = value.replace(/[^0-9.]/g, '');
  rechargeFormData.amount = sanitizedValue;
  // 然后再检查新的值是否符合条件
  if (rechargeFormData.amount >= 1) {
    showtip.value = false;
  } else {
    showtip.value = true;
  }
}

// 微信支付
let intervalWxpay;
function startPolling() {
  intervalWxpay = setInterval(() => {
    getStatus(orderData.rechargeNo);
  }, 5000);
}
function stopPolling() {
  console.log(intervalWxpay);
  clearInterval(intervalWxpay);
}

// 立即充值按钮
async function submitRecharge() {
  if (rechargeFormData.amount == "") {
    ElMessage({
      message: "请填写充值金额",
      type: "error",
    });
    return;
  }
  if (rechargeFormData.amount < 1) {
    ElMessage({
      message: "最低至少充值1.0元",
      type: "error",
    });
    return
  }
  if (verifyStatus == 1) {
    try {
      console.log('rechargeFormData', rechargeFormData)
      const res = await recharge(rechargeFormData);
      if (res.code == 200) {
        orderData = res.data;
        nextTick().then(() => {
          logoImg.value = '../../assets/images/recharge/success.png';
        });
        if (rechargeFormData.rechargetype == 1) {
          // window.location.href = res.data.url;
          window.open(res.data.url);
        } else {
          paySuccess.value = false;
          payDialog.value = true;
          startPolling();
        }
      } else {
        ElMessage({
          message: res.message,
          type: "warning",
        });
      }
    } catch (err) {
      ElMessage({
        message: err.message,
        type: "error",
      });
    }
  } else {
    ElMessage({
      message: "请先进行实名认证",
      type: "error",
    });
  }
}
</script>

<template>
<div class="register flex-align-center flex-center">
  <div class="register-img-box flex-align-center" v-if="screenWidth > 860">
    <img class="mr30" src="../../assets/image/public/gift.svg" alt="">
    <div class="gift-shu mr30"></div>
  </div>
  <div class="register-gift-box" v-if="screenWidth > 660">
    <p class="gift-active semibold-text">新用户赠送50元大礼包</p>
    <p class="gift-desc normal-text">满减券+首充福利+联系客服专享</p>
  </div>
  <div class="register-input flex">
    <el-input placeholder="输入手机号" type="text" v-model.number="phone" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" class="input-with-select" @keyup.enter.native="registerClick" clearable @clear="setRegisterPhone(null)">
      <div class="input-append" slot="append" type="success" @click="registerClick">立即注册</div>
    </el-input>
  </div>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  data() {
    return {
      phone: null
    }
  },
  computed: {
    ...mapGetters(["screenWidth"]),
  },
  watch: {
    phone(newVal) {
      if (newVal) {
        this.setRegisterPhone(newVal)
      }
    }
  },
  methods: {
    ...mapActions(['setRegisterPhone']),
    // 立即注册
    registerClick() {
      if (this.phone) {
        let url = `${this.$config.basicUrl}/user/register?phone=${this.phone}`
        window.open(url, '_blank');
      } else {
        window.open(`${this.$config.basicUrl}/user/register`, '_blank');
      }
    }
  },
}
</script>

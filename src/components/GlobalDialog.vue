<template>
  <el-dialog class='GlobalDialog' v-model="visible" :title="dialogdata.dialogTitle" :show-close="false"
    :style="`width: ${dialogwidth};  padding: 15px 20px !important;`">
    <div v-if="dialogdata.type == 'img'" class="imgbox">
      <div class="box"><img :src="dialogdata.bodyContent" :width="dialogdata.width" alt=""></div>
      <div class="text-center">{{ dialogdata.footerContent }}</div>
    </div>
    <div v-if="dialogdata.type == 'txt'">
      <div class="bodyContent">{{ dialogdata.bodyContent }}</div>
    </div>
    <div v-if="dialogdata.type == 'html'">
      <div class="bodyContent" v-html="dialogdata.bodyContent"></div>
    </div>
    <span slot="footer" v-if="false" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="confirmDialog">确定</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { inject, watch } from "vue";
import { getdialog } from '@/api/Global'
const globalDialog = inject("globalDialog");
import { useMineStore } from "@/store/mine";
const bodyContent = '<el-button @click="closeDialog">取消</el-button>'
const mineStore = useMineStore();
// console.log("Injected globalDialog:", globalDialog); // 调试信息
const dialogwidth = '450px'
const dialogbackground = 'rebeccapurple'
const visible = globalDialog.visible;
const dialogtitle = '全局弹窗'
watch(visible, (newVal) => {
  // console.log("Dialog visibility changed:", newVal); // 调试信息
});
const dialogdata = ref({})

// 监听具体的属性
watch(() => mineStore.dialogytype, (newVal) => {
  getdialogdata()
});
const getdialogdata = () => {
  let id = {
    id: 1
  }
  getdialog(id).then(res => {
    dialogdata.value = res
  })
}


const closeDialog = () => {
  globalDialog.closeDialog();
};

const confirmDialog = () => {
  globalDialog.confirmDialog();
};
</script>

<style lang="less" scoped>
.imgbox {
  display: flex;
  justify-content: center;
  margin-top: 4px;
  flex-flow: column;

  .box {
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 15px;
    opacity: 0.85;
    margin: auto
  }

  .text-center {
    margin: 20px 0px 15px 0px
  }
}

.dialog-footer {
  text-align: right;
}
</style>

<template>
  <div class="container">
    <div class="row">
      <div class="title">
        网盘
        <el-popover popper-class="notice_pop" placement="bottom-start" :offset="10" trigger="hover" width="auto">
          <template #reference>
            <i style="font-size: 20px" class="spacehpc_iconfont hpc_basic_icon_info_circle"></i>
          </template>
          <div class="notice_card">
            <div class="notice_content">
              <li><span class="li-content"> 若账户1个月未登录，将触发数据清空操作，即所有存储文件<span
                    style="color: #ff4a4a">将被删除。</span></span>
              </li>
              <li><span class="li-content">
                  各计算区内的数据是独立存储的，<span style="color: RGBA(219, 220, 222, 1)">不能进行跨区数据共享或传输。</span></span>
              </li>

              <li>
                <span class="li-content">
                  网盘目录将自动挂载在GPU容器中，Linux系统<span
                    style="color: #dddedf">挂载目录为/mnt/storage</span>,Windows系统自动挂载到资源管理器。</span>
              </li>
              <li> <span class="li-content"> 网页暂不支持4G 以上文件上传，推荐使用<span class="linkbtn"
                    @click="downloadXFTP">XFTP</span>工具。</span>
              </li>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="progress_row">
        <div class="info" v-if="storageInfo.inited">
          <div class="volume flex flex-1 space-between">
            <div class="family">
              {{ storageInfo.usedSize }}GB/<span style="color: #83868a">{{ storageInfo.totalSize }}GB</span>
            </div>

            <div class="f12">
              <span class="cf6">今日峰值容量：</span>
              <span class="cf85 mr10">{{ storageInfo.dailyMaxSize || 0 }}GB
              </span>
              <span class="cf6">预计扣费：</span><span class="cf85">{{ storageInfo.preDeduction || 0 }}元</span>
            </div>
          </div>
        </div>
        <div class="progresss" v-if="storageInfo.inited">
          <div class="progress-container" style="
              width: 100%;
              height: 6px;
              position: relative;
              background: rgba(255, 255, 255, 0.15);
              border-radius: 8px;
              display: flex;
            ">
            <!-- <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <div class="progress1" :style="`width: ${(storageInfo.freeSize / storageInfo.usedSize) * 100
                }%;`"></div>
            </template>
            免费容量：{{ storageInfo.freeSize }}GB
          </el-popover> -->
            <el-popover placement="bottom" trigger="hover">
              <template #reference>
                <div class="progress1" :style="{
                  width: `${(Math.min(storageInfo.usedSize, 50) / 500) * 100
                    }%`,
                  backgroundColor: '#3070e1',
                  height: '100%',
                  borderRadius: '8px 0 0 8px',
                }"></div>
              </template>
              免费容量：<span v-if="storageInfo.usedSize < 50">{{
                storageInfo.usedSize
              }}</span>
              <span v-else>{{ storageInfo.freeSize }}</span> GB
            </el-popover>
            <el-popover placement="bottom" trigger="hover">
              <template #reference>
                <div v-if="storageInfo.usedSize > 50" class="progress2" :style="{
                  width: `${((storageInfo.usedSize - 50) / 500) * 100}%`,
                  backgroundColor: 'orange',
                  height: '100%',
                  position: 'absolute',
                  left: `${(50 / 500) * 100}%`,
                  borderRadius: '0 8px 8px 0',
                }"></div>
              </template>
              付费容量：{{ storageInfo.paidSize }}GB
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <div class="content" style="padding: 0 !important">
      <el-tabs 
        class="tabs disk-tabs" 
        v-model="activeName" 
        @tab-click="handleTabs">
          <el-tab-pane 
            v-for="item in zoneList" 
            :key="item.hostAddr"
            :label="item.description" 
            :name="item.hostAddr" 
            :disabled="!item.enabled"
            lazy>
            <filepane 
              v-if="item.inited"
              ref="filePaneRef" 
              @backName="getPathName" 
              :zoneName="item.hostAddr" 
              :breadLabel="item.description"
              >
            </filepane>
            <div v-if="item.enabled && !item.inited" class="initializebox">
              <div class="initialize" @click="initStorageAccountbtn(item)"> <img
                  src="../../assets/images/filetransfer/Initialize_normal.svg" alt="">
              </div>
              <div class="cursor" @click="initStorageAccountbtn(item)">初始化网盘</div>
            </div>
          </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog class="noticeDialog" v-model="fileNotice" title="请注意！" :close-on-click-modal="false"
      :close-on-press-escape="false" style="width: 550px" width="500px" @close="closedialog">
      <div class="noticeContent">
        <img src="@/assets/images/filetransfer/fileNotice.svg" alt="" />
        <div class="centent">

          <li>
            <span class="li-content"> 30天未登录或账户欠费累计达到￥20元或以上，将触发数据清空操作，即所有存储文件<span
                style="color: #ff4a4a">将被删除。</span></span>
          </li>
          <li>
            <span class="li-content">各计算区内的数据是独立存储的，<span style="color: #dddedf">不能进行跨区数据共享或传输。</span></span>
          </li>
          <li> <span class="li-content">
              网盘目录将自动挂载在GPU容器中，Linux系统<span style="color: #dddedf">挂载目录为/mnt/storage</span>,Windows系统自动挂载到资源管理器。</span>
          </li>
          <li style="color: #dddedf"> <span class="li-content"> 免费容量50GB，超出后每天0.1元/GB。</span></li>
          <li> <span class="li-content"> 网页暂不支持4G 以上文件上传，推荐使用<span class="linkbtn"
                @click="downloadXFTP">XFTP</span>工具。</span></li>
        </div>
      </div>
      <template #footer>
        <div class="noticeFooter">
          <el-checkbox v-model="notAgain">下次不再提示</el-checkbox>
          <div>
            <el-button style="" class="bgBtn" text bg @click="fileNotice = false">取消</el-button>
            <el-button style="" class="primarybtn" type="primary" @click="fileNoticeClose">确定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch, watchEffect } from "vue";
import { Zone, setZone, storage, listStorage, download, initStorageAccount } from "@/api/files";
import filepane from "./components/filepane.vue";
import { getPanSize } from "@/api/imageUser";
import { useMineStore } from "@/store/mine";
import { forEach, functions } from "lodash";
const mineStore = useMineStore();

// 弹窗提醒交互逻辑
const notAgain = ref(true);
const fileNotice = ref(true);
if (localStorage.length > 0 && localStorage.hasOwnProperty("fileNotice")) {
  fileNotice.value = JSON.parse(localStorage.getItem("fileNotice"));
}
function fileNoticeClose() {
  if (notAgain.value) {
    localStorage.setItem("fileNotice", false);
  }
  fileNotice.value = false;
}
function closedialog() {
  // fileNoticeClose()
}
const zoneList = ref([]);
const colors = [{ color: "#f56c6c", percentage: 5 }];

// watch(
//   () => mineStore.zoneName,
//   async (newValue) => {
//     console.log(newValue, "newValue");
//     nextTick().then(() => {
//       getStorage();
//     });
//   }
// );

const pathName = ref("");
async function getPathName(val) {
  pathName.value = val;
}
const activeName = ref("");

async function getZone() {
  try {
    const res = await listStorage();
    if (res.code == 200 && res.data) {
      zoneList.value = res.data;
      console.log('zoneList', zoneList.value)
      storageInfo.value = res.data[0];
      const activeTabName = res.data.find((item) => item.enabled)?.hostAddr || null;
      // debugger
      activeName.value = activeTabName
      // activeName.value = res.data[0].hostAddr
      nextTick().then(() => {
        mineStore.zoneName = activeName.value;
        setZone(activeTabName)
      });
      ;
    }
  } catch (error) { }
}
getZone();

// tabs切换

function handleTabs(tab) {
  console.log(tab.props.name, "tab");
  setZone(tab.props.name);
  mineStore.zoneName = tab.props.name;
  zoneList.value.forEach((item) => {
    if (item.hostAddr == tab.props.name) {
      storageInfo.value = item;
    }
  });
}



const storageInfo = ref({
  usedSize: 0,
  totalSize: 500,
  freeSize: 50,
});
function downloadXFTP() {
  window.open("https://help.spacehpc.com/document/application_tool/xftp/xftp.html");
}
function initStorageAccountbtn(item) {
  let obj = { zoneId: item.zoneId }
  initStorageAccount(obj).then((res) => {
    if (res.code == 200) {
      getZone();
      ElMessage.success(res.data)
    } else {
      ElMessage.error(res.data)
    }
  })
}
// async function getStorage() {
//   try {
//     let zoneid = null
//     zoneList.value.forEach(item => {
//       if (item.hostAddr == activeName.value) {
//         zoneid = item.zoneId
//       }
//     });
//     let obj = {
//       zoneId: 1
//     }
//     const res = await getPanSize(obj);
//     if (res.code == 200) {
//       storageInfo.value = res.data;
//     }
//   } catch (error) { }
// }
// getStorage();
</script>

<style lang="less" scoped>
@import '../../assets/css/fileTransfer.less';
</style>
<style lang="less">
.el-popover.el-popper {
  border: none !important;
  background: #0b1320 !important;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.48),
    0px 6px 16px 0px rgba(0, 0, 0, 0.32), 0px 9px 28px 0px rgba(0, 0, 0, 0.2) !important;
}

.el-popper.is-light .el-popper__arrow::before {
  border: 1px solid #0b1320;
  background: #0b1320;
  right: 0;
}

.v3-menus {
  width: 200px;
  background: #0b1320 !important;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.302) !important;
  border-radius: 10px 10px 10px 10px !important;
}

.notice_pop {
  padding: 0 !important;

  .title {
    padding: 5px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .notice_content {
    font-size: 14px;
    padding: 10px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);

    .li-content {
      margin-left: -8px;
    }
  }
}
</style>

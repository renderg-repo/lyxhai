<template>
  <div class="container">
    <div class="row">
      <div class="title">
       <div class="lh26 cf85">镜像</div>  
        <el-popover 
          popper-class="notice_pop" 
          placement="right" 
          :offset="10" 
          trigger="hover" 
          hide-after="999999"
          :width="560">
          <template #reference>
            <i 
              style="font-size: 20px; color: rgba(0, 0, 0, 0.85)" 
              class="spacehpc_iconfont hpc_basic_icon_info_circle"></i>
          </template>
          <div class="notice_card">
            <div class="notice_content fc85">
              <li>
                若账户连续 1 个月未登录，将导致镜像数据被永久删除。
              </li>
              <li>
                免费镜像容量为 100GB ，超出的部分将按 0.01 元/日/GB 在每日 0
                点进行扣费。
              </li>
            </div>
          </div>
        </el-popover>
      </div>

      <div class="progress_row">
        <div class="info">
          <div class="volume">
            已用{{ storageInfo.usedSize }}GB<span style="color: #83868a"></span>
          </div>
          <div class="inforight">
            <div class="dots" style="background: #2696ff"></div>
            <div class="cf6" style="margin-right: 12px">免费</div>
            <div class="dots" style="background: #ff9000"></div>
            <div class="cf6">付费</div>
          </div>
        </div>
        <div class="progresss">
          <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <div class="progress1" :style="`width: ${(storageInfo.freeSize / storageInfo.usedSize) * 100
                }%;`"></div>
            </template>
            免费容量：{{ storageInfo.freeSize }}GB
          </el-popover>
          <el-popover placement="bottom" trigger="hover" width="180">
            <template #reference>
              <div class="progress2" :style="`
                    width: ${(storageInfo.paidSize / storageInfo.usedSize) * 100
                }%;
                    `"></div>
            </template>
            付费容量：{{ storageInfo.paidSize }}GB
          </el-popover>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 15px">
      <el-button @click="handleRefresh()" class="ghostbtn universalMediumbtn" style="padding: 7px 16px 7px 14px">
        <i style="font-size: 16px; margin-right: 6px" class="spacehpc_iconfont hpc_basic_icon_refresh_bt"></i>
        刷新列表
      </el-button>
    </div>

    <el-table class="list felx-1 flex-column table-container" 
      ref="multipleTableRef" 
      style="width: 100%" :height="tableheight" empty-text=" " 
      header-row-class-name="table_top"
      row-class-name="table_cell" 
      :row-style="{ height: '126px' }" 
      element-loading-background="rgb(255, 255, 255, 0.8)"
      :data="tableData"
      v-loading="loading">
      <el-table-column label="镜像名称/ID" property="name" width="240">
        <template #default="{ row }">
          <div class="flex justity-between">
            <div class="name" v-show="!(showID == row.id)" :title="row.imgName">
              {{ row.imgName }}
            </div>
            <el-input :key="row.imgName" ref="editInput" v-if="showID == row.id" v-model="hostName"
              :placeholder="row.imgName" maxlength="14" @change="editHostname(row.id)"
              @blur="inputBlur(row.imgUniqName)"></el-input>
            <i v-if="row.status != 'destroy' && Boolean(row.userImageShareInfo.isOwn)" class="spacehpc_iconfont hpc_gpu_icon_edit copy_icon"
              @click="handleEditHostname($event, row.id)"></i>
          </div>
          <div class="flex justity-between">
            <div style="color: rgba(0, 0, 0, 0.45)">{{ row.imgUniqName }}</div>
            <i v-if="row.status != 'destroy'" class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon"
              @click="copyClick(`${row.imgUniqName}`)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大小" sortable prop="size" width="160">
        <template #default="scope">
          <span class="cf6">{{ scope.row.imgSize }} GB <span v-if="Number(scope.row.imgCount) > 1">* {{ scope.row.imgCount }}</span> </span>
        </template>
      </el-table-column>
      <!-- <el-table-column property="status" label="状态" width="160">
        <template #header="{ column }">
          <div class="filter">
            <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
              <template #reference>
                <div class="hover">
                  <span class="label" :class="filters.allStatus || filters.isAllStatus
                    ? 'check'
                    : ''
                    ">{{ column.label }}</span>
                  <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allStatus || filters.isAllStatus
                    ? 'checked'
                    : ''
                    "></i>
                </div>
              </template>
              <el-checkbox class="mb0" v-model="filters.allStatus" :indeterminate="filters.isAllStatus"
                @change="handleCheckAllChange('status', $event)">全部状态
              </el-checkbox>
              <el-divider />
              <el-checkbox-group class="checkGroup" v-model="filters.status"
                @change="handleCheckboxGrop('status', $event)">
                <el-checkbox v-for="item in allStatus" :key="item.dictValue" :label="item.dictLabel">
                  {{ item.dictLabel }}
                </el-checkbox>
              </el-checkbox-group>
            </el-popover>
          </div>
        </template>
        <template #default="scope">
          <span v-if="scope.row.status" class="dot" :class="matchBg(scope.row.status)"></span>
          <span class="cf85" style="margin-left: 16px">{{
            match(scope.row.status) 
          }}</span> <span v-if="scope.row.status==2">（{{scope.row.progress}}%）</span>
        </template>
      </el-table-column> -->
      <el-table-column property="fingerPrint" label="保存区域" show-overflow-tooltip width="240">
        <!-- <template #header="{ column }">
          <div class="filter">
            <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
              <template #reference>
                <div class="hover">
                  <span class="label" :class="filters.allArea || filters.isAllArea
                    ? 'check'
                    : ''
                    ">{{ column.label }}</span>
                  <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allArea || filters.isAllArea
                    ? 'checked'
                    : ''
                    "></i>
                </div>
              </template>
              <el-checkbox class="mb0" v-model="filters.allArea" :indeterminate="filters.isAllArea"
                @change="handleCheckAllChange('area', $event)">全部区域
              </el-checkbox>
              <el-divider />
              <el-checkbox-group class="checkGroup" v-model="filters.area" @change="handleCheckboxGrop('area', $event)">
                <el-checkbox v-for="item in areas" :key="item.name" :label="item.name">
                  {{ item.description }}
                </el-checkbox>
              </el-checkbox-group>
            </el-popover>
          </div>
        </template> -->
        <template #default="{ row }">
          <div v-if="row.userImageSyncInfo">
            <div class="flex-between" v-for="(item, index) in (row.userImageSyncInfo.length > 4 ? row.userImageSyncInfo.slice(0, 4) : row.userImageSyncInfo)" :key="index">
              <p class="cf6">
                {{ matchArea(item.zoneName) }}（{{ match(item.status) }}<span v-if="item.progress">: {{ item.progress }} %</span>）
              </p>
              <el-button 
                type="primary" 
                v-if="item.status == 2 "
                @click="handleDel(row.id, 'cancel')"
                link > 取消 </el-button>
              <el-button 
                type="primary" 
                v-if="(item.status == 6 ) && (row.userImageShareInfo.accepted || row.userImageShareInfo.isOwn) "
                @click="handleCancel(row.id, item.zoneId, index)"
                link > 取消 </el-button>
            </div>
          </div>
          <el-button 
              v-if="row.userImageSyncInfo && row.userImageSyncInfo.length > 4"
              type="primary" 
              @click="handleSyn(row)" 
              link > 查看更多 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" sortable show-overflow-tooltip width="200">
        <template #default="scope">
          <span class="cf85">{{ scope.row.createdAt }} </span>
        </template>
      </el-table-column>
      <el-table-column label="分享" prop="share" sortable show-overflow-tooltip width="200">
        <template #default="scope">
          <div class="" v-if="!scope.row.userImageShareInfo.isOwn">
            <p class="cf6">来自{{ scope.row.userImageShareInfo.sharedByPhone }}的分享 </p>
            <div v-if="!scope.row.userImageShareInfo.accepted">
              <el-button type="primary" @click="handleAccept(scope.row.id, true)" link > 接受 </el-button>
              <el-button type="primary" @click="handleAccept(scope.row.id, false)" link > 拒绝 </el-button>
            </div>
          </div>
          <div v-if="scope.row.userImageShareInfo.isOwn && scope.row.userImageShareInfo.sharedCount ">
            <p class="cf6">已分享{{ scope.row.userImageShareInfo.sharedCount }}人</p>
            <el-button type="primary" @click="cancelShare(scope.row.id)" link > 取消分享 </el-button>
          </div>
          <div v-if="!scope.row.userImageShareInfo.sharedCount && 
                    scope.row.userImageShareInfo.isOwn">未分享</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip >
        <template #default="scope">
          <el-button 
            type="primary" 
            @click="handleCre(scope.row)" 
            :disabled="!scope.row.ready || (!scope.row.userImageShareInfo.isOwn && !scope.row.userImageShareInfo.accepted)"
            link > 创建实例 </el-button>
          <el-button 
            type="primary" 
            @click="handleSyn(scope.row)" 
            :disabled="!scope.row.ready || !scope.row.userImageShareInfo.isOwn"
            link > 跨区同步 </el-button>
          <el-button 
            type="primary" 
            @click="handleShare(scope.row.id)" 
            :disabled="!scope.row.ready || !scope.row.userImageShareInfo.isOwn"
            link> 分享 </el-button>
          <el-button type="primary" 
            :disabled="isDisabled(scope.row) ||
             (!scope.row.userImageShareInfo.isOwn && !scope.row.userImageShareInfo.accepted)" 
            @click="handleDel(scope.row.id, 'delete')" link> 删除 </el-button>
        </template>
      </el-table-column>
      <template #append>
        <div v-show="(tableData.totalPage == 0 ||
          tableDatalistlength < queryParams.pageSize) &&
          !loading
          " class="noMoreData flex-1">
          暂无更多
        </div>
      </template>
    </el-table>

    <div class="pagination-bar pagination">
      <el-pagination class="input-bg" popper-class="pagination-bar" @size-change="handleSizeChange"
        @current-change="handlePagination" :current-page="queryParams.pageNum" :total="totalCount"
        :page-size="queryParams.pageSize" :page-sizes="[10, 20, 30, 50]" layout="total,prev,pager,next,sizes,jumper">
      </el-pagination>
      <!-- </div> -->
      <!-- <div class="th"></div>
        <div class="item"></div> -->
    </div>
    <!-- 删除确认弹窗 -->
    <el-dialog class="confirmDialog" :show-close="false" title="" style="width: 424px" v-model="delVisible">
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="titleClass">
          <i style="
              margin: 3px 12px 0 0;
              color: #DF444D;
              font-size: 20px;
            " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i>
            <span 
            style="font-size: 16px; color: rgba(255, 255, 255, 0.85); ">{{ DialoVisible.title }}</span>
        </div>
      </template>
      <div class="flex">
        <div class="flex confirmContent" style="padding-left: 2em; color: rgba(255, 255, 255, 0.65)">
          {{ DialoVisible.desc }}
        </div>
      </div>

      <template #footer>
        <div class="noticeFooter">
          <el-button style="width: 76px" class="bgBtn" text bg @click="closedialog()">取消</el-button>
          <el-button 
            style="width: 76px" 
            class="warningbtn" 
            type="primary" 
            :loading="Buttonloading"
            @click="handleDelimg()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 取消确认弹窗 -->
    <el-dialog class="confirmDialog" :show-close="false" title="" style="width: 424px" v-model="cancelVisible">
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="titleClass">
          <i style="
              margin: 3px 12px 0 0;
              color: #DF444D;
              font-size: 20px;
            " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i><span class="cf85"
            style="font-size: 16px">确认要取消镜像同步？</span>
        </div>
      </template>
      <div class="flex">
        <div class="flex confirmContent" style="padding-left: 2em; color: rgba(255, 255, 255, 0.65)">
          镜像取消后，消耗一次同步次数。
        </div>
      </div>

      <template #footer>
        <div class="noticeFooter">
          <el-button style="width: 76px" class="bgBtn" text bg @click="cancelVisible = false">取消</el-button>
          <el-button style="width: 76px" class="warningbtn" type="primary" :loading="Buttonloading"
            @click="handleCancelBtn()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 分享弹窗 -->
    <el-dialog 
      class="shareDialog" 
      style="width: 480px; padding: 0" 
      @close="shareDialogClose"
      :show-close="false" 
      v-model="dialogShareVisible">
      <template #header="{ close }">
        <div class="my-header">
          <p class="wcf85 " >分享管理</p>
          <el-icon  @click="close"><Close /></el-icon>
        </div>
      </template>
      <div class="dialog-main">
        <p class="wcf85 mb10">分享镜像给他人</p>
        <div class="flex mb10 align-start">
          <div class="input-container">
            <div :class="phoneList.length ? 'tags' : ''">
              <div 
                v-for="(tag, index) in phoneList" 
                :key="index" 
                class="tag-item flex-align-center flex-between">
                <span class="cf85">{{ tag }}</span> 
                <div class="tag-close" @click="removeTag(index)"></div>
              </div>
            </div>
            <el-input
              v-model="inputValue"
              @keyup.enter="addTag"
              placeholder="请输用户手机号（支持批量分享，回车键确定）"
              class="tag-input-field"
              @input="handleInput"
            />
          </div>
          <div class="share-button" v-if="sharePost" @click="shareClick"><img src="@/assets/images/send_normal.svg" alt=""></div>
          <div class="share-button" v-else><img class="loading-circle" src="@/assets/images/loading_circle.svg" alt=""></div>
        </div>
        <p class="wcf85 mb10">当前已分享(对方接收后显示)</p>
        <div class="share-list-box mb10">
          <ul v-if="shareList.length > 0">
            <li v-for="(item, index) in shareList" :key="index" class="flex-between flex-align-center">
              <p class="wcf85">{{ item.phone ? item.phone : '' }}</p>
              <el-icon class="close-icon" style="color: #df444d" @click="deleteBtn(item, index)"><Close /></el-icon>
            </li>
          </ul>
          <div v-else></div>
        </div>
        <div class="flex-between">
          <div class="flex flex-align-center">
            <p class="wcf85 mr10">分享已开启</p>
            <el-switch 
              size="small" 
              v-model="shareSwitch" 
              :active-value="true"
              :inactive-value="false" 
              @change="switchChange" ></el-switch>
          </div>
          <el-link href="https://help.spacehpc.com/document/vm_operation/mirror_sharing/mirror_sharing.html" :underline="false" target="_blank" type="primary">查看帮助文档</el-link>
        </div>
      </div>
    </el-dialog>
    <!-- 跨区同步弹窗 -->
    <el-dialog 
      class="shareDialog" 
      style="width: 480px; padding: 0" 
      @close="crossDialogClose"
      :show-close="false" 
      v-model="dialogCrossVisible">
      <template #header="{ close }">
        <div class="my-header">
          <p class="wcf85" >镜像：<span style="font-size: 14px">{{ crossItem.imgName }}</span></p>
          <el-icon  @click="close"><Close /></el-icon>
        </div>
      </template>
      <div class="dialog-main">
        <div class="cross-tips">
          <i class="icon hpc_basic_icon_info_filled" style="margin-top: 1px; color: #2696FF"></i>
          <span class="wcf85 ml10">每天只能进行3次同步操作，请悉知！</span>
        </div>
        <div class="cross-zone">
          <p class="wcf6">管理镜像同步区域：</p>
          <ul>
            <li class="cross-zone-item" v-for="(item, index) in syncZone" :key="index">
              <div class="cross-zone-item-label">
                <p class="wcf85">{{ matchArea(item.zoneName) }}：</p> <span class="wcf6"> 
                  （{{ match(item.status) }}<span v-if="item.progress">: {{ item.progress }} %</span>） 
                </span>
              </div>
              <div>
                <el-button 
                  type="primary" 
                  link 
                  @click="crossClick(crossItem.id, item)"
                  :disabled="item.status == 1 || 
                             item.status == 2 || 
                             item.status == 6 ||
                             item.status == 7 " > 
                    同步 
                </el-button>
                <el-button 
                  type="primary" 
                  v-if="item.status === 6"
                  @click="crossDelete(crossItem.id, item.zoneId, index)"
                  link> 
                  取消 
                </el-button>
                <el-button 
                  v-else
                  type="primary" 
                  @click="crossDelete(crossItem.id, item.zoneId, index)"
                  :disabled="isDisabledItem(item)"
                  link> 
                  删除
                </el-button>
              </div>
            </li>
          </ul>
          <!-- <div class="cross-zone-btn cf85" @click="crossClick">
            开始同步
          </div> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
import { queryDictType, queryDictData } from "@/api/dictionary";
import { zones, zoneAllEnabled } from "@/api/hosts";
import { 
  list, 
  changeImgName, 
  delImage, 
  imgStorageInfo, 
  postShare, 
  getShareList, 
  acceptShare, 
  deleteShare, 
  removeShare, 
  SwitchShare, 
  SyncingInfos,
  postSync,
  delImageForZone
 } from "@/api/imageUser";
import {
  computed,
  nextTick,
  onMounted,
  readonly,
  ref,
  watch,
  inject,
  shallowRef,
  onUnmounted,
} from "vue";
import clipboard3 from "vue-clipboard3";
import { status } from "../../api/hosts";
import { functions, functionsIn, slice } from "lodash";
let allStatus = ref([]);
const tableheight = ref(700);
const usedStorageGB = ref(0);
const { proxy } = getCurrentInstance();
const filters = reactive({
  user: "",
  products: [],
  spend: [],
  items: [],
  status: [],
  productsEcho: "",
  spendEcho: "",
  itemsEcho: "",
  statusEcho: "",
  allProducts: false,
  allSpend: false,
  allItems: false,
  allStatus: false,
  isAllProducts: false,
  isAllSpend: false,
  isAllItems: false,
  isAllStatus: false,
});
const delVisible = ref(false);
const cancelVisible = ref(false);
const dialogShareVisible = ref(false);
const dialogCrossVisible = ref(false);
const crossItem = ref({})
const syncZone = ref([])
const sharePost = ref(true)
const delid = ref("");
const showID = ref(null);
const tableData = ref([]);
const totalCount = ref(0);
const Buttonloading = ref(false);
const loading = ref(false);
const filterCheck = ref(false);
const hostName = ref("");
const editInput = ref(null);
const mirrorID = ref(null)
const phoneList = ref([])
const inputValue = ref('')
const phoneTagList = ref([])
const shareList = ref([])
const shareSwitch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  status: "",
});
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
const tableDatalistlength = ref(0);
function checkHeight() {
  tableheight.value = window.innerHeight - 302
  // tableheight.value = window.innerHeight > 932 ? 756 : 640;
}

// 在组件挂载时添加全屏事件监听器
onMounted(() => {
  window.addEventListener("resize", checkHeight);
  checkHeight(); // 初始检查
  startPolling();
});

// 在组件卸载时移除全屏事件监听器
onUnmounted(() => {
  window.removeEventListener("resize", checkHeight);
  stopPolling();
});
const storageInfo = ref({});
function getimgStorageInfo() {
  imgStorageInfo().then((res) => {
    storageInfo.value = res.data;
  });
}
getimgStorageInfo();
function editHostname(hostid) {
  let obj = {
    id: hostid,
    imgName: hostName.value,
  };
  changeImgName(obj).then((res) => {
    if (res.code == 200) {
      showID.value = null;
      hostName.value = "";
      ElMessage({
        type: "success",
        message: "修改成功",
      });
      getlist()
    } else {
      ElMessage({
        type: "warning",
        message: "修改失败",
      });
    }
    startPolling()
  });
}

function handleEditHostname(event, vmid) {
  showID.value = vmid;
  stopPolling();
  nextTick(() => {
    editInput.value.focus();
  });
}
function inputBlur(id) {
  showID.value = null;
  hostName.value = "";
  startPolling()
}
const DialoVisible = ref({
  title: '',
  desc: ''
})
function handleDel(id, type) {
  delid.value = id;
  if (type == 'delete') {
    DialoVisible.value.title = '确认要删除镜像？'
    DialoVisible.value.desc = '镜像删除后，不可恢复。'
  } else {
    DialoVisible.value.title = '确认要取消保存中的镜像？'
    DialoVisible.value.desc = '镜像取消后，不可恢复。'
  }
  delVisible.value = true;
}
const canId = ref(null)
const canZoneId = ref(null)
const canIndex = ref(null)
function handleCancel(id, zoneId, index) {
  // delid.value = id;
  canId.value = id
  canZoneId.value = zoneId
  canIndex.value = index
  cancelVisible.value = true;
}
function closedialog(id) {
  delVisible.value = false;
}
function handleDelimg() {
  Buttonloading.value = true
  delImage({ id: delid.value }).then((res) => {
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: res.message,
      });
      getlist();
      Buttonloading.value = false;
      delVisible.value = false;
    } else {
      ElMessage({
        type: "error",
        message: res.message,
      });
      Buttonloading.value = false;
      delVisible.value = false;
    }
  });
}
// 取消同步确认按钮
function handleCancelBtn() {
  cancelCross(canId.value, canZoneId.value)
  cancelVisible.value = false;
}
// 创建实例
function handleCre (row) {
  // 已就绪获取当前第一个区域id
  /* 1. 判断当前区域是否就绪，
     2. 判断就绪的区域是否在areas数组中，是，获取第一个区域id
  */
  // const firstItemWithStatus1 = row.userImageSyncInfo.find(item => item.status === 1 || item.status === 7)
  const firstMatchingItem = row.userImageSyncInfo.find(item => {
    // 条件 1: status 是否为 1 或 7
    const statusMatch = item.status == 1 || item.status == 7;
    // 条件 2: zoneId 是否存在于 zoneList 中
    const zoneExists = areas.value.some(zone => zone.id == item.zoneId);
    return statusMatch && zoneExists;
  })
  if (firstMatchingItem) {
    let params = {
      zoneId: firstMatchingItem.zoneId ,
      myImgId: row.id,
      imgType: 2,
    }
    // 点击创建实例，跳转到创建实例页面，带着zoneId和imgId;
    router.push({ path: '/create', query: params })
  } else {
    ElMessage.error('暂无该区域的创建权限')
  }
}
// 跨区同步
async function handleSyn (row) {
  crossItem.value = row
  console.log('crossItem', crossItem.value);
  dialogCrossVisible.value = true
  const imgId = {
    imgId: row.id
  }
  const res = await SyncingInfos(imgId)
  if (res.code == 200) {
    syncZone.value = res.data
  } else {
    ElMessage({
      type: "error",
      message: res.message,
    });
  }
}
// 分享
function handleShare (id) {
  console.log('id', id)
  mirrorID.value = id
  dialogShareVisible.value = true
  getSharePhoneList(id)
}

// 接受/拒绝分享
async function handleAccept(id, bool) {
  try {
    const res = await acceptShare({ accept: bool, imgId: id })
    if (res.code == 200) {
      ElMessage.success(res.message)
      getlist()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.log(error);
    
  }
}

// 取消分享
async function cancelShare(id) {
  try {
    const res = await deleteShare({ imgId: id })
    if (res.code == 200) {
      ElMessage.success(res.message)
      getlist()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}

// 获取数据字典
async function getDictType() {
  try {
    const res = await queryDictData({ type: "userImageStatusV2" });
    if (res.code == 200) {
      allStatus.value = res.data;
    } else {
      console.log(res.message);
    }
  } catch (error) {
    console.log(error);
  }
}
getDictType();
const areas = ref([]);
// 用户可用区域
async function getZone() {
  try {
    const res = await zones();
    if (res.code == 200) {
      areas.value = res.data;
    }
  } catch (error) { }
}
getZone();
const allZone = ref([]);
// 所有区域
async function getAllZone() {
  try {
    const res = await zoneAllEnabled();
    if (res.code == 200) {
      allZone.value = res.data;
    }
  } catch (error) { }
}
getAllZone()
function matchArea(zoneName) {
  let text = "";
  allZone.value.map((item) => {
    if (item.name == zoneName) {
      text = item.description;
    }
  });
  return text;
}
function matchBg(val) {
  let bgc = "";
  switch (val) {
    case 2:
      bgc = "bgblue";
      break;
    case 1:
      bgc = "bggreen";
      break;
    case 3:
      bgc = "bgred";
      break;
    default:
      bgc = "bgred";
      break;
  }
  return bgc;
}
function match(val) {
  let text = "";
  allStatus.value.map((item) => {
    if (item.dictValue == val) {
      text = item.dictLabel;
    }
    if (val == 0) {
      text = '未同步'
    }
  });
  return text;
}
async function getlist() {
  tableData.value = []
  loading.value = true;
  const res = await list(queryParams);

  if (res.code == 200) {
    loading.value = false;
    tableData.value = res.data.list;
    tableDatalistlength.value = res.data.list.length;
    totalCount.value = res.data.total;
  }
  getimgStorageInfo();
  
}
getlist();

// 刷新列表
function handleRefresh () {
  loading.value = true
  tableData.value = []
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  queryParams.searchValue = ''
  // queryParams.value = {
  //   pageNum: 1,
  //   pageSize: 10,
  //   searchValue: "",
  // }
  getlist()
}

// 处理页码变化
function handlePagination(page) {
  queryParams.pageNum = page;
  console.log(queryParams);
  getlist();
}

// 处理每页条目
function handleSizeChange(size) {
  queryParams.pageSize = size;
  getlist();
}

let imglistt;
function startPolling() {
  imglistt = setInterval(() => {
    // getlist();
    // if (dialogCrossVisible.value) {
    //   handleSyn(crossItem.value)
    // }
  }, 10000);
}
function stopPolling() {
  clearInterval(imglistt);
}

// 全选方法
function handleCheckAllChange(type, val) {
  switch (type) {
    case "status":
      const statuschecks = allStatus.value.map((item) => {
        return item.dictLabel;
      });
      console.log(statuschecks, "statuschecks");
      queryParams.status = val
        ? allStatus.value
          .map((item) => {
            return item.dictValue;
          })
          .join(",")
        : "";
      filters.status = val ? statuschecks : [];
      filters.statusEcho = val ? statuschecks.join(" + ") : "";
      filters.allStatus = val;
      filters.isAllStatus = false;
      break;
    case "area":
      const areachecks = areas.value.map((item) => {
        return item.name;
      });
      // console.log(areachecks, "areachecks");
      queryParams.zoneId = val
        ? areas.value
          .map((item) => {
            return item.id;
          })
          .join(",")
        : "";
      filters.area = val ? areachecks : [];
      filters.allArea = val;
      filters.isAllArea = false;
      break;
  }
  getlist();
}
// 多选组逻辑
function handleCheckboxGrop(type, value) {
  // console.log(type, "22", value, "ttt");
  const checkedCount = value.length;
  if (checkedCount > 0) {
    filterCheck.value = true;
  } else {
    filterCheck.value = false;
  }
  switch (type) {
    case "status":
      queryParams.status = value
        .map((v) => {
          let check = "";
          allStatus.value.map((item) => {
            if (item.dictLabel == v) {
              check = item.dictValue;
            }
          });
          return check;
        })
        .join(",");

      filters.statusEcho = value.join(" + ");
      filters.allStatus = checkedCount == allStatus.value.length;
      filters.isAllStatus =
        checkedCount > 0 && checkedCount < allStatus.value.length;
      break;
    case "area":
      queryParams.zoneId = value
        .map((v) => {
          let check = "";
          areas.value.map((item) => {
            if (item.name == v) {
              check = item.id;
            }
          });
          return check;
        })
        .join(",");
      filters.allArea = checkedCount == areas.value.length;
      filters.isAllArea = checkedCount > 0 && checkedCount < areas.value.length;
      break;
  }
  getlist();
}

function isDisabledItem(row) {
  // 任意区域状态为同步中，所有的删除按钮都不可点击
  if ( syncZone.value.some(item => item.status === 6) ) {
      return true
    } else {
      // 否则，根据具体的 status 值禁用按钮
      return row.status === 2 || row.status === 3 || row.status === 0 || row.status == 7;
    }
}

// 删除按钮禁用逻辑(任意区域在同步中，都不可删除)
function isDisabled(row) {
  if (!row.userImageSyncInfo) return true;
  const hasStatus6 = row.userImageSyncInfo.some(info => info.status === 6)
  const validStatus = row.userImageSyncInfo.every(info => info.status === 1 || info.status === 3 || info.status === 2 )
  return hasStatus6 || !validStatus;
}

function handleInput(value) {
  inputValue.value = value.replace(/\D/g, ''); // 只允许输入数字
}

// 验证手机号格式
function isValidPhoneNumber(phone) {
  const phonePattern = /^1[3-9]\d{9}$/; // 简单的手机号验证
  return phonePattern.test(phone);
}

// 添加标签的函数
function addTag() {
  const trimmedValue = inputValue.value.trim(); // 去除空格
  if (isValidPhoneNumber(trimmedValue) && !phoneList.value.includes(trimmedValue)) {
    phoneList.value.push(trimmedValue); // 添加标签
    inputValue.value = ''; // 清空输入框
  } else {
    // alert('请输入有效的手机号或该手机号已存在'); // 提示用户
    ElMessage.error('请输入有效的手机号或该手机号已存在')
  }
}

// 移除标签的函数
function removeTag(index) {
  phoneList.value.splice(index, 1); // 根据索引移除标签
}

// 点击分享按钮
async function shareClick () {
  const trimmedValue = inputValue.value.trim()
  if (isValidPhoneNumber(trimmedValue) && !phoneList.value.includes(trimmedValue)) {
    addTag(); // 如果输入框有值，先添加标签
  }
  sharePost.value = false
  const params = {
    imgId: mirrorID.value,
    phoneList: phoneList.value
  }
  try{
    if (phoneList.value.length) {
      const res = await postShare(params)
      if (res.code == 200) {
        sharePost.value = true
        phoneList.value = []
        ElMessage.success(res.message)
        dialogShareVisible.value = false
        getlist()
      } else {
        sharePost.value = true
        ElMessage.error(res.message)
      }
    } else {
      ElMessage({
        type: "error",
        message: '请输入要分享用户的手机号',
      });
      sharePost.value = true
    }
    
  } catch (error){
    console.log(error);
  }
}

// 手机号分享列表
async function getSharePhoneList(id) {
  try {
    const imgId = {
      imgId: id
    }
    const res = await getShareList(imgId)
    if (res.code == 200) {
      console.log('res', res)
      res.data.sharedUserInfoVos ? shareList.value = res.data.sharedUserInfoVos : shareList.value = []
      shareSwitch.value = res.data.shareSW
    } else {
      ElMessage({
        type: "error",
        message: res.message,
      });
    }
  } catch (error) {
    console.log(error)
  }
}
// 分享开关
async function switchChange(value) {
  console.log('switchChange', value)
  try {
    var obj = { share: value, imgId: mirrorID.value }
    const res = await SwitchShare(obj)
    console.log('resChange', res)
  } catch (error) {
    
  }
}
// 移除已分享人
function deleteBtn(item, index) {
  shareList.value.splice(index, 1)
  removeShare({ imgId: mirrorID.value, userId: item.userId }).then(res => {
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: res.message,
      });
    } else {
      ElMessage({
        type: "error",
        message: res.message,
      });
    }
  })
}

// 分享弹窗关闭
function shareDialogClose() {
  getlist()
  phoneList.value = []
  shareList.value = []
  inputValue.value = ''
  sharePost.value = true
}

// 开始同步
async function crossClick(imageId, item) {
  console.log('item', item)
  const params = {
    imageId: imageId,
    toZoneId: item.zoneId
  }
  item.status = 6
  try {
    const res = await postSync(params)
    if (res.code == 200) {
      ElMessage.success(res.message)
      handleSyn(crossItem.value)
    } else {
      item.status = 0
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}

// 表格内点击取消按钮
async function cancelCross(imageId, zoneId ) {
  const params = {
    imageId: imageId,
    zoneId: zoneId
  }
  try {
    const res = await delImageForZone(params)
    if (res.code == 200) {
      getlist()
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    
  }
}

// 删除单个区域镜像
async function crossDelete(imageId, zoneId, index) {
  const params = {
    imageId: imageId,
    zoneId: zoneId
  }
  /* 删除逻辑：
    1. 判断是否是list中唯一可删除状态（status== 1）
    是：删除成功后关闭弹窗，刷新实例列表
    否：删除成功后刷新同步区域列表
    2. 有同步中状态，所有删除按钮都不可点击
  **/
  const deleteItems = syncZone.value.filter(item => item.status === 1)
  console.log('deleteItems', deleteItems);
  
  try {
    const res = await delImageForZone(params)
    if (res.code == 200) {
      if (deleteItems.length === 1) {
        crossDialogClose()
      } else {
        handleSyn(crossItem.value)
      }
      getlist()
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.log(error);
    
  }
}

// 关闭跨区同步
function crossDialogClose() {
  dialogCrossVisible.value = false
}
</script>

<style lang="less" scoped>
@import '../../assets/css/mirrorCenter.less';
</style>
<style lang="less" scoped>
:deep(.el-table) {
  --el-table-border-color: #26303e;
}
:deep(.el-table__row.table_cell) {
  border-bottom: 1px solid #000;
}
.el-popover.el-popper {
  border: none !important;
  background: #e9ebee !important;
  width: 200px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.48),
    0px 6px 16px 0px rgba(0, 0, 0, 0.32), 0px 9px 28px 0px rgba(0, 0, 0, 0.2) !important;
}
.el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #26303E;
}
:deep(.shareDialog) {
  --el-dialog-padding-primary: 0;
  .el-icon {
    color: #fff;
  }
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #26303E;
  gap: 16px;
  p {
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
  }
}
.dot::before {
  content: "";
  position: absolute;
  top: 60px;

  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: inherit;
}

.bgblue {
  background-color: #10bbff;
}

.bggray {
  background-color: #909399;
}

.bgyellow {
  background-color: #ffb31a;
}

.bggreen {
  background-color: #2dff6c;
}

.bgred {
  background-color: red;
}
</style>
<style lang="less">
.notice_pop {
  padding: 0 !important;

  .notice_content {
    font-size: 14px;
    padding: 15px 8px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
  }
}

.custom-select.el-select-dropdown {
  display: none !important;
}
</style>

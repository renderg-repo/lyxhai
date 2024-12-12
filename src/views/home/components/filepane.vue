<template>
  <div class="pane_container">
    <div class="oprow">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item 
          :to="{ path: '/fileTransfer' }" 
          @click="fetchData()">
          <span class="bread-item" style="font-size: 14px">{{ props.breadLabel }}</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item 
          v-for="(path, i) in paths"
          :key="i"
          @click="paths.length - 1 == i ? 'javascript:;' : handleBred(i)">
          <span class="bread-item" @click="reload">{{ path }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="search">
        <!-- <el-checkbox
          style="margin-right: 20px; color: rgba(255, 255, 255, 0.6)"
          @change="fetchData(supath)"
          v-model="hidden"
          label="显示隐藏文件"
        ></el-checkbox> -->
        <el-button @click="reload" class="refresh-btn mr10" text>
          <i class="spacehpc_iconfont hpc_basic_icon_refresh_small f18"></i>
        </el-button>
        <!-- <img src="@/assets/images/filetransfer/grid.svg" alt=""> -->
        <el-input 
          class="input-bg" 
          @change="fetchData(supath)" 
          placeholder="搜索文件名" 
          v-model="query" clearable
          style="min-width: 300px"> 
          <template v-slot:suffix>
            <i class="icon hpc_basic_icon_search f22"></i>
          </template></el-input>
      </div>
    </div>

    <div 
      id="dropTarget" 
      ref="dropZoneRef" 
      @contextmenu.stop="rightClick" 
      class="pane_content table-container" 
      :class="[ listings.items.length > 0 ? '' : 'drop-border',
       isOverDropZone ? 'drop-border' : '']">
      <div v-if="isOverDropZone" class="overDrop" :class="isOverDropZone ? 'mask' : ''">
        <div class="zhegai">
          <div class="upIcon">
            <img src="@/assets/images/filetransfer/+.svg" alt="" />
          </div>
          <div>上传文件或文件夹至网盘</div>
        </div>
      </div>
      <el-table ref="tableRef" class="table" empty-text=" " :data="listings.items" v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0)" @selection-change="handleSelectionChange"
        :row-style="{ height: '46px' }" @row-contextmenu="handleRowRight" @cell-click="handleSelect">
        <el-table-column type="selection" width="38"> </el-table-column>
        <el-table-column label="文件名" prop="name" sortable min-width="300">
          <template #default="scope">
            <div class="flex justity-between" @click="handledbclick(scope.row)">
              <div class="name flex-1">
                <img v-if="scope.row.isDir && scope.row.type == ''" src="@/assets/images/filetransfer/fileIcon.svg"
                  alt="" />
                <img v-else-if="scope.row.type == 'text'" src="@/assets/images/filetransfer/textIcon.svg" alt="" />
                <img v-else-if="scope.row.type == 'image'" src="@/assets/images/filetransfer/imageIcon.svg" alt="" />
                <img v-else-if="scope.row.type == 'blob'" src="@/assets/images/filetransfer/zipIcon.svg" alt="" />
                <img v-else src="@/assets/images/filetransfer/textIcon.svg" alt="" />
                {{ scope.row.name }}
                <!-- <img
                  ref="previewImg"
                  style="display: none"
                  v-if="scope.row.type == 'image'"
                  v-preview:name="props.zoneName"
                  :src="previewSrc"
                  alt=""
                /> -->
              </div>
              <div class="hoverMod">
                <div class="seat">
                  <el-popover ref="inlinePopover" :show-arrow="false" popper-style="border: none;padding: 0;"
                    placement="top" trigger="click" :offset="5" width="180" :append-to-body="false"
                    popper-class="plusActions">
                    <template #reference>
                      <el-button link type="primary" @click.stop>
                        <i style="font-size: 20px" v-show="!isRowSelected(scope.row)"
                          class="spacehpc_iconfont hpc_basic_icon_more hoverMore"></i>
                      </el-button>
                    </template>
                    <div class="plusActions">
                      <div class="plusAction borderBottom" @click="handleDownload(scope.row)">
                        下载
                      </div>
                      <hr />
                      <div class="plusAction" @click="handleIcon('move', scope.row)">
                        移动至
                      </div>
                      <div class="plusAction" @click="handleCopyPath(scope.row)">
                        复制绝对路径
                      </div>
                      <div class="plusAction" @click="handleIcon('rename', scope.row)">
                        重命名
                      </div>
                      <div class="plusAction borderBottom" @click="handledbclick(scope.row)" v-show="scope.row.isDir">
                        打开文件夹
                      </div>
                      <hr />
                      <div class="plusAction" @click="handleIcon('delete', scope.row)" style="color: #d63939">
                        删除
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="modified" width="180" sortable>
          <template #header>
            <span>修改时间</span>
          </template>
          <template #default="scope">
            {{ new Date(scope.row.modified).toLocaleString().slice(0, -3) }}
          </template>
        </el-table-column>
        <el-table-column label="大小" prop="size" sortable width="190">
          <template #default="scope">
            <!-- {{ size(scope.row.size) }} -->
            <span v-if="scope.row.isDir">-</span>
            <span v-if="!scope.row.isDir">{{ size(scope.row.size) }}</span>
          </template>
        </el-table-column>
        <template #append v-if="!loading && showUpOperate">
          <div v-if="listings.items.length == 0 && query" class="noMoreData flex-1">
            搜索无结果
          </div>
          <!-- <div v-else class="noMoreData flex-1">暂无更多</div> -->
        </template>
      </el-table>
      <div v-show="showUpOperate && query == '' && !loading && !(listings.numDirs + listings.numFiles)"
        class="upOperate">
        <div class="dropText">将文件拖拽到这里</div>
        <div class="or">或者</div>
        <div class="actions">
          <div class="action hoverImg1" style="margin-right: 15px;" @click="handleIcon('create')">
            <img src="@/assets/images/filetransfer/new.svg" alt="" />
            <div>新建文件夹</div>
          </div>
          <div class="action hoverImg2" style="margin-right: 15px;" @click="clickUpload">
            <img src="@/assets/images/filetransfer/upfile.svg" alt="" />
            <div>上传文件</div>
          </div>
          <div class="action hoverImg3" @click="clickUploadFolder">
            <img src="@/assets/images/filetransfer/upfiles.svg" alt="" />
            <div>上传文件夹</div>
          </div>
        </div>
      </div>
      <el-popover :show-arrow="false" popper-style="border: none;padding: 0;" placement="top-end" trigger="click"
        :offset="5" width="180" :hide-after="0" :append-to-body="false" popper-class="plusActions">
        <template #reference>
          <div class="plus" :class="collapse ? 'plusopen2' : 'plusopen' && open ? 'plusopen' : ''
            ">
            <i class="spacehpc_iconfont hpc_basic_icon_plus f20"></i>
            <!-- <el-icon><Plus /></el-icon> -->
          </div>
        </template>
        <div class="plusActions">
          <div class="plusAction" @click="clickUpload">
            <img src="@/assets/images/filetransfer/upfileChecked.svg" alt="" />
            上传文件
          </div>
          <div class="plusAction" @click="clickUploadFolder">
            <img src="@/assets/images/filetransfer/upfilesChecked.svg" alt="" />
            上传文件夹
          </div>
          <div class="plusAction" @click="handleIcon('create')">
            <img src="@/assets/images/filetransfer/newChecked.svg" alt="" />
            新建文件夹
          </div>
        </div>
      </el-popover>
      <div class="iconBar" v-show="batchList.length > 0">
        <img @click="handleBatchDownload" class="hoverDownload" src="@/assets/images/filetransfer/download.svg" alt="下载"
          title="下载" />
        <img @click="handleIcon('move', null, true)" class="hoverMove" src="@/assets/images/filetransfer/move.svg"
          alt="" title="移动" />
        <img @click="handleIcon('copy', null, true)" class="hoverCopy" src="@/assets/images/filetransfer/copy.svg"
          alt="" title="复制文件" />
        <!-- <img @click="handleIcon('rename', rowSelected)" class="hoverRename"
                    src="@/assets/images/filetransfer/rename.svg" alt="" title="重命名"> -->
        <img @click="handleIcon('delete', null, true)" class="hoverdelete" src="@/assets/images/filetransfer/delete.svg"
          alt="" title="删除" />
        <!-- <img class="hoverMore disabled" src="@/assets/images/filetransfer/more.svg" alt="" title="更多"> -->
        <img @click="clearSelection" class="hoverClose noMargin" src="@/assets/images/filetransfer/close.svg" alt=""
          title="关闭" />
      </div>
      <!-- 页面右键菜单组件 -->
      <vue3-menus v-model:open="isOpen" :event="eventVal" :menus="[{}]">
        <template #default>
          <div class="plusActions">
            <div class="plusAction borderBottom" @click="handleIcon('create')">
              <img src="@/assets/images/filetransfer/newChecked.svg" alt="" />
              新建文件夹
            </div>
            <hr />
            <div class="plusAction" @click="clickUpload">
              <img src="@/assets/images/filetransfer/upfileChecked.svg" alt="" />
              上传文件
            </div>
            <div class="plusAction borderBottom" @click="clickUploadFolder">
              <img src="@/assets/images/filetransfer/upfilesChecked.svg" alt="" />
              上传文件夹
            </div>
            <hr />
            <div class="plusAction" @click="reload">
              <img src="@/assets/images/filetransfer/refresh.svg" alt="" />
              刷新页面
            </div>
          </div>
        </template>
      </vue3-menus>
      <!-- 页面右键菜单组件 end -->
      <!-- 表格行右键菜单组件 -->
      <vue3-menus v-model:open="rowRight" :event="eventVal" :menus="[{}]">
        <template #default>
          <div class="plusActions">
            <div class="plusAction borderBottom" @click="handleDownload(rowSelected)">
              下载
            </div>
            <hr />
            <div class="plusAction" @click="handleIcon('move', rowSelected)">
              移动至
            </div>
            <div class="plusAction" @click="handleCopyPath(rowSelected)">
              复制绝对路径
            </div>
            <div class="plusAction" @click="handleIcon('rename', rowSelected)">
              重命名
            </div>
            <div class="plusAction borderBottom" @click="handledbclick(rowSelected)" v-show="rowSelected.isDir">
              打开文件夹
            </div>
            <hr />
            <div class="plusAction" @click="handleIcon('delete', rowSelected)" style="color: #d63939">
              删除
            </div>
          </div>
        </template>
      </vue3-menus>
      <!-- 表格行右键菜单组件 end -->
      <!-- 表格行右键批量菜单组件 -->
      <vue3-menus v-model:open="rowsRight" :event="eventVal" :menus="[{}]">
        <template #default>
          <div class="plusActions">
            <div class="plusAction borderBottom" @click="handleBatchDownload">
              下载
            </div>
            <div class="plusAction" @click="handleIcon('move')">移动至</div>
            <hr />
            <div class="plusAction" @click="handleIcon('delete', null, true)" style="color: #d63939">
              删除
            </div>
          </div>
        </template>
      </vue3-menus>
      <!-- 表格行右键批量菜单组件 end -->
    </div>

    <!-- 操作dialog -->
    <el-dialog class="fileDialog" v-model="dialogVisible" :title="dialogTitle" :width="dialogWidth"
      @close="cancelButton()" :style="`width: ${dialogWidth}px`">
      <!-- 新建文件夹 -->
      <div v-if="dialogType == 'create'" style="padding: 0 20px">
        <el-input ref="createInput" v-model="fileName"></el-input>
      </div>
      <!-- 新建文件夹 end -->
      <!-- 编辑文件 -->
      <div v-if="dialogType == 'edit'" style="padding: 0 20px">
        <!-- 代码编辑器 -->
        <v-ace-editor id="editor" theme="monokai" :lang="lang" v-model:value="content" style="height: 300px" />
      </div>
      <!-- 编辑文件 end -->
      <!-- 移动文件 -->
      <div v-if="dialogType == 'move' || dialogType == 'copy'">
        <el-breadcrumb :separator-icon="ArrowRight" style="padding: 0px 0px 15px 0px">
          <el-breadcrumb-item @click="handledFolder('/')"><span class="bread-item">{{
            props.breadLabel
          }}</span></el-breadcrumb-item>
          <el-breadcrumb-item v-for="(path, i) in movePaths" :key="i" @click="
            movePaths.length - 1 == i ? 'javascript:;' : handleMoveBred(i)
            ">
            <span class="bread-item" :class="movePaths.length - 1 == i ? 'disabled' : ''">{{ path }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="ls borderTop">
          <div class="lsitem" v-for="item in moveFolders" :key="item.path" @click="handledFolder(item.path)">
            <img src="@/assets/images/filetransfer/fileIcon.svg" alt="" />
            {{ item.name }}
          </div>
          <div class="" style="
              position: relative;
              top: 50%;
              text-align: center;
              transform: translateY(-70%);
            " v-if="!moveFolders.length && !showNewFolderInput">
            <img style="height: 60px" src="@/assets/images/filetransfer/fileIcon.svg" alt="" />
            <div>该目录下没有文件夹</div>
          </div>
          <div class="lsitem" v-show="showNewFolderInput">
            <img src="@/assets/images/filetransfer/fileIcon.svg" alt="" />
            <el-input class="flex-1" v-model="fileName" ref="newFolderInput"></el-input>
            <div class="flex">
              <el-icon class="inputIcon f20" @click="createFolder(true)">
                <SuccessFilled />
              </el-icon>
              <el-icon class="inputIcon f20" @click="showNewFolderInput = false">
                <CircleCloseFilled />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- 移动文件 end -->
      <!-- 重命名 -->
      <div v-if="dialogType == 'rename'" style="padding: 15 20px 20px 20px; border-top: 1px solid #30363d"
        class="renameclass">
        <div class="fileSvgBox">
          <img src="@/assets/images/filetransfer/file.svg" alt="" />
        </div>
        <el-input v-model="fileName" class="input-bg" clearable></el-input>
      </div>
      <!-- 重命名 end -->

      <template #footer>
        <div class="dialogFooter borderTop" v-if="dialogType == 'move'">
          <div :underline="false" class="add" @click="handleMoveCreate">
            <div class="icon hpc_basic_icon_plus"></div>
            新建文件夹
          </div>
          <div>
            <el-button class="bgBtn" style="width: 100px;height: 36px;" text bg @click="cancelButton()">取消</el-button>
            <el-button style="width: 100px;height: 36px;" v-if="batchList.length > 0" class="primarybtn" type="primary"
              @click="handleBatchMove(0)">移动至此处</el-button>
            <el-button style="width: 100px;height: 36px;" v-else class="primarybtn" type="primary"
              @click="handleMove">移动至此处</el-button>
          </div>
        </div>
        <div class="dialogFooter borderTop" v-if="dialogType == 'copy'">
          <el-link :underline="false" class="add" @click="handleMoveCreate">
            <img src="@/assets/images/filetransfer/add.svg" alt="" />
            新建文件夹
          </el-link>
          <div>
            <el-button class="bgBtn" style="width: 100px;height: 36px;" text bg @click="cancelButton()">取消</el-button>
            <el-button style="width: 100px;height: 36px;" v-if="batchList.length > 0" class="primarybtn" type="primary"
              @click="handleBatchCopy(0)">复制至此处</el-button>
            <el-button style="width: 100px;height: 36px;" v-else class="primarybtn" type="primary"
              @click="handleCopy">复制至此处</el-button>
          </div>
        </div>
        <div class="dialogFooter flex-end" v-if="dialogType == 'create'">
          <el-button class="ghostbtn" @click="cancelButton()">取消</el-button>
          <el-button class="primarybtn" type="primary" @click="createFolder1(false)">确定</el-button>
        </div>
        <div class="dialogFooter flex-end" v-if="dialogType == 'edit'">
          <el-button class="ghostbtn" @click="cancelButton()">取消</el-button>
          <el-button class="primarybtn" type="primary" @click="handleEdit">确定</el-button>
        </div>
        <div class="dialogFooter flex-end" v-if="dialogType == 'rename'">
          <el-button class="primarybtn noBorder" style="width: 60px;height:36px " type="primary"
            @click="handleRename">确定</el-button>
        </div>
        <div class="dialogFooter flex-end" v-if="dialogType == 'delete'">
          <el-button class="ghostbtn" @click="cancelButton()">取消</el-button>
          <el-button v-if="isBatch" class="primarybtn" type="danger" @click="handleBatchDel()">确定</el-button>
          <el-button v-else class="primarybtn" type="danger" @click="handleDel()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 操作dialog end -->

    <!-- 删除dialog -->
    <el-dialog class="deletefileDialog" v-model="deletedialogVisible" title="删除文件" width="384" style="width: 384px">
      <!-- 删除文件 -->
      <div class="deletext" v-if="dialogType == 'delete'">
        文件删除后无法恢复，确定删除？
      </div>
      <!-- 删除文件 end -->

      <template #footer>
        <div class="dialogFooter flex-end" v-if="dialogType == 'delete'">
          <el-button class="ghostbtn" @click="deletedialogVisible = false">取消</el-button>
          <el-button v-if="isBatch" class="btn" type="danger" @click="handleBatchDel()">确定</el-button>
          <el-button v-else class="btn" type="danger" @click="handleDel()">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ArrowRight, Search } from "@element-plus/icons-vue";
import {
  computed,
  nextTick,
  onMounted,
  readonly,
  ref,
  watch,
  inject,
  shallowRef,
  reactive,
} from "vue";
import { Vue3Menus, menusEvent } from "vue3-menus";
import { useDropZone } from "@vueuse/core";
import { ElMessage, ElMessageBox } from "element-plus";
import { preview, vPreview, Vue3ImagePreview } from "vue3-image-preview";
import {
  getResource,
  postResource,
  patchResource,
  putResource,
  deleteResource,
  download,
  getPreview,
  batchDel,
  setZone,
} from "@/api/files";

// 设置请求头
import { useMineStore } from "@/store/mine";
const mineStore = useMineStore();
import { VAceEditor } from "vue3-ace-editor";
import { version as ace_version } from "ace-builds";
import ace from "ace-builds/src-min-noconflict/ace.js";
import modelist from "ace-builds/src-min-noconflict/ext-modelist.js";
// mitt
import Bus from "@/components/GlobalUploader/utils/bus.js";

// 接受父级参数
const props = defineProps({
  breadLabel: String,
  zoneName: String,
});
console.log(props);
// 文件大小format
import { partial } from "filesize";
const size = partial({ standard: "jedec" });

// 代码编辑器
const editObj = ref({});
const content = ref("");
const lang = ref("");
let aceEditor = null;
// 页面拖拽上传逻辑
const dropZoneRef = ref();
const globalUploader = inject("globalUploader");
const open = computed(() => globalUploader.value.panelShow);
const collapse = computed(() => globalUploader.value.collapse);
watch(
  () => globalUploader.value.collapse,
  (newValue, oldValue) => {
    console.log(newValue);
  }
);

const handleInput = (event) => {

  // 过滤掉斜杠
  fileName.value = fileName.value.replace(/\//g, '');
};

async function onDrop(files) {
  Bus.emit("setPath", {
    params: {
      path: supath.value + "/",
    },
    options: {
      target: `https://pan.${props.zoneName}.spacehpc.com:6002/file/upload`,
    },
  });
  if (files && files.length > 0) {
    files.map((item) => {
      // globalUploader.value.uploader.upload()
    });
  }
}
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

function clickUpload() {
  Bus.emit("openUploader", {
    params: {
      path: supath.value + "/",
    },
    options: {
      target: `https://pan.${props.zoneName}.spacehpc.com:6002/file/upload`,
    },
  });
}

const handleSelect = (row, column, cell, event) => {
  if (column.no == 0) {
    if (tableRef.value) {
      tableRef.value.toggleRowSelection(row);
    }
  }
  // 切换行的选中状态
};

function clickUploadFolder() {
  Bus.emit("openFolderUploader", {
    params: {
      path: supath.value + "/",
    },
    options: {
      target: `https://pan.${props.zoneName}.spacehpc.com:6002/file/upload`,
    },
  });
}
onMounted(() => {
  nextTick(() => {
    globalUploader.value.uploader.assignDrop(dropZoneRef.value);
  });
  ace.config.set(
    "basePath",
    `https://cdn.jsdelivr.net/npm/ace-builds@${ace_version}/src-min-noconflict/`
  );
  // 文件选择后的回调
  Bus.on("fileAdded", () => {
    console.log("文件已选择");
  });

  // 文件上传成功的回调
  Bus.on("fileSuccess", () => {
    console.log("文件上传成功");
    fetchData(supath.value);
  });
});

onBeforeUnmount(() => {
  Bus.off("fileAdded");
  Bus.off("fileSuccess");
  globalUploader.value.uploader.unAssignDrop(dropZoneRef.value);
});

// 鼠标右键菜单逻辑
const isOpen = ref(false);
const eventVal = ref({});
function rightClick(event) {
  isOpen.value = false;
  nextTick(() => {
    eventVal.value = event;
    isOpen.value = true;
  });
  event.preventDefault();
}
const rowRight = ref(false);
const rowsRight = ref(false);
const rowSelected = ref(null);
function handleRowRight(row, col, event) {
  selectedRow.value = row;
  if (batchList.value.length <= 1) {
    rowSelected.value = row;
    rowRight.value = false;
    nextTick(() => {
      eventVal.value = event;
      rowRight.value = true;
    });
  } else {
    rowsRight.value = false;
    nextTick(() => {
      eventVal.value = event;
      rowsRight.value = true;
    });
  }
  event.preventDefault();
  event.stopPropagation();
}
// reload页面
function reload() {
  listings.value.items = [];
  fetchData(supath.value);
}
// 文件操作弹窗交互逻辑
const fileName = ref("新建文件夹");
const dialogVisible = ref(false);
const deletedialogVisible = ref(false);
const dialogTitle = ref("移动至");
const dialogWidth = ref(550);
const dialogType = ref("move");
const selectedRow = ref({});
const createInput = ref(null);
const isBatch = ref(false);
function handleIcon(type, val, batch) {
  selectedRow.value = val;
  document.querySelector("#app").click();
  switch (type) {
    case "edit":
      dialogVisible.value = true;
      dialogTitle.value = val.name;
      editObj.value = val;
      content.value = val.content;
      lang.value = modelist.getModeForPath(val.path).name;
      dialogType.value = type;
      dialogWidth.value = 550;
      break;
    case "preview":
      dialogVisible.value = true;
      dialogTitle.value = val.name;
      dialogType.value = type;
      dialogWidth.value = 550;
      break;
    case "create":
      dialogVisible.value = true;
      dialogTitle.value = "新建文件夹";
      fileName.value = "新建文件夹";
      dialogType.value = type;
      dialogWidth.value = 300;
      nextTick(() => {
        setTimeout(() => {
          const input = createInput.value.$el.querySelector("input");
          input.select();
        }, 100);
      });
      break;
    case "move":
      dialogVisible.value = true;
      dialogTitle.value = "移动至";
      dialogType.value = type;
      dialogWidth.value = 550;
      isBatch.value = batch;
      handledFolder("/");
      break;
    case "copy":
      dialogVisible.value = true;
      dialogTitle.value = "复制到";
      dialogType.value = type;
      dialogWidth.value = 550;
      isBatch.value = batch;
      handledFolder("/");
      break;
    case "rename":
      fileName.value = val.name;
      dialogVisible.value = true;
      dialogTitle.value = "重命名";
      dialogType.value = type;
      dialogWidth.value = 300;
      break;
    case "delete":
      deletedialogVisible.value = true;
      dialogType.value = type;
      dialogWidth.value = 450;
      isBatch.value = batch;
      break;
  }
}
// 获取网盘目录
const listings = ref({
  items: [],
});
const isComputedSet = ref(false); // 标志，用于标记是否已经计算过
const computedOnce = ref(null); // 用于存储计算结果的响应式变量
const folders = computed(() => {
  // 如果已经计算过，直接返回之前的计算结果
  if (isComputedSet.value) {
    return computedOnce.value;
  }
  // 进行计算
  let data = [];
  if (listings.value) {
    data = listings.value.items.filter((item) => item.isDir == true);
    data.unshift({
      path: "/",
      name: "home",
      size: 7,
      extension: "",
      modified: "",
      mode: "",
      isDir: true,
      isSymlink: false,
      type: "",
    });
  }

  // 存储计算结果
  computedOnce.value = data;

  // 设置标志，表示已经计算过
  isComputedSet.value = true;
  return data;
});
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
// 监听路由参数的变化
watch(
  () => route.query.path,
  (newValue, oldValue) => {
    fetchData(route.query.path);
  },
);

const newValueData = ref('')

watch(
  () => mineStore.zoneName,
  async (newValue) => {
    query.value = "";
    newValueData.value = newValue
    // await setZone(newValue);
    fetchData();
  }
)
const paths = ref([]);
const moveFromPath = ref("");
const isSeted = ref(false);
const listingseted = ref({});
import { defineEmits } from "vue";
const emits = defineEmits(["backName"]);
const hidden = ref(false);
const query = ref("");
const showUpOperate = ref(true);
const loading = ref(false);
async function fetchData(path = "/") {
  console.log(props.zoneName, '1props');
  router.push({ path: "fileTransfer", query: { path: path } });
  moveFromPath.value = path;
  try {
    loading.value = true;
    if (newValueData.value) {
      await setZone(newValueData.value)
    } else {
      await setZone(props.zoneName)
    }
    const res = await getResource({
      path: path,
      hidden: hidden.value ? false : true,
      query: query.value,
    });
    if (res.code == 200) {
      supath.value = path;
      loading.value = false;
      const data = res.data;
      listings.value = res.data;
      paths.value = res.data.path.split("/").filter(Boolean);
      if (!isSeted.value) {
        listingseted.value = res.data;
        isSeted.value = true;
      }
      emits("backName", listings.value.name);
      if (listings.value.items.length > 0 && !query.value) {
        showUpOperate.value = false;
      } else {
        showUpOperate.value = true;
      }
    } else {
      ElMessage({
        message: "未获取到网盘数据",
        type: "warning",
      });
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
  }
}
fetchData();
function handleBred(index) {
  const routePath = paths.value.slice(0, index + 1).join("/");
  fetchData(routePath);
}
function handleMoveBred(index) {
  const routePath = movePaths.value.slice(0, index + 1).join("/");
  handledFolder(routePath);
}
function handleCellClick(row, col, cell, e) {
  if (col.label == "文件名") {
    handledbclick(row);
  }
}
// 双击文件夹
const supath = ref("");
const previewImg = ref(null);
const previewSrc = ref(null);
async function handledbclick(row) {
  supath.value = row.path;
  moveFromPath.value = row.path;
  selectedRow.value = row;
  if (row.isDir) {
    try {
      fetchData(row.path);
    } catch (error) {
      console.log(error);
    }
  } else {
    if (row.type == "image") {
      preview({
        images: `https://pan.${props.zoneName}.spacehpc.com:6002/file/image?path=${row.path}&auth=${mineStore.tokenInfo.token}`,
      });
      supath.value = "";
    } else if (row.type == "blob" || row.type == "audio") {
      ElMessage({
        message: "该文件不支持预览，请下载查看",
        type: "warning",
      });
      return;
    } else {
      try {
        const res = await getResource({ path: row.path });
        handleIcon("edit", res.data);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

// 创建文件夹
async function createFolder(move) {
  if (fileName.value.indexOf('/') !== -1) {
    ElMessage({
      type: "warning",
      message: '文件夹名称包含不支持的字符',
    });
    return;
  }
  const res = await postResource({
    path: supath.value + "/" + fileName.value + "/",
    override: false,
  });

  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "创建成功",
    });
    handledFolder(supath.value + "/" + fileName.value);
    if (move) {
      showNewFolderInput.value = false;
      handledFolder(supath.value + "/");
      return;
    }
    dialogVisible.value = false;
    fetchData(supath.value + "/");
  } else {
    ElMessage({
      type: "warning",
      message: res.message,
    });
  }
  fileName.value = "新建文件夹";
}// 创建文件夹
async function createFolder1(move) {
  // 校验文件夹名称是否包含不支持的字符
  if (fileName.value.indexOf('/') !== -1) {
    ElMessage({
      type: "warning",
      message: '文件夹名称包含不支持的字符',
    });
    return;
  }

  // 移除 supath 中可能存在的尾部斜杠和 fileName 中可能存在的前置斜杠
  let cleanSupath = supath.value.replace(/\/+$/, ''); // 移除尾部所有斜杠
  let cleanFileName = fileName.value.replace(/^\/+/, ''); // 移除前置所有斜杠

  const path = `${cleanSupath}/${cleanFileName}/`;

  // 打印调试信息以确认路径是否正确
  // console.log("cleanSupath:", cleanSupath);
  // console.log("cleanFileName:", cleanFileName);
  // console.log("path:", path);

  const res = await postResource({
    path,
    override: false,
  });

  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: res.message,
    });
    dialogVisible.value = false;
    fetchData(supath.value + "/");
  }
  else {
    ElMessage({
      type: "warning",
      message: res.message,
    });
  }
}
// 重命名逻辑
async function handleRename(item = selectedRow.value, batch) {
  try {
    const res = await patchResource({
      action: "rename",
      rename: true,
      override: false,
      destination: supath.value + "/" + fileName.value,
      path: selectedRow.value.path + (selectedRow.value.isDir ? "/" : ""),
    });
    if (res.code == 200) {
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      dialogVisible.value = false;
      currentItem.value = null;
      if (currentIndex.value < batchList.value.length - 1) {
        handleBatchRename(currentIndex.value + 1);
        return;
      } else {
        fetchData(supath.value);
        currentIndex.value = null;
      }
      // if(batch) {
      //     return
      // }
    } else {
      ElMessage({
        message: "修改失败",
        type: "warning",
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// 复制文件逻辑
async function handleCopy(item = selectedRow.value, batch) {
  console.log(moveToPath.value);
  console.log(item);
  const res = await patchResource({
    action: "copy",
    rename: true,
    override: false,
    path: item.path,
    destination: moveToPath.value + "/" + item.name,
  });
  if (res.code == 200) {
    ElMessage({
      message: "复制成功",
      type: "success",
    });
    dialogVisible.value = false;
    currentItem.value = null;
    if (currentIndex.value < batchList.value.length - 1) {
      handleBatchCopy(currentIndex.value + 1);
      return;
    } else {
      // fetchData(supath.value);
      currentIndex.value = null;
    }
  } else {
    ElMessage({
      message: res.message,
      type: "warning",
    });
  }
}
// 编辑文件逻辑
async function handleEdit() {
  supath.value = "";
  try {
    const params = { path: editObj.value.path };
    const data = content.value;
    const res = await putResource(params, data);
    console.log(res);
    if (res.code == 200) {
      ElMessage({
        message: "编辑成功",
        type: "success",
      });
      dialogVisible.value = false;
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
  } catch (error) { }
}
// 删除resource
async function handleDel(path = selectedRow.value.path, noMsg) {
  try {
    let obj = { path: path };
    const res = await batchDel(obj);
    if (res.code == 200) {
      if (!noMsg) {
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        deletedialogVisible.value = false;
        fetchData(supath.value + "/");
      }
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
  } catch (error) { }
}
// 点击移动窗口的文件夹
const moveFolders = ref([]);
const movePaths = ref([]);
const moveToPath = ref("");
async function handledFolder(path) {
  supath.value = path;
  moveToPath.value = path;
  const res = await getResource({ path });
  const resData = res.data;
  if (res.code == 200) {
    movePaths.value = res.data.path.split("/").filter(Boolean);
    // 进行计算
    let data = [];
    if (resData.items) {
      data = resData.items.filter((item) => item.isDir == true);
    }
    moveFolders.value = data;
  }
}
// 移动文件创建新文件夹
const newFolderInput = ref(null);
const showNewFolderInput = ref(false);
const newFolder = ref("新建文件夹");
function handleMoveCreate() {
  fileName.value = "新建文件夹";
  showNewFolderInput.value = true;
  nextTick(() => {
    setTimeout(() => {
      const input = newFolderInput.value.$el.querySelector("input");
      input.select();
    }, 100);
  });
}
function cancelButton() {
  supath.value = "";
  dialogVisible.value = false;
  showNewFolderInput.value = false;
}
async function handleMove() {
  try {
    if (batchList.value.length > 0) {
      selectedRow.value = batchList.value[currentIndex.value];
    }
    const res = await patchResource({
      action: "rename",
      rename: true,
      override: false,
      destination: moveToPath.value + "/" + selectedRow.value.name,
      path: selectedRow.value.path,
    });
    if (res.code == 200) {
      ElMessage({
        message: "移动成功",
        type: "success",
      });
      if (currentIndex.value < batchList.value.length - 1) {
        handleBatchMove(currentIndex.value + 1);
        return;
      } else {
        fetchData();
        currentIndex.value = null;
      }
      dialogVisible.value = false;
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// 复制绝对路径
const inlinePopover = ref(null);
import clipboard3 from "vue-clipboard3";
async function handleCopyPath(item) {
  const { toClipboard } = clipboard3();

  try {
    await toClipboard(item.path);
    currentItem.value = null;
    if (currentIndex.value < batchList.value.length - 1) {
      handleBatchCopy(currentIndex.value + 1);
      return;
    } else {
      currentIndex.value = null;
      clearSelection();
    }
    ElMessage({
      message: "复制成功",
      type: "success",
    });
  } catch (error) {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
}
function useDownloader(data, filename, contentType) {
  console.log("Creating blob");
  const blob = new Blob([data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  console.log("Starting download");
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  console.log("Download triggered");
}
function calculateDownloadSpeed(loaded) {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime; // 计算已经过去的时间（毫秒）
  const speed = loaded / elapsedTime; // 计算下载速度（字节/毫秒）

  // 将速度转换为 MB/s 或 KB/s
  let speedFormatted;
  if (speed >= 1024) {
    speedFormatted = (speed / 1024).toFixed(2) + " MB/s";
  } else {
    speedFormatted = speed.toFixed(2) + " KB/s";
  }

  return speedFormatted;
}
let startTime = new Date().getTime(); // 在下载开始时记录起始时间戳
// 下载逻辑
import axios from "axios";
import { reject } from "lodash";
const downloadList = ref([]);
const percentCompleted = ref("");
const downloadProgress = reactive({});
async function handleDownload(row) {
  let contentType = "";
  switch (row.type) {
    case "text":
      contentType = "text/html";
      break;
    case "blob":
      contentType = "application/octet-stream";
      break;
    case "image":
      contentType = "image/png";
      break;
    case "audio":
      contentType = "audio/mpeg";
      break;
    case "video":
      contentType = "video/mp4";
      break;
  }
  try {
    downloadList.value.push(row);
    Bus.emit("openDownload", downloadList.value);
    downloadProgress[row.id] = 0; // 初始化特定文件的进度
    startTime = new Date().getTime(); // 在下载开始时记录起始时间戳
    const encodedPath = encodeURIComponent(row.path); // 对 path 进行编码
    const res = await axios({
      method: "get",
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${mineStore.tokenInfo.token}` },
      url: `https://pan.${props.zoneName}.spacehpc.com:6002/file/download?path=${encodedPath}`,
      onDownloadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        const loaded = progressEvent.loaded; // 已下载的字节数
        const total = progressEvent.total; // 总字节数
        // 计算下载速度
        const speed = calculateDownloadSpeed(loaded);
        // console.log(`Download speed: ${speed}`);
        mineStore.updateDownloadSeed(row.path, speed);
        mineStore.updateDownloadProgress(row.path, progress);
        // console.log(
        //   `Download progress for ${row.name}: ${mineStore.downloadProgress[row.path]
        //   }%`
        // );
      },
    })
      .then((res) => {
        console.log(res.headers["content-disposition"]);
        const contentDisposition =
          res.headers["content-disposition"].split("=");
        const fileName = decodeURIComponent(contentDisposition[1]);
        if (res.status == 200) {
          downloadList.value = downloadList.value.filter(
            (obj) => JSON.stringify(obj) !== JSON.stringify(row)
          );
          Bus.emit("openDownload", downloadList.value);
          if (row.isDir) {
            useDownloader(res.data, row.name + ".tar.gz", contentType);
          } else {
            if (row.extension == fileName) {
              useDownloader(res.data, " " + fileName, "text/plain");
            } else {
              useDownloader(res.data, fileName, contentType);
            }
          }
        } else {
          // Handle other status codes if necessary
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error(error);
  }
}

// 批量处理逻辑
const tableRef = ref(null);
const batchList = ref([]);
let externalResolve;
function clearSelection() {
  batchList.value = [];
  tableRef.value.clearSelection();
}
function handleSelectionChange(list) {
  console.log(list);
  batchList.value = list;
}
// 判断某行是否被选中
const isRowSelected = (row) => {
  return batchList.value.includes(row);
};
//批量删除
async function handleBatchDel() {
  const promises = batchList.value.map((item) => batchDel(item));
  const results = await Promise.all(promises);
  const allSuccess = results.every(result => result.code === 200);
  deletedialogVisible.value = false;
  if (allSuccess) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    fetchData(supath.value + "/");
  } else {
    ElMessage({
      type: "warning",
      message: "删除失败",
    });
  }

  clearSelection();
}

// async function handleBatchDel() {
//   const params = batchList.value.map((item) => {
//     batchDel({ path: item.path });
//   });
//   await Promise.all(params);

//   if (res.code == 200) {
//     deletedialogVisible.value = false;
//     ElMessage({
//       message: "删除成功",
//       type: "success",
//     });
//     fetchData(supath.value + "/");
//   } else {
//     deletedialogVisible.value = false;
//     ElMessage({
//       type: "warning",
//       message: "删除失败",
//     });
//   }
// }
async function handleBatchDownload() {
  const promices = batchList.value.map((item) => {

    handleDownload(item);
  });
  await Promise.all(promices);
  clearSelection();
}
const currentIndex = ref(null);
const currentItem = ref(null);
async function handleBatchCopy(i) {
  if (batchList.value.length > 0) {
    currentIndex.value = i;
    currentItem.value = batchList.value[i];
    handleCopy(currentItem.value, true);
  } else {
    return;
  }
}
async function handleBatchRename(i) {
  if (batchList.value.length > 0) {
    currentIndex.value = i;
    currentItem.value = batchList.value[i];
    handleIcon("rename", currentItem.value, true);
  } else {
    return;
  }
}
async function handleBatchMove(i) {
  if (batchList.value.length > 0) {
    currentIndex.value = i;
    currentItem.value = batchList.value[i];
    handleMove(currentItem.value);
  } else {
    return;
  }
}
</script>
<style lang="less" scoped>
.disabled {
  opacity: 1;
  color: rgba(255, 255, 255, 0.85);
}

.pane_container {
  height: inherit;
  margin-top: 10px;

  .oprow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 17px;
    height: 22px;
    line-height: 20px;

    .search {
      display: flex;

      img {
        margin: 0 20px;
      }

      .refresh-btn {
        padding: 5px 10px;
        color: rgba(255, 255, 255, 0.6);
        background-color: rgba(11, 19, 32, 1);
        height: 32px;
        width: 32px;
      }

      .refresh-btn:hover {
        color: rgba(255, 255, 255, 0.85);
      }
    }

    :deep(.el-breadcrumb__inner) {
      font-size: 12px;
      font-weight: 400;
      // color: rgba(255,255,255,0.6);
    }

    :deep(.el-checkbox__label) {
      font-size: 12px;
      font-weight: 400;
      // color: rgba(255,255,255,0.6);
    }
  }

  :deep(.el-upload-dragger) {
    padding: 0;
  }

  .drop-border {
    border: 2px dashed rgba(255, 255, 255, 0.15);
  }

  .no-items {
    border: 2px dashed rgba(255, 255, 255, 0.15);
  }

  .pane_content {
    cursor: pointer;
    height: inherit;
    display: flex;
    flex-direction: column;
    position: relative;

    .overDrop {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2;

      .zhegai {
        position: absolute;
        top: 70%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .upIcon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        margin-bottom: 30px;
        border-radius: 50%;
        background: #3070e1;
      }
    }

    .upOperate {
      position: absolute;
      top: 242px;
      left: 635px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;

      .dropText {
        font-size: 18px;
        font-weight: 400;
        height: 28px;
        color: rgba(255, 255, 255, 0.6);
      }

      .or {
        margin: 30px 0;
        font-size: 14px;
        font-weight: 400;
        height: 22px;
        color: rgba(255, 255, 255, 0.3);
      }

      .actions {
        display: flex;
        text-align: center;

        .action {
          width: 90px;
          height: 100px;
          background: #26303e;
          border-radius: 8px 8px 8px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.6);

          img {
            margin-bottom: 10px;
          }
        }

        .action:hover {
          background: #1a2940;
        }

        .hoverImg1:hover {
          img {
            width: 24px;
            height: 24px;
            content: url("@/assets/images/filetransfer/newChecked.svg");
          }
        }

        .hoverImg2:hover {
          img {
            width: 24px;
            height: 24px;
            content: url("@/assets/images/filetransfer/upfileChecked.svg");
          }
        }

        .hoverImg3:hover {
          img {
            width: 24px;
            height: 24px;
            content: url("@/assets/images/filetransfer/upfilesChecked.svg");
          }
        }
      }
    }

    .plus {
      position: absolute;
      right: 20px;
      bottom: 20px;
      z-index: 1;
      width: 50px;
      height: 50px;
      background: #2156b3;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.85);
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.45);
    }

    .plusopen {
      bottom: 300px;
    }

    .plusopen2 {
      bottom: 70px;
    }

    .table {
      height: 100%;

      :deep(.el-table__row:hover .el-checkbox__inner) {
        // border: 2px solid #2696ff;
      }

      .name {
        display: flex;

        img {
          margin-right: 17px;
        }
      }

      .hoverMod {
        display: flex;

        .seat {
          width: 18px;
          height: 23px;
          display: flex;
          align-items: center;
        }
      }

      .hoverMod {
        .hoverMore {
          display: none;
        }

        .hoverMorenone {
          display: none;
        }

        .hoverMore:hover {
          color: #2696ff;
        }
      }

      .el-table__row:hover {
        .hoverMore {
          display: block;
        }
      }
    }

    .iconBar {
      display: flex;
      position: absolute;
      z-index: 3;
      bottom: 10%;
      left: 38%;
      padding: 16px 30px;
      background: #0b1320;
      border-radius: 10px 10px 10px 10px;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);

      img {
        margin-right: 30px;
      }

      .noMargin {
        margin: 0;
      }

      .hoverDownload:hover {
        width: 18px;
        height: 18px;
        content: url("@/assets/images/filetransfer/downloadHover.svg");
      }

      .hoverMove:hover {
        width: 18px;
        height: 18px;
        content: url("@/assets/images/filetransfer/moveHover.svg");
      }

      .hoverCopy:hover {
        width: 18px;
        height: 18px;
        content: url("@/assets/images/filetransfer/copyHover.svg");
      }

      .hoverRename:hover {
        width: 18px;
        height: 18px;
        content: url("@/assets/images/filetransfer/renameHover.svg");
      }

      .hoverdelete:hover {
        width: 18px;
        height: 18px;
        content: url("@/assets/images/filetransfer/deleteHover.svg");
      }

      .hoverMore:hover {
        width: 18px;
        height: 18px;
        content: url("@/assets/images/filetransfer/moreHover.svg");
      }

      .hoverClose:hover {
        width: 18px;
        height: 18px;
        content: url("@/assets/images/filetransfer/closeHover.svg");
      }
    }
  }
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: rgba(255, 255, 255, 0.6) !important;
}

:deep(.el-table__header-wrapper .el-table-column--selection)>.cell {
  border: none;
}

// dialog样式
:deep(.fileDialog) {
  background: #1d222a;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);
  border-radius: 10px 10px 10px 10px;
  --el-dialog-padding-primary: 15px 20px;

  .el-dialog__title {
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
  }

  .el-dialog__body {}

  .el-dialog__header {
    margin-bottom: 15px;
  }

  .ls {
    height: 476px;
    overflow: auto;
    padding: 5px 0px;

    .lsitem {
      display: flex;
      align-items: center;
      padding: 10px 10px;
      height: 46px;
      box-sizing: border-box;

      img {
        margin-right: 17px;
        height: 24px;
        width: 24px;
      }

      .inputIcon {
        margin-left: 10px;
        color: rgba(255, 255, 255, 0.6)
      }

      .inputIcon:hover {
        color: #2696ff
      }
    }

    .lsitem:hover {
      cursor: pointer;
      border-radius: 5px;
      background-color: #26303e;
    }
  }

  .fileSvgBox {
    display: flex;
    justify-content: center;
    margin: 60px 0;
  }

  .input-bg {
    height: 36px;
    width: 260px;
  }

  .el-dialog__footer {
    padding: 0;
  }

  .borderTop {
    border-top: 1px solid #26303e;
  }

  .flex-end {
    justify-content: flex-end !important;
  }

  .dialogFooter {
    display: flex;
    padding-top: 20px;
    justify-content: space-between;
    align-items: center;

    .add {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: #2696ff;
      line-height: 20px;
    }

    .add:hover {
      cursor: pointer;
      color: #69B7FF;
    }

    .el-button {
      width: 80px;
      font-size: 14px;
      font-weight: 500;
    }

    .el-button--primary {
      background: #2156b3;
    }

    .el-button--danger {
      margin-left: 20px;
      border: none;
      background: #df444d;
      color: rgba(255, 255, 255, 0.85);
    }

    .el-button--danger:hover {
      color: #ffffff;
      background: #ff5761;
    }
  }
}

:deep(.deletefileDialog) {
  background: #1d222a;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);
  border-radius: 10px 10px 10px 10px;
  --el-dialog-padding-primary: 16px 24px;
  .el-dialog__close.el-icon{
    color: rgba(255, 255, 255, 0.3);
    font-size: 16px !important;
  }
  .el-dialog__close.el-icon:hover{
    color: rgba(255, 255, 255, 0.85);
  
  }
  .el-dialog__title {
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
  }

  .deletext {
    font-size: 16px;
    font-weight: 400;
    margin: 15px 0px 15px 0px;
    color: rgba(255, 255, 255, 0.6);
  }

  .el-dialog__footer {
    padding: 0;
  }

  .el-button {
    width: 80px;
    font-size: 14px;
    height: 32px;
    font-weight: 500;
  }

  .el-button--primary {
    background: #2156b3;
  }

  .el-button--danger {
    margin-left: 10px;
    border: none;
    background: #c93a42;
    color: rgba(255, 255, 255, 0.85);
  }

  .el-button--danger:hover {
    color: #ffffff;
    background: #ff5761;
  }
}

// el-popover脱离原文本流，样式需写在最外层
.plusActions {

  box-sizing: border-box;
  padding: 25px 15px 15px 15px;

  hr {
    border: 0.5px solid #26303e;
    margin: 10px 0px 20px 0px;
    border: none;
    height: 1px;
    background-color: #26303e;
  }

  .plusAction {
    display: flex;
    background: inherit;
    border-radius: 8px 8px 8px 8px;
    align-items: center;
    padding: 5px 10px;
    font-family: Source Han Sans, Source Han Sans;
    font-size: 14px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    margin-bottom: 10px;
    height: 32px;
    box-sizing: border-box;

    img {
      margin-right: 8px;
      height: 16px;
    }
  }

  .plusAction:hover {
    background: #2156b3;
  }
}

:deep(.el-checkbox__inner) {
  height: 16px !important;
  width: 16px !important;
}

:deep(.el-checkbox__inner::after) {
  left: 5px;
  top: 2px;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner::before) {
  left: 4px !important;
  top: 6px !important;
}
</style>

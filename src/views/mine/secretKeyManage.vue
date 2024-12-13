<template>
  <div class="container secretKeyManage flex-1 flex-column">
    <div class="title">密钥管理</div>
    <div class="content secretKeyManage_con flex-1 flex-column">
      <div class="top">
        <div class="left">
          <el-button type="primary" @click="btnClick(1)" class="create_btn keyButton"><img
              src="@/assets/images/hosts/+.svg" style="margin-right: 6px; height: 16px; width: 16px"
              alt="" />创建密钥对</el-button>
          <el-button class="ghostbtn keyButton" style="border: 1px solid rgba(255, 255, 255, 0.15) ;margin-left: 10px;" color="#1D222A"
            @click="btnClick(3)"><img src="@/assets/images/hosts/del.svg"
              style="margin-right: 6px; height: 16px; width: 16px" alt="" />删除密钥对</el-button>
        </div>
        <div class="right">
          <el-input v-if="false" input-style="color:#FFFFFF;" style="width: 300px; height: 36px" v-model="search"
            placeholder="搜索" @keyup.enter="confimDialog(ruleFormRef)" :suffix-icon="Search">
          </el-input>
          <el-link 
            type="primary" 
            :underline="false" 
            href="https://help.spacehpc.com/document/vm_operation/how_to_use_ssh_for_login/how_to_use_ssh_for_login.html" 
            target="_blank"
            class="help">帮助</el-link>
        </div>
      </div>
      <!-- <div class="list flex-1 flex-column"> -->
      <el-table class="list table-container felx-1 flex-column" ref="multipleTableRef" :data="tableData.list"
        :row-style="{ height: '84px' }" empty-text=" " @selection-change="handleSelectionChange"
        header-row-class-name="table_top" row-class-name="table_cell" v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0)">
        <el-table-column type="selection" min-width="34" />
        <el-table-column label="密钥对名称" property="title" sortable min-width="224">
          <template #default="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="创建时间" sortable :sort-method="sortByDate" min-width="320">
          <template #default="scope">{{ scope.row.createdAt }}</template>
        </el-table-column>
        <el-table-column property="address" label="激活状态" min-width="210">
          <template #default="scope">
            <!-- <div style="display: flex; align-items: center">
                <span style="margin-left: 10px">{{ scope.row.address }}</span>
              </div> -->
            <el-switch v-model="scope.row.enabled" size="small" width="21px" @change="switchChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column property="fingerPrint" label="密钥对指纹" show-overflow-tooltip min-width="460" />
        <el-table-column label="操作" show-overflow-tooltip min-width="320">
          <template #default="scope">
            <div @click="sshDelClick(scope.row)" class="del_text">删除</div>
          </template>
        </el-table-column>
        <template #append v-if="(tableData.totalPage == 0 ||
          tableDatalistlength < queryParams.pageSize) &&
          !loading
          ">
          <div class="noMoreData flex-1">暂无更多</div>
        </template>
      </el-table>
      <div class="pagination-bar pagination">
        <el-pagination 
          class="input-bg" small 
          popper-class="pagination-bar" 
          @size-change="handleSizeChange"
          @current-change="handlePagination" 
          :current-page="queryParams.pageNum" 
          :total="tableDataTotal"
          :page-size="queryParams.pageSize" 
          :page-sizes="[10, 20, 30, 50]" layout="total,prev,pager,next,sizes,jumper">
        </el-pagination>
        <!-- </div> -->
        <!-- <div class="th"></div>
        <div class="item"></div> -->
      </div>
    </div>
    <!-- <div class="dialog" v-if="false">
      <div class="dialog_con">
        <div class="top">
          <div class="title">创建密钥对</div>
          <img
            src="@/assets/images/system/close_icon.png"
            alt=""
            class="close_icon"
          />
        </div>
        <div class="main"></div>
      </div>
    </div> -->
    <secretKeyDialog :names="names" :dialogType="dialogType" :isDialog="isDialog" @closeDialog="closeDialog"
      @confirmDialog="confirmDialog">
    </secretKeyDialog>
  </div>
</template>

<script setup>
import {
  getSshKey,
  sshFile,
  sshSave,
  sshList,
  sshDel,
  enabled,
} from "@/api/ssh";
import fileDownload from "js-file-download";
import { useMineStore } from "@/store/mine";
import { Calendar, Search, Plus, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
const search = ref("");
let tableData = ref({});
const tableDataTotal = ref(0)
let tableDatalistlength = ref(0);
const sortByDate = (obj1, obj2) => {
  let val1 = obj1.createdAt;
  let val2 = obj2.createdAt;
  return val1 - val2;
};

//弹窗组件
const secretKeyDialog = defineAsyncComponent(() =>
  import("./component/secretKeyDialog.vue")
);
const isDialog = ref(false); //弹窗开关
// dialogType= 1创建密码钥匙对 2导入密钥对 3删除密钥对
const dialogType = ref(0); //弹窗类型
const names = ref("");
const ids = ref([]);
const multipleTableRef = ref(null);
// 打开弹框
function btnClick(type, flag) {
  if (type == 1) {
  }
  if (type == 3) {
    if (!selectList.value.length && !flag) {
      ElMessage({
        message: "请先选择至少一条数据",
        type: "warning",
      });
      return;
    }
  }
  dialogType.value = type;
  isDialog.value = true;
}
// 子组件控制关闭弹窗
function closeDialog() {
  // console.log("closeDialog");
  isDialog.value = false;
}
// 子组件控制确定
function confirmDialog(obj = {}) {
  console.log("confirmDialog", obj);
  if (dialogType.value == 1) {
    if (obj.success) {
      getData();
      closeDialog();
    }
    return;
  }
  if (dialogType.value == 3) {
    sshDelFn();
    return;
  }
}

const selectList = ref([]);
// 监听选中数据
function handleSelectionChange(val) {
  console.log("handleSelectionChange", val);
  selectList.value = val;
  names.value = selectList.value.map((item) => item.title).join(" , ");
  ids.value = selectList.value.map((item) => item.id);
  console.log("handleSelectionChange1", names.value);
}

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 处理页码变化
function handlePagination(page) {
  queryParams.pageNum = page;
  getData();
}
// 处理每页条目
function handleSizeChange(size) {
  queryParams.pageSize = size;
  getData();
}

// 获取表格数据
const loading = ref(false);
function getData() {
  loading.value = true;
  sshList(queryParams).then((res) => {
    if (res.code == 200) {
      tableData.value = res.data;
      tableDataTotal.value = res.data.total
      tableDatalistlength.value = res.data.list.length;
      loading.value = false;
    } else {
      loading.value = false;
    }
  });
}
getData();

// 切换状态按钮
function switchChange(row) {
  let params = {
    enabled: row.enabled,
    id: row.id,
  };
  enabled(params).then((res) => {
    console.log(res.data);
    if (res.code == 200) {
      ElMessage({
        message: res.message,
        type: "success",
      });
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
    getData();
  });
}
const clearSelection = () => {
  if (multipleTableRef.value) {
    multipleTableRef.value.clearSelection();
  }
};
// 删除按钮
function sshDelClick(row) {
  multipleTableRef.value.clearSelection();
  selectList.value = [],
    names.value = row.title;
  ids.value = [row.id];
  btnClick(3, true);
}
// 删除接口
function sshDelFn() {
  let params = {
    ids: ids.value,
  };
  sshDel(params).then((res) => {
    if (res.code == 200) {
      ElMessage({
        message: res.message,
        type: "success",
      });
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
    closeDialog();
    getData();
  });
}
</script>

<style lang="less" scoped>
.secretKeyManage {
  padding: 20px 30px;
  margin: 0px 20px 20px 20px;
  position: relative;
  height: calc(100% - 60px);

  .title {
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.6);
  }

  .secretKeyManage_con {
    padding-top: 15px !important;
    padding-bottom: 0px !important;
    box-sizing: border-box;
    height: calc(100% - 40px);

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;

      .left {
        .keyButton {
          width: 122px;
          height: 36px;

          .el-icon {
            font-size: 16px;
          }
        }
      }

      .right {
        :deep(.el-input) {
          // opacity: 1;
          --el-input-placeholder-color: rgba(255, 255, 255, 0.3);
        }

        :deep(.el-input__wrapper) {
          background: #0b1320;
          border-radius: 8px 8px 8px 8px;
          border: none;
          // box-shadow: 0 0 0 1px #2696FF;
          box-shadow: 0 0 0 0;
        }

        :deep(.el-input__icon) {
          width: 16px;
          height: 16px;
          opacity: 1;
          color: rgba(255, 255, 255, 0.3);
        }

        :deep(.el-button) {
          color: #ffffff;
          width: 120px;
          height: 36px;
          border-radius: 50px 8px 8px 8px !important;
          overflow: hidden;
          opacity: 1;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .help {
          width: 28px;
          height: 21px;
          font-size: 14px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #2696ff;
          margin-left: 11px;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }

    .list {
      :deep(.table_top) {
        height: 42px;
        color: rgba(255, 255, 255, 0.6);

        th {
          background-color: #0b1320 !important;
          border-bottom: 0px solid #26303e;
        }

        .cell {

          font-size: 14px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          line-height: 20px;
        }
      }

      :deep(.table_cell) {
        background: #1d222a;


        tr {
          background: #1d222a;


          td.el-table__cell {
            border-bottom: 1px solid red;
          }
        }
      }

      .th {
        height: 42px;
        background: #0b1320;
      }
    }
  }
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;

  .dialog_con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 550px;
    min-height: 224px;
    background: #1d222a;
    border-radius: 10px;
    overflow: hidden;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #26303e;

      .title {
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
      }

      .close_icon {
        width: 24px;
        height: 24px;
        display: block;
        cursor: pointer;
      }
    }
  }

  //   z-index: 10;
}
</style>
<style lang="less" scoped>
:deep(.el-textarea__inner) {
  background: #0b1320;
  box-shadow: 0 0 0 1px #0b1320;
}

:deep(.el-switch__core) {
  background: rgba(0, 0, 0, 0.5);
  border: 0px;


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
  background: rgba(0, 0, 0, 0.5);
  border: 0px;
  width: 21px;
  height: 12px;
}

:deep(.el-checkbox__inner) {
  background: #26303e !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover>td) {
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
  width: 550px;
  // height: 175px;
  background: #1d222a !important;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
}

// 改

:deep(.el-dialog) {
  --el-bg-color: #1d222a !important;
  --el-dialog-bg-color: #1d222a !important;
  width: 550px;
  // height: 175px;
  background: #1d222a !important;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
  padding: 15px 20px;
  .dialog_title{
    line-height: 23px;
    height: 24px;
  }
  .dialog_footer{ 
    margin:20px 0px 25px 0px;
   
  }
}

:deep(.el-dialog__header) {

  padding-bottom: 15px;
  border-bottom: 1px solid #26303e;
  margin: 0;
  margin-bottom: 30px;
}

:deep(.el-dialog__headerbtn) {
  top: 2px;
}

:deep(.el-dialog__body) {
  padding: 0px 0px 0;
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
  padding-top: 0px;
}
</style>
<style>
.el-switch {
  --el-switch-on-color: #177ddc;
  /* 新的开关 "on" 状态颜色 */
}
</style>

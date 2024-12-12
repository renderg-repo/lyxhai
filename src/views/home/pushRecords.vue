<template>
  <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/dashboard' }">
      <span class="cbread">控制台</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item><span class="fw700 f14 cf85">到期删除通知预警推送记录</span></el-breadcrumb-item>
  </el-breadcrumb>
  <div class="pushRecords">
    <div class="title">推送记录</div>

    <div class="search">
      <el-input class="input-bg" placeholder="搜索实例 ID" v-model="searchValue" @change="searchChange" clearable
        :suffix-icon="Search" style="min-width: 300px; width: 300px"></el-input>
      <el-button @click="getlist()" class="ghostbtn universalMediumbtn" style="padding: 7px 16px 7px 14px">
        <i style="font-size: 16px; margin-right: 6px" class="spacehpc_iconfont hpc_basic_icon_refresh_bt"></i>
        刷新列表
      </el-button>
    </div>
    <div class="tablebox">
      <el-table class="list felx-1 flex-column" ref="multipleTableRef" :data="tableData" style="width: 100%"
        empty-text=" " header-row-class-name="table_top" row-class-name="table_cell" :height="tableheight"
        :row-style="{ height: '42px', color: 'rgba(255, 255, 255, 0.45)' }" :cell-style="cellStyle"
        v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
        <el-table-column label="实例ID" prop="triggerId" width="390">
        </el-table-column>
        <el-table-column label="预警原因" prop="templateName" width="300">
        </el-table-column>
        <el-table-column label="推送方式" width="320">
          <template #default="{ row }">
            {{
              pushChannel.find((item) => item.dictValue == row.channelId)
                .dictLabel
            }}
          </template>
        </el-table-column>

        <el-table-column label="推送时间" :cell-style="{ color: 'rgba(255, 255, 255, 0.85)' }" prop="sendAt" width="">
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
    </div>
    <div class="pagination-bar pagination">
      <el-pagination class="input-bg" popper-class="pagination-bar" @size-change="handleSizeChange"
        @current-change="handlePagination" :current-page="queryParams.pageNum" :total="totalCount"
        :page-size="queryParams.pageSize" :page-sizes="[10, 20, 30, 50]" layout="total,prev,pager,next,sizes,jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script setup>
import { ArrowRight } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { Calendar, Search, Plus, Delete } from "@element-plus/icons-vue";
import { msgRecord } from "@/api/dashboard";
import { queryDictType, queryDictData } from "@/api/dictionary";
const searchValue = ref("");
function searchChange() {
  queryParams.searchValue = searchValue;
  getlist();
}
const queryParams = reactive({
  searchValue: "",
  pageNum: 1,
  pageSize: 10,
});
const loading = ref(false);
const tableDatalistlength = ref(0);
const totalCount = ref(0);
const tableData = ref([]);
const pushChannel = ref([]);
async function getDictType() {
  try {
    const res = await queryDictData({ type: "pushChannel" });
    if (res.code == 200) {
      pushChannel.value = res.data;
    } else {
      console.log(res.message);
    }
  } catch (error) {
    console.log(error);
  }
}
getDictType();
function getlist() {
  loading.value = true
  msgRecord(queryParams).then((res) => {
    if (res.data) {
      tableData.value = res.data.list;
      tableDatalistlength.value = res.data.list.length;
      totalCount.value = res.data.total;
      loading.value=false
    } else {
      tableData.value = [];
      tableDatalistlength.value = 0;
      totalCount.value = 0;
      loading.value=false
    }
  });
}
getlist();

const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex == 1 || columnIndex == 3) {
    return { color: "rgba(255, 255, 255, 0.85)" };
  }
};
function handleSizeChange(val) {
  queryParams.pageSize = val;
  getlist();
}
function handlePagination(val) {
  queryParams.pageNum = val;
  getlist();
}
const tableheight = ref(0);
function checkHeight() {
  tableheight.value = window.innerHeight > 932 ? "100%" : 560;
}

// 在组件挂载时添加全屏事件监听器
onMounted(() => {
  window.addEventListener("resize", checkHeight);
  checkHeight(); // 初始检查
});

// 在组件卸载时移除全屏事件监听器
onUnmounted(() => {
  window.removeEventListener("resize", checkHeight);
});
</script>
<style lang="less" scoped>
@import '../../assets/css/pushRecords.less';
</style>

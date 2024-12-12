<template>
  <div class="container flex-column flex-1">
    <div class="bar">
      <div class="flex">
        <el-input class="shadow-none" v-model="queryParams.jobName" placeholder="搜索" :suffix-icon="Search" @change="getTasks"></el-input>
        <el-select class="select input-shadow" v-model="queryParams.state" placeholder="请选择" clearable @change="getTasks">
          <el-option label="所有任务" value=""></el-option>
          <el-option v-for="item in taskStates" :label="item.dictLabel" :value="item.dictValue"></el-option>
        </el-select>
      </div>
      <!-- <el-button :icon="Delete" @click="dev">幽灵按钮</el-button> -->
    </div>
    <!-- <div class="box flex-column flex-1 table-container"> -->
      <el-table class="box table-container flex-1" :data="taskData.list" empty-text=" "
        v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="任务名称" prop="jobName" sortable ></el-table-column>
        <el-table-column label="任务ID" prop="idJob" sortable ></el-table-column>
        <el-table-column label="执行状态" prop="state">
          <template #default="scope">
            <span v-if="scope.row.state" class="dot" :class="matchBg(scope.row.state)"></span>
            <span>{{ match(scope.row.state) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计算区" prop="nodelist"></el-table-column>
        <el-table-column label="开始时间" prop="timeStart" sortable></el-table-column>
        <el-table-column label="结束时间" prop="timeEnd" sortable></el-table-column>
        <!-- <el-table-column label="操作">
          <el-button text @click="dev">提交</el-button>
          <el-button text @click="dev">编辑</el-button>
        </el-table-column> -->
        <template #append v-if="(taskData.pageNum == taskData.totalPage || taskData.totalPage == 0) && !loading">
          <div v-if="queryParams.jobName && taskData.list == 0" class="noMoreData flex-1">
            搜索无结果
          </div>
          <div v-else class="noMoreData flex-1" >
            暂无更多
          </div>
        </template>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="queryParams.pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :total="taskData.total"
          :page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total,prev,pager,next,sizes,jumper"
          >
        </el-pagination>
      </div>
    <!-- </div> -->
  </div>
</template>

<script setup>
import { tasks } from '@/api/recharge';
import { queryDictType, queryDictData } from "@/api/dictionary";
import { ElMessage } from 'element-plus';
import { Search, Delete } from '@element-plus/icons-vue'
import { computed, reactive, ref } from 'vue';

// 获取任务状态字典
const taskStates = ref([]);
async function getDictData() {
  try {
    const res = await queryDictData({type: "jobState"});
    if(res.code == 200) {
      taskStates.value = res.data
      console.log(taskStates);
    } else {
      console.log(res.message)
    }
  } catch (error) {
    console.log(error)
  }
};
getDictData();
// 匹配任务状态
function match(val) {
  let text = "";
  
  taskStates.value.map(item => {
    if(item.dictValue == val) {
      text = item.dictLabel;
    }
  });
  return text;
};
// 匹配任务状态展示对应dot
function matchBg(val) {
  let bgc = "";
  switch(val) {
    case 0:
    bgc = "bgblue";
    break;
    case 1:
    bgc = "bgyellow";
    break;
    case 3:
    bgc = "bggreen";
    break;
    case 4:
    bgc = "bgred";
    break;
    case 6:
    bgc = "bgred";
    break;
  };
  return bgc;
}

// 查询参数
const queryParams = reactive({
  jobName: "",
  state: "",
  pageNum: 1,
  pageSize: 10
});
// 数据变量
let taskData = ref({
  list: [],
  pageNum: 1,
  totalPage: 1,
  total: 0
});
// 获取任务列表
const loading = ref(false)
async function getTasks() {
  loading.value = true
  try {
    const res = await tasks(queryParams);
    if(res.code == 200) {
      taskData.value = res.data
      loading.value = false
    } else {
      loading.value = false
      ElMessage({
        message: res.message,
        type: 'warning'
      })
    }
  } catch (error) {
    console.log(error)
    loading.value = false
  }
};
getTasks();
// 分页查询
function handlePageChange(currentPage) {
  queryParams.pageNum = currentPage;
  getTasks();
};
// 处理每页条目
function handleSizeChange(size) {
  queryParams.pageSize = size;
  getTasks();
};
// dev
function dev() {
  ElMessage({message: '功能开发中'})
}
</script>

<style lang="less" scoped>
.container {
  padding: 15px 20px;
  .flex {
    display: flex;
  }
  .bar {
    display: flex;
    justify-content: space-between;
    ::placeholder {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.30);
    }
    .select {
      width: 155px;
      margin-left: 10px;
    }
  }
  .box {
    margin-top: 15px;
    .dot::before {
      content: "";
      position: absolute;
      top: 21px;
      left: -2px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: inherit;
    }
    .bgblue {
      background-color: blue;
    }
    .bgyellow {
      background-color: yellow;
    }
    .bggreen {
      background-color: green;
    }
    .bgred {
      background-color: red;
    }
  }
}
</style>

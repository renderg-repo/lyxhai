<template>
  <div class="container accountDetail flex-column flex-1">
    <div class="title">账单明细</div>
    <div class="content flex-1 flex-column">
      <div class="flex justity-between">
        <div class="flex "> <el-input class="search_box input-bg mr10" v-model="queryParams.searchValue"
            @change="getOrders" placeholder="搜索实例 ID" clearable>
            <template v-slot:suffix>
              <i class="icon hpc_basic_icon_search f22"></i>
            </template>
          </el-input>
          <div class="refresh" @click="getOrders"> <i class="icon hpc_basic_icon_refresh_small"></i></div>
        </div>
        <div class="operate input-shadow">
          <el-date-picker clearable v-model="date" type="daterange" range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD" unlink-panels class="date-picker" @change="handlePicker"
            :default-value="[
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                1
              ),
              new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            ]">
          </el-date-picker>
          <el-button type="primary" class="primarybtn" @click="exportExcelDebounce" :loading="exportLoading">
            <img v-show="!exportLoading" src="@/assets/images/recharge/export.svg" style="padding-right:1px;" alt="" />
            <span style="margin-left: 5px;">导出账单</span>
          </el-button>
        </div>
      </div>
      <!-- <div class="table-container"> -->
      <el-table class="table table-container flex-1 flex-column" v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0)" :data="ordersData.list" empty-text=" "
        :row-style="{ height: '84px' }">
        <el-table-column label="流水号" prop="billNo" min-width="180px"> </el-table-column>
        <el-table-column label="交易时间" prop="paymentAt" min-width="180px">
          <template #default="scope">
            <div class="des">{{ scope.row.createdAt }}</div>
          </template>
        </el-table-column>
        <el-table-column label="交易类型" min-width="120px">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allConsumption || filters.isAllConsumption
                      ? ''
                      : ''
                      ">{{ column.label }}</span>
                    <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allConsumption || filters.isAllConsumption
                      ? 'check'
                      : ''
                      "></i>
                  </div>
                </template>
                <el-checkbox class="mb0" v-model="filters.allConsumption" :indeterminate="filters.isAllConsumption"
                  @change="handleCheckAllChange('Consumption', $event)">全部类型
                </el-checkbox>
                <el-divider />
                <el-checkbox-group class="checkGroup" v-model="filters.Consumption"
                  @change="handleCheckboxGroup('Consumption', $event)">
                  <el-checkbox v-for="item in allConsumption" :key="item.dictValue" :value="item.dictLabel">
                    {{ item.dictLabel }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-popover>
            </div>
          </template>
          <template #default="scope">
            <span v-if="scope.row.type">退款</span>
            <span v-else>消费</span>
          </template>
        </el-table-column>

        <el-table-column label=" 计费类型" prop="chargeType" min-width="130px">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allchargeType || filters.isAllchargeType ? '' : ''
                      ">{{ column.label }}</span>
                    <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allchargeType || filters.isAllchargeType ? 'check' : ''
                      "></i>
                  </div>
                </template>
                <el-checkbox class="mb0" v-model="filters.allchargeType" :indeterminate="filters.isAllchargeType"
                  @change="handleCheckAllChange('chargeType', $event)">全部类型
                </el-checkbox>
                <el-divider />
                <el-checkbox-group class="checkGroup" v-model="filters.chargeType"
                  @change="handleCheckboxGroup('chargeType', $event)">
                  <el-checkbox v-for="item in allchargeType" :key="item.dictValue" :value="item.dictLabel">
                    {{ item.dictLabel }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-popover>
            </div>
          </template>
          <template #default="scope">
            <span class="des">{{
              dictMate("chargeType", scope.row.chargeType)
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="产品">
          <template #default="scope">
            <span class="des">{{
              dictMate("product", scope.row.product)
            }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="交易金额" prop="tradeAmount" min-width="150px">
          <template #default="scope">
            <div v-if="!scope.row.tradeAmount">-</div>
            <div v-else>
              ￥{{ scope.row.type ? "+" : "-" }}{{ (scope.row.tradeAmount).toFixed(2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="原价" min-width="120px">
          <template #default="scope">
            <div v-if="!scope.row.expendAmount || scope.row.type">-</div>
            <div v-else>￥{{ (scope.row.expendAmount).toFixed(2) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" min-width="120px">
          <template #default="scope">
            <div v-if="!scope.row.discountAmount || scope.row.type">-</div>
            <div v-else>￥{{ (scope.row.discountAmount).toFixed(2) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="余额支付" min-width="120px">
          <template #default="scope">
            <div v-if="!scope.row.balanceAmount || scope.row.type">-</div>
            <div v-else>￥{{ (scope.row.balanceAmount).toFixed(2) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="支付券抵扣" min-width="120px">
          <template #default="scope">
            <div v-if="!scope.row.couponAmount || scope.row.type">-</div>
            <div v-else>￥{{ (scope.row.couponAmount).toFixed(2) }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="支付状态">
          <template #default="scope">
            <span :style="scope.row.payStatus == 2 ? 'color: rgba(223, 68, 77, 1)' : ''
              ">{{ dictMate("status", scope.row.payStatus) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="订单号" min-width="180">
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="() => router.push(`orderDetail/${scope.row.orderNo}`)">
              {{ scope.row.orderNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="账单详情" min-width="150px">
          <template #default="scope">
            <el-popover :offset="5" width="auto" popper-class="filterPop" popper-style="padding:30px !important;"
              :show-arrow="false" placement="bottom-start">
              <template #reference>
                <el-link type="primary" :underline="false">账单详情</el-link>
              </template>
              <div class="detail">
                <div class="item">
                  <span class="label">资源名称：</span>
                  <span class="value">{{ scope.row.resourceName }}</span>
                </div>
                <div class="hr"></div>
                <div class="item" v-if="!scope.row.type">
                  <span class="label">计费周期：</span>
                  <span class="value">
                    {{ scope.row.chargeFrom }} 至 {{ scope.row.chargeTo }}</span>
                </div>
                <div class="item" v-if="!scope.row.type">
                  <span class="label">计费时长：</span>
                  <span class="value"> {{ (scope.row.expendTimes).toFixed(2) }}小时</span>
                </div>
                <div class="item" v-if="!scope.row.type">
                  <span class="label"> 扣费原因：</span>
                  <span class="value">
                    {{ dictMate("chargeReason", scope.row.chargeReason) }}({{ dictMate("product", scope.row.product) }})
                  </span>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <template #append v-if="(ordersData.pageNum == ordersData.totalPage ||
          ordersData.totalPage == 0) &&
          !loading
          ">
          <div class="noMoreData flex-1">暂无更多</div>
        </template>
      </el-table>
      <!-- </div> -->
      <div class="pagination">
        <el-pagination 
          class="input-bg" 
          small 
          v-model:current-page="queryPage.pageNum"
          popper-class="pagination-bar" 
          @size-change="handleSizeChange"
          @current-change="handlePageChange" 
          :total="total"
          :page-size="queryPage.pageSize" 
          :page-sizes="[10, 20, 30, 50]" 
          layout="total,prev,pager,next,sizes,jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { orders, exportOrders, getbillList } from "@/api/recharge";
import { queryDictType, queryDictData } from "@/api/dictionary";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
let allProducts = ref([]),
  allchargeType = ref([]),
  allItems = ref([]),
  allpayMethod = ref([]),
  allStatus = ref([]),
  allConsumption = ref([
    { dictLabel: "消费", dictValue: "0" },
    { dictLabel: "退款", dictValue: "1" },
  ]),
  allChargeReason = ref([]);

const requiredDictTypes = ["chargeType", "orderProject", 'orderProduct', "chargeReason", "Project",];
async function getDictType() {
  try {
    const res = await queryDictType();
    if (res.code == 200) {
      const data = res.data;
      // 过滤出需要的字典类型
      const filteredData = data.filter(item => requiredDictTypes.includes(item.dictType));
      const promises = filteredData.map(async (item) => {
        const result = await queryDictData({ type: item.dictType });
        return { dictType: item.dictType, result };
      });
      const results = await Promise.all(promises);
      results.forEach((item) => {
        switch (item.dictType) {
          case "chargeType":
            allchargeType.value = item.result.data;
            break;
          case "orderProduct":
            allProducts.value = item.result.data;
            break;
          case "chargeReason":
            allChargeReason.value = item.result.data;
            break;
        }
      });
    } else {
      console.log(res.message);
    }
  } catch (error) {
    console.log(error);
  }
}
getDictType()

const filterCheck = ref(false);

const filters = reactive({
  user: "",
  products: [],
  chargeType: [],
  items: [],
  status: [],
  payMethod: [],
  Consumption: [],
  productsEcho: "",
  chargeTypeEcho: "",
  itemsEcho: "",
  ConsumptionEcho: "",
  statusEcho: "",
  payMethodEcho: "",
  allProducts: false,
  allchargeType: false,
  allItems: false,
  allStatus: false,
  allpayMethod: false,
  allConsumption: false,
  isAllProducts: false,
  isAllchargeType: false,
  isAllItems: false,
  isAllStatus: false,
  isAllpayMethod: false,
  isAllConsumption: false,
});

const queryParams = reactive({
  chargeType: "",
  endTime: "",
  searchValue: "",
  payStatus: "",
  payMethod: "",
  project: "",
  startTime: "",
  type: "",
});

const queryPage = reactive({
  pageNum: 1,
  pageSize: 10,
})

const total = ref(0)

function findDictLabel(dictArray, val) {
  const match = dictArray.find((item) => item.dictValue == val);
  return match ? match.dictLabel : "";
}

function dictMate(type, val) {
  switch (type) {
    case "product":
      return findDictLabel(allProducts.value, val);
    case "chargeType":
      return findDictLabel(allchargeType.value, val);
    case "items":
      return findDictLabel(allItems.value, val);
    case "status":
      return findDictLabel(allStatus.value, val);
    case "payMethod":
      return findDictLabel(allpayMethod.value, val);
    case "chargeReason":
      return findDictLabel(allChargeReason.value, val);
    default:
      return "";
  }
}

function handleCheckAllChange(type, val) {
  const dictMap = {
    products: allProducts,
    chargeType: allchargeType,
    items: allItems,
    status: allStatus,
    payMethod: allpayMethod,
    Consumption: allConsumption,
  };

  const dictArray = dictMap[type].value;
  const checks = dictArray.map((item) => item.dictLabel);
  const queryKeyMap = {
    products: "orderProduct",
    chargeType: "chargeType",
    items: "project",
    status: "payStatus",
    payMethod: "payMethod",
    Consumption: "type",
  };

  queryParams[queryKeyMap[type]] = val
    ? dictArray.map((item) => item.dictValue).join(",")
    : "";
  filters[type] = val ? checks : [];
  filters[`${type}Echo`] = val ? checks.join(" + ") : "";
  filters[`all${type}`] = val;
  filters[`isAll${type}`] = false;
  getOrders();
}

function handleCheckboxGroup(type, value) {
  const dictMap = {
    products: allProducts,
    chargeType: allchargeType,
    items: allItems,
    status: allStatus,
    payMethod: allpayMethod,
    Consumption: allConsumption,
  };

  const dictArray = dictMap[type].value;
  const queryKeyMap = {
    products: "orderProduct",
    chargeType: "chargeType",
    items: "project",
    status: "payStatus",
    payMethod: "payMethod",
    Consumption: "type",
  };

  queryParams[queryKeyMap[type]] = value
    .map((v) => {
      const match = dictArray.find((item) => item.dictLabel == v);
      return match ? match.dictValue : "";
    })
    .join(",");

  filters[`${type}Echo`] = value.join(" + ");
  filters[`all${type}`] = value.length == dictArray.length;
  filters[`isAll${type}`] = value.length > 0 && value.length < dictArray.length;
  getOrders();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 日期查询
const date = ref([]);
function handlePicker() {
  if (date.value && date.value.length > 0) {
    queryParams.startTime = date.value[0];
    queryParams.endTime = date.value[1];
  } else {
    queryParams.startTime = "";
    queryParams.endTime = "";
  }
  getOrders();
}
// 处理页码变化
function handlePageChange(currentPage) {
  console.log('currentPage', currentPage)
  queryPage.pageNum = currentPage;
  getOrders();
}
// 处理每页条目
function handleSizeChange(size) {
  queryPage.pageSize = size;
  getOrders();
}
// 获取帐单列表
const loading = ref(false);
const ordersData = ref({ list: [] });
async function getOrders() {
  ordersData.value = { list: [] };
  loading.value = true;
  const data = {...queryParams, ...queryPage}
  try {
    const res = await getbillList(data);
    if (res.code == 200) {
      loading.value = false;
      ordersData.value = res.data;
      total.value = res.data.total
    }
  } catch (error) {
    loading.value = false;
  }
}
getOrders();
// 处理异步excel数据
function exportExcel(data, name) {
  let blob = new Blob([data], { type: "application/vnd.ms-excel" }); // 设置文件类型excel
  let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
  // 创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
  let a = document.createElement("a");
  a.href = url;
  a.download = name + ".xlsx";
  a.click();
  // 释放这个临时的对象url
  window.URL.revokeObjectURL(url);
  ElMessage({
    type: "success",
    message: "导出成功",
  });
}
// 导出账单
import { debounce, throttle } from "@/utils/tools";
const exportExcelDebounce = throttle(handleExport, 1000);
const exportLoading = ref(false);
async function handleExport() {
  console.log(date.value, "date");
  if (date.value && date.value.length > 0) {
    exportLoading.value = true;
    const now = new Date().valueOf();
    try {
      // delete queryParams.pageNum;
      // delete queryParams.pageSize;
      const res = await exportOrders(queryParams);
      exportExcel(res, "订单" + now);
      exportLoading.value = false;
    } catch (error) {
      exportExcel(error, "订单" + now);
      exportLoading.value = false;
      console.log(error);
    }
  } else {
    ElMessage({
      type: "error",
      message: "请选择时间",
    });
  }
}
</script>

<style lang="less" scoped>
.container {
  margin: 0px 20px 20px 20px;
  height: calc(100% - 20px);
  padding: 20px 30px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);

  .title {
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    color: rgba(255, 255, 255, 0.6);
  }

  .content {
    height: calc(100% - 44px);
    padding: 15px 0px 0px 0px !important;

    .search_box {
      width: 300px;
    }

    .refund {
      color: red;
    }
  }

  .flex-row {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-left: 10px;
  }

  .iconHover {
    margin-left: 10px;
  }

  .iconHover:hover {
    cursor: pointer;
    color: rgba(38, 150, 255, 1);
  }

  .operate {
    display: flex;

    :deep(.date-picker) {
      height: 36px;
      width: 262px;
      box-sizing: border-box;

      .el-range__icon {
        order: 2;
        /* 调整图标的顺序，使其位于输入框内容的后面 */
        margin-left: 8px;
        /* 可以根据实际情况调整间距 */
      }
    }

    .primarybtn {
      margin-left: 10px;
      height: 36px;
      line-height: 24px;
      width: 108px;
    }

    .primarybtn:hover {
      color: rgba(255, 255, 255, 0.85);
      background: #2156b3;
      border: 1px solid #2156b3;
    }
  }

  .table {
    margin-top: 15px;

    .filter {
      .label {
        margin-right: 10px;
      }

      .check {
        color: rgba(38, 150, 255, 1);
      }
    }
  }

  .pagination {
    margin-top: 25px;
    display: flex;
    align-items: center;

    .el-input__wrapper {
      background: #0b1320;
      box-shadow: none;
    }
  }
}

.checkGroup {
  display: flex;
  flex-direction: column;
}

.accountDetail {
  height: -webkit-fill-available;

  .search_box {
    overflow: auto;
    height: 36px;

    :deep(.el-input__inner) {
      padding: 1px 12px;
      min-width: 100px;
    }
  }

  .el-table {
    th.el-table__cell {
      background-color: rgba(11, 19, 32, 1);
    }
  }

  ::placeholder {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
  }
}

:deep(.el-checkbox__inner:after) {
  height: 6px;
  left: 3px;
}

.des {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
}

:deep(.el-range-separator) {
  color: rgba(255, 255, 255, 0.3);
}

.filterPop {
  .detail {
    .item {
      .label {
        display: inline-block;
        width: 80px;
        text-align: right;
        color: rgba(255, 255, 255, 0.6);
      }

      .value {
        color: rgba(255, 255, 255, 0.85);
      }

      margin-bottom: 20px;
    }

    .hr {
      width: 100%;
      height: 1px;
      background: #26303E;
      margin-bottom: 20px;
    }

    .item:last-child {
      margin-bottom: 0;
    }
  }
}

:deep(.el-table-fixed-column--right) {
  background-color: #1d222a !important;
}
</style>

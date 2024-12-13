<template>
  <div class="container accountDetail flex-column flex-1">
    <div class="title">我的订单</div>
    <div class="content flex-1 flex-column">
      <div class="flex">
        <el-input 
          class="search_box input-bg" 
          v-model="queryParams.searchValue" 
          @change="getOrders"
          placeholder="搜索订单号、实例 ID"
           @input="getOrders" clearable>
          <template v-slot:suffix>
            <i class="icon hpc_basic_icon_search f22"></i>
          </template>
        </el-input>
        <div class="refresh" @click="getOrders"> <i class="icon hpc_basic_icon_refresh_small"></i></div>
        <div class="operate input-shadow align-center">

          <el-date-picker clearable v-model="date" type="daterange" range-separator="→" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD" unlink-panels class="date-picker" @change="handlePicker"
            :default-value="[
              new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
              new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            ]">
          </el-date-picker>
        </div>
      </div>

      <!-- <div class="loading-box"> -->
      <el-table class="table table-container flex-1 flex-column" v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0)" :data="ordersData.list" empty-text=" "
        :row-style="{ height: '84px' }">
        <el-table-column label="订单号" prop="orderNo" min-width="240"> </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" min-width="200" sortable>
          <template #default="scope">
            <div class="des">{{ scope.row.createdAt }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品" min-width="140">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allProducts || filters.isAllProducts ? '' : ''
                      ">{{ column.label }}</span>
                    <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allProducts || filters.isAllProducts ? 'check' : ''
                      "></i>
                  </div>
                </template>
                <el-checkbox class="mb0" v-model="filters.allProducts" :indeterminate="filters.isAllproducts"
                  @change="handleCheckAllChange('products', $event)">全部类型
                </el-checkbox>
                <el-divider />
                <el-checkbox-group class="checkGroup" v-model="filters.products"
                  @change="handleCheckboxGrop('products', $event)">
                  <el-checkbox v-for="item in allProducts" :key="item.dictValue" :value="item.dictLabel">
                    {{ item.dictLabel }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-popover>
            </div>
          </template>

          <template #default="scope">
            {{ dictMate("orderProduct", scope.row.product) }}
          </template>
        </el-table-column>
        <el-table-column label="资源名称" prop="resourceName" min-width="140">
          <template #default="scope">
            <span class="des">{{ scope.row.resourceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计费类型" prop="chargeType" min-width="160">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allchargeType || filters.isallchargeType ? '' : ''
                      ">{{ column.label }}</span>
                    <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allchargeType || filters.isallchargeType ? 'check' : ''
                      "></i>
                  </div>
                </template>
                <el-checkbox class="mb0" v-model="filters.allchargeType" :indeterminate="filters.isallchargeType"
                  @change="handleCheckAllChange('chargeType', $event)">全部类型
                </el-checkbox>
                <el-divider />
                <el-checkbox-group class="checkGroup" v-model="filters.chargeType"
                  @change="handleCheckboxGrop('chargeType', $event)">
                  <el-checkbox v-for="item in allchargeType" :key="item.dictValue" :value="item.dictLabel">
                    {{ item.dictLabel }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-popover>
            </div>
          </template>
          <template #default="scope">
            <span class="">{{
              dictMate("chargeType", scope.row.chargeType)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" prop="Project" min-width="140">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allProject || filters.isallProject ? '' : ''
                      ">{{ column.label }}</span>
                    <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allProject || filters.isallProject ? 'check' : ''
                      "></i>
                  </div>
                </template>
                <el-checkbox class="mb0" v-model="filters.allProject" :indeterminate="filters.isallProject"
                  @change="handleCheckAllChange('Project', $event)">全部类型
                </el-checkbox>
                <el-divider />
                <el-checkbox-group class="checkGroup" v-model="filters.Project"
                  @change="handleCheckboxGrop('Project', $event)">
                  <el-checkbox v-for="item in allProject" :key="item.dictValue" :value="item.dictLabel">
                    {{ item.dictLabel }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-popover>
            </div>
          </template>
          <template #default="scope">
            <span class="des">{{
              dictMate("Project", scope.row.project)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款状态" prop="payStatus" min-width="160">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allStatus || filters.isAllStatus ? '' : ''
                      ">{{ column.label }}</span>
                    <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allStatus || filters.isAllStatus ? 'check' : ''
                      "></i>
                  </div>
                </template>
                <el-checkbox class="mb0" v-model="filters.allStatus" :indeterminate="filters.isAllStatus"
                  @change="handleCheckAllChange('status', $event)">全部类型
                </el-checkbox>
                <el-divider />
                <el-checkbox-group class="checkGroup" v-model="filters.status"
                  @change="handleCheckboxGrop('status', $event)">
                  <el-checkbox v-for="item in allStatus" :key="item.dictValue" :value="item.dictLabel">
                    {{ item.dictLabel }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-popover>
            </div>
          </template>
          <template #default="scope">
            <span :style="scope.row.payStatus == 2 ? 'color: rgba(223, 68, 77, 1)' : 'color: rgba(0, 0, 0, 0.85)'
              ">{{ dictMate("status", scope.row.payStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" prop="expendAmount" min-width="170" sortable>
          <template #default="scope">
            <div>￥{{ (scope.row.tradeAmount).toFixed(2) }}</div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="详情" min-width="220">
          <template #default="scope">
            <el-link type="primary" :underline="false" class="linkbtn"
              @click="() => router.push(`orderDetail/${scope.row.orderNo}`)">查看详情</el-link>
          </template>
        </el-table-column>
        <template #append v-if="(ordersData.pageNum == ordersData.totalPage ||
          ordersData.totalPage == 0) &&
          !loading
          ">
          <div class="noMoreData flex-1">暂无更多</div>
        </template>
      </el-table>

      <div class="pagination">
        <el-pagination 
          class="input-bg" 
          small popper-class="pagination-bar" 
          @size-change="handleSizeChange"
          @current-change="handlePageChange" 
          :current-page="queryParams.pageNum" 
          :total="total"
          :page-size="queryParams.pageSize" 
          :page-sizes="[10, 20, 30, 50]" 
          layout="total,prev,pager,next,sizes,jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import {
  orders,
  exportOrders,
  getorderList,
  getbillList,
} from "@/api/recharge";
import { queryDictType, queryDictData } from "@/api/dictionary";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { functions } from "lodash";
// import { CustomInput } from './component/CustomInput.vue'
import CustomInput from './component/CustomInput.vue'; // 确保路径正确
const route = useRoute();
const router = useRouter();
// 获取数据字典
let allProducts = ref([]),
  allchargeType = ref([]),
  allpayMethod = ref([]),
  allorderProduct = ref([]),
  allStatus = ref([]),
  allProject = ref([]);
const showSuffixIcon = computed(() => queryParams.searchValue == '');

const requiredDictTypes = ["chargeType", "orderProject", "payStatus", 'orderProduct', "Project",];
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
          case "Project":
            allProject.value = item.result.data;
            break;
          case "payStatus":
            allStatus.value = item.result.data;
            break;
          case "payMethod":
            allpayMethod.value = item.result.data;
            break;
          case "orderProduct":
            allProducts.value = item.result.data;
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
// 筛选条件及选择所需变量
const filters = reactive({
  user: "",
  products: [],
  chargeType: [],
  Project: [],
  status: [],
  payMethod: [],
  Consumption: [],
  productsEcho: "",
  chargeTypeEcho: "",
  ConsumptionEcho: "",
  statusEcho: "",
  payMethodEcho: "",
  allProducts: false,
  allchargeType: false,
  allProject: false,
  allStatus: false,
  allpayMethod: false,
  allConsumption: false,
  isAllProducts: false,
  isallchargeType: false,
  isallProject: false,
  isAllStatus: false,
  isAllpayMethod: false,
  isAllConsumption: false,
});
// 查询参数
const queryParams = reactive({
  chargeType: "",
  endTime: "",
  searchValue: "",
  payStatus: "",
  payMethod: "",
  isRefund: "",
  project: "",
  startTime: "",
  type: "",
  pageNum: 1,
  pageSize: 10,
});

// 字典匹配

function dictMate(type, val) {
  let mate = "";
  switch (type) {
    case "orderProduct":
      allProducts.value.map((item) => {
        if (item.dictValue == val) {
          mate = item.dictLabel;
        }
      });
      break;
    case "chargeType":
      allchargeType.value.map((item) => {
        if (item.dictValue == val) {
          mate = item.dictLabel;
        }
      });
      break;
    case "Project":
      allProject.value.map((item) => {
        if (item.dictValue == val) {
          mate = item.dictLabel;
        }
      });
      break;
    case "status":
      allStatus.value.map((item) => {
        if (item.dictValue == val) {
          mate = item.dictLabel;
        }
      });
      break;
    case "payMethod":
      allpayMethod.value.map((item) => {
        if (item.dictValue == val) {
          mate = item.dictLabel;
        }
      });
      break;
    case "orderProduct":
      allorderProduct.value.map((item) => {
        if (item.dictValue == val) {
          mate = item.dictLabel;
        }
      });
      break;
    case "Project":
      allProject.value.map((item) => {
        if (item.dictValue == val) {
          mate = item.dictLabel;
        }
      });
      break;
  }
  return mate;
}
// 全选方法
function handleCheckAllChange(type, val) {
  switch (type) {
    case "products":
      const productchecks = allProducts.value.map((item) => {
        return item.dictLabel;
      });
      queryParams.product = val
        ? allProducts.value
          .map((item) => {
            return item.dictValue;
          })
          .join(",")
        : "";
      filters.products = val ? productchecks : [];
      filters.productsEcho = val ? productchecks.join(" + ") : "";
      filters.allProducts = val;
      filters.isAllProducts = false;
      break;
    case "chargeType":
      const sendchecks = allchargeType.value.map((item) => {
        return item.dictLabel;
      });
      queryParams.chargeType = val
        ? allchargeType.value
          .map((item) => {
            return item.dictValue;
          })
          .join(",")
        : "";
      filters.chargeType = val ? sendchecks : [];
      filters.chargeTypeEcho = val ? sendchecks.join(" + ") : "";
      filters.allchargeType = val;
      filters.isallchargeType = false;
      break;
    case "Project":
      const itemchecks = allProject.value.map((item) => {
        return item.dictLabel;
      });
      queryParams.project = val
        ? allProject.value
          .map((item) => {
            return item.dictValue;
          })
          .join(",")
        : "";
      filters.Project = val ? itemchecks : [];
      filters.ProjectEcho = val ? itemchecks.join(" + ") : "";
      filters.allProject = val;
      filters.isallProject = false;
      break;
    case "status":

      const statuschecks = allStatus.value.map((item) => {
        return item.dictLabel;
      });
      queryParams.payStatus = val
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
    case "payMethod":
      const payMethodchecks = allpayMethod.value.map((item) => {
        return item.dictLabel;
      });
      queryParams.payMethod = val
        ? allpayMethod.value
          .map((item) => {
            return item.dictValue;
          })
          .join(",")
        : "";
      filters.payMethod = val ? payMethodchecks : [];
      filters.payMethodEcho = val ? payMethodchecks.join(" + ") : "";
      filters.allpayMethod = val;
      filters.isAllpayMethod = false;
      break;
    case "Consumption":
      const Consumptionchecks = allConsumption.value.map((item) => {
        return item.dictLabel;
      });
      queryParams.isRefund = val
        ? allConsumption.value
          .map((item) => {
            return item.dictValue;
          })
          .join(",")
        : "";
      filters.Consumption = val ? Consumptionchecks : [];
      filters.ConsumptionEcho = val ? Consumptionchecks.join(" + ") : "";
      filters.allConsumption = val;
      filters.isAllConsumption = false;
      break;
  }
  getOrders();
}
// 多选组逻辑
function handleCheckboxGrop(type, value) {
  const checkedCount = value.length;
  if (checkedCount > 0) {
    filterCheck.value = true;
  } else {
    filterCheck.value = false;
  }
  switch (type) {
    case "products":
      queryParams.product = value
        .map((v) => {
          let check = "";
          allProducts.value.map((item) => {
            if (item.dictLabel == v) {
              check = item.dictValue;
            }
          });
          return check;
        })
        .join(",");
      filters.productsEcho = value.join(" + ");
      filters.allProducts = checkedCount == allProducts.value.length;
      filters.isAllProducts =
        checkedCount > 0 && checkedCount < allProducts.value.length;
      break;
    case "chargeType":
      queryParams.chargeType = value
        .map((v) => {
          let check = "";
          allchargeType.value.map((item) => {
            if (item.dictLabel == v) {
              check = item.dictValue;
            }
          });
          return check;
        })
        .join(",");
      filters.chargeTypeEcho = value.join(" + ");
      filters.allchargeType = checkedCount == allchargeType.value.length;
      filters.isallchargeType =
        checkedCount > 0 && checkedCount < allchargeType.value.length;
      break;
    case "Project": debugger
      queryParams.project = value
        .map((v) => {
          let check = "";
          allProject.value.map((item) => {
            if (item.dictLabel == v) {
              check = item.dictValue;
            }
          });
          return check;
        })
        .join(",");
      console.log(filters.allProject, '12');

      filters.allProject = checkedCount == allProject.value.length;
      console.log(filters.allProject, '12', checkedCount, allProject.value.length);
      filters.isallProject =
        checkedCount > 0 && checkedCount < allProject.value.length;
      break;
    case "status":
      let check = "";
      queryParams.payStatus = value.map((v) => {
        allStatus.value.map((item) => {
          if (item.dictLabel == v) {
            check = item.dictValue;
          }
        });
        return check;
      }).join(",");
      filters.statusEcho = value.join(" + ");
      console.log(filters.allStatus, '33', checkedCount);

      filters.allStatus = checkedCount == allStatus.value.length;
      console.log(filters.allStatus, '2  33', checkedCount);
      filters.isAllStatus =
        checkedCount > 0 && checkedCount < allStatus.value.length;
      console.log(filters.isAllStatus);

      break;
    case "payMethod":
      queryParams.payMethod = value
        .map((v) => {
          let check = "";
          allpayMethod.value.map((item) => {
            if (item.dictLabel == v) {
              check = item.dictValue;
            }
          });
          return check;
        })
        .join(",");
      filters.payMethodEcho = value.join(" + ");
      filters.allpayMethod = checkedCount == allpayMethod.value.length;
      filters.isAllpayMethod =
        checkedCount > 0 && checkedCount < allpayMethod.value.length;
      break;
    case "Consumption":
      queryParams.tradeType = value
        .map((v) => {
          let check = "";
          allConsumption.value.map((item) => {
            if (item.dictLabel == v) {
              check = item.dictValue;
            }
          });
          return check;
        })
        .join(",");
      filters.ConsumptionEcho = value.join(" + ");
      filters.allConsumption = checkedCount == allConsumption.value.length;
      filters.isAllpayMethod =
        checkedCount > 0 && checkedCount < allConsumption.value.length;
      break;
  }
  console.log(queryParams);
  getOrders();
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
  queryParams.pageNum = currentPage;
  getOrders();
}
// 处理每页条目
function handleSizeChange(size) {
  queryParams.pageSize = size;
  getOrders();
}
// 获取帐单列表
const loading = ref(false);
const ordersData = ref({ list: [] });
const total = ref(0)

async function getOrders() {
  // 开始加载时清空数据
  ordersData.value = { list: [] };
  loading.value = true;
  try {
    const res = await getorderList(queryParams);
    if (res.code == 200) {
      // 设置一个短暂的延迟，以确保 loading 效果可见
      setTimeout(() => {
        ordersData.value = res.data;
        loading.value = false;
        total.value = res.data.total
      }, 100); // 300ms 延迟，可以根据需要调整
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

getOrders();
function clearinput() {
  queryParams.searchValue = '';
  getOrders();

}
</script>

<style lang="less" scoped>
.container {
  padding: 20px 30px;
  margin: 0px 20px 20px 20px;
  height: calc(100% - 20px);

  .title {
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.6);
  }

  .content {
    padding: 15px 0px 0px 0px !important;
    height: calc(100% - 46px);

    .refresh {
      height: 36px;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0b1320;
      border-radius: 4px 4px 4px 4px;
      margin: 0px 10px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.6);

      .icon {
        font-size: 20px;
      }
    }

    .refresh:hover {
      color: rgba(255, 255, 255, 0.85)
    }

    .refresh:hover {
      color: rgba(255, 255, 255, 0.85)
    }

    .refresh:active {
      color: rgba(255, 255, 255, 0.6)
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
      width: 242px;

      .el-range__icon {
        order: 2;
        /* 调整图标的顺序，使其位于输入框内容的后面 */
        margin-left: 8px;
        /* 可以根据实际情况调整间距 */
      }
    }

    .primarybtn {
      margin-left: 20px;
      height: 36px;
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
    width: 300px;

    :deep(.el-input__inner) {

      min-width: 100px;
    }
  }

  .el-table {
    th.el-table__cell {
      background-color: rgba(11, 19, 32, 1);

      .cell {
        width: 100%;
      }
    }

  }

  ::placeholder {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
  }
}

.des {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.el-range-separator) {
  color: rgba(255, 255, 255, 0.3);
}

.filterPop {
  p {
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.6);
  }
}

:deep(.el-table-fixed-column--right) {
  background-color: #e9ebee !important;
}

:deep(.el-table .cell) {
  line-height: 22px;
}
</style>

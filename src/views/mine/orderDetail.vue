<template>
  <div class="page">
    <div class="page-header">
      <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/mine/orderlist' }">
          <span class="cbread">我的订单</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="fw700 f16 cf85" style="line-height: 23px"> 订单详情</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="content-card content-card1">
        <div class="header">订单概况</div>
        <div class="content">
          <div class="left">
            <el-descriptions :column="1">
              <el-descriptions-item label="订单编号：">{{ orderNo }}</el-descriptions-item>
              <el-descriptions-item label="订单状态：">{{
                dictMate("payStatus", OrderInfo.payStatus)
              }}</el-descriptions-item>
              <el-descriptions-item label="订单类型：">{{
                dictMate("Project", OrderInfo.project)
              }}</el-descriptions-item>
              <el-descriptions-item label="订单金额：">￥{{
                formatAmount(OrderInfo.tradeAmount)
              }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="right">
            <el-descriptions :column="1">
              <el-descriptions-item label="订单创建时间：">{{
                OrderInfo.createdAt
              }}</el-descriptions-item>
              <el-descriptions-item label="订单支付时间：">{{
                OrderInfo.paymentAt
              }}</el-descriptions-item>
              <el-descriptions-item label="计费方式：">{{
                dictMate("chargeType", OrderInfo.chargeType)
              }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
      <div class="content-card content-card2 ">
        <div class="header">
          <div v-if="OrderInfo.product == 'ai_disk'">磁盘信息</div>
          <div v-if="OrderInfo.product == 'ai_vm'">产品信息</div>
        </div>
        <div class="content">
          <div class="left">
            <el-descriptions :column="1">
              <el-descriptions-item label="产品名称：">{{
                dictMate("orderProduct", OrderInfo.product)
              }}</el-descriptions-item>
              <el-descriptions-item label="实例 ID：">{{
                OrderInfo.resourceName
              }}</el-descriptions-item>
              <el-descriptions-item label="GPU型号：" v-if="shouldShow">{{ OrderInfo.description
                }}</el-descriptions-item>
              <el-descriptions-item label="GPU数量：" v-if="shouldShow">{{ OrderInfo.useNum
                }}卡</el-descriptions-item>
              <el-descriptions-item label="购买时长：" v-if="
                OrderInfo.chargeType > 0 &&
                OrderInfo.type == 0 &&
                OrderInfo.project !== 'vmStorage'
              ">{{
                (OrderInfo.expendTimes / 24).toFixed(0)
              }}天</el-descriptions-item>
              <el-descriptions-item label="扩容容量：" v-if="OrderInfo.product == 'ai_disk'">{{ OrderInfo.useNum
                }}{{ OrderInfo.useUnit }}</el-descriptions-item>
              <el-descriptions-item label="起止时间：" v-if="
                OrderInfo.chargeType !== 0 && OrderInfo.project !== 'vmStorage'
              ">{{ OrderInfo.orderFrom }} -
                {{ OrderInfo.orderTo }}</el-descriptions-item>
              <el-descriptions-item label="日常费用：" v-if="shouldShowDailyCost">
                ￥{{ formatAmount(OrderInfo.dateAmount) }}/天

              </el-descriptions-item>
              <el-descriptions-item label="配置费用：" v-if="shouldShowConfigCost">
                ￥{{ formatAmount(OrderInfo.useUnitPrice) }}
                <span v-if="
                  OrderInfo.chargeType == 0 && OrderInfo.project !== 'vmStorage'
                ">/时</span>
                <span v-if="
                  OrderInfo.chargeType == 1 || OrderInfo.project == 'vmStorage'
                ">/天</span>
                <span v-if="OrderInfo.chargeType == 2">/月</span>
                <!-- <div class="content_tip">
                  若价格发生变动，以实例开机时的价格为结算价格
                </div> -->
              </el-descriptions-item>
              <el-descriptions-item label="付费容量：" v-if="shouldShowDailyCost">
                <span>{{ diskUseUnitPrice || 0 }} GB</span>
              </el-descriptions-item>

            </el-descriptions>
            <div class="content_tip">
              <el-popover popper-class="notice_pop" placement="top" :offset="10" trigger="hover" width="auto"
                popper-style="padding: 5px 8px;">
                <template #reference>
                  <i class="icon hpc_basic_icon_info_filled" style="font-size: 16px"></i>
                </template>
                <div class="notice_card">
                  <div class="notice_content" style="color: rgba(255, 255, 255, 0.85)">
                    无论是否关机均会产生的费用。比如付费磁盘（折扣同会员折扣）
                  </div>
                </div>
              </el-popover>
              若价格发生变动，以实例开机时的价格为结算价格
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getOrderInfo } from "@/api/recharge";
import { ArrowRight } from "@element-plus/icons-vue";
import { queryDictType, queryDictData } from "@/api/dictionary";

const route = useRoute();
const orderNo = ref(route.params.orderNo);
const OrderInfo = ref({});
// 数据加载状态
const isDataLoaded = ref(false);
const allDicts = reactive({
  products: [],
  payMethod: [],
  orderProduct: [],
  payStatus: [],
  project: [],
  chargeType: [],
});
const requiredDictTypes = [
  "orderProductType",
  "payMethod",
  "orderProduct",
  "payStatus",
  "chargeType",
  "Project",
];
const fetchOrderInfo = async () => {
  try {
    const res = await getOrderInfo({ orderNo: orderNo.value });
    if (res.code == 200) {
      OrderInfo.value = res.data; // 直接赋值给 OrderInfo.value
      // 设置数据加载状态为 true
      isDataLoaded.value = true;
      console.log('Order info fetched:', OrderInfo.value);
      console.log('Data loaded status:', isDataLoaded.value);

    } else {
      console.error(res.message);
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchDicts = async () => {
  try {
    const promises = requiredDictTypes.map(async (dictType) => {
      const result = await queryDictData({ type: dictType });
      return { dictType, result };
    });
    const results = await Promise.all(promises);
    results.forEach((item) => {
      if (item.result && item.result.data) {
        allDicts[item.dictType] = item.result.data;
      } else {
        console.error(`No data found for dictType: ${item.dictType}`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const dictMate = (type, val) => {
  const dict = allDicts[type] || [];

  const match = dict.find((item) => item.dictValue == val);
  return match ? match.dictLabel : "";
};
// 方法来查找指定类型的 useUnitPrice
const findInfos = (infos, type) => {
  if (infos) {
    for (const item of infos) {
      if (item.type === type) {
        return item.useNum;
      }
    }
  }
  return null;
};
// 计算属性来获取 type 为 'disk' 的 useUnitPrice
const diskUseUnitPrice = computed(() => {
  if (isDataLoaded.value && OrderInfo.value && OrderInfo.value.configInfos) {

    return findInfos(OrderInfo.value.configInfos, 'disk');
  }
  return null;
});
const formatAmount = (amount) =>
  amount !== undefined && amount !== null ? amount.toFixed(2) : "0.00";

const shouldShowDailyCost = computed(() => {
  return OrderInfo.value && ['ai_vm', 'ai_disk'].includes(OrderInfo.value.product);
});
const shouldShow = computed(() => {
  return OrderInfo.value && !['ai_netdisk', 'ai_uimage', 'ai_disk'].includes(OrderInfo.value.product);
});

const shouldShowConfigCost = computed(
  () =>
    OrderInfo.useUnitPrice &&
    OrderInfo.product == "ai_vm" &&
    OrderInfo.chargeType == 0
);

fetchOrderInfo();
fetchDicts();
</script>

<style lang="less" scoped>
.page {
  box-sizing: border-box;
  margin-top: 28px
}

.page-content {
  margin: 20px;

  .content-card {
    padding: 20px 30px 0px 30px;
    display: flex;
    flex-flow: column;
    box-sizing: border-box;
    position: relative;
    z-index: 1;

    .header {
      line-height: 26px;
      font-weight: 400;
      font-size: 18px;
      font-weight: 700;
    }

    :deep(.el-descriptions__cell :first-child) {
      padding-bottom: 0px;
    }

    :deep(.el-descriptions__cell) {
      padding-bottom: 14px;

      .el-descriptions__label {
        --el-text-color-primary: rgba(0, 0, 0, 0.3);
        display: inline-block;
        width: 74px;
        text-align: right;
        margin-right: 10px;
        line-height: 22px;
      }

      .el-descriptions__content {
        --el-text-color-regular: rgba(0, 0, 0, 0.6);


      }


    }

    .content_tip {
      color: rgba(0, 0, 0, 0.3);
      font-size: 12px;
      line-height: 17px;
      display: flex;
      margin-bottom: 20px;
      place-items: center;

      .icon {
        margin-right: 6px
      }
    }

    .content {
      padding-top: 15px;
      display: flex;

      .left {

        margin-right: 123px;
        margin-left: -3px;
      }

      .right {

        :deep(.el-descriptions__label) {
          width: 98px;
        }
      }
    }
  }

  .content-card1 {
    box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.64), 0px 3px 6px 0px rgba(0, 0, 0, 0.48), 0px 5px 12px 1px rgba(0, 0, 0, 0.36);
    padding-bottom: 5px
  }

  .content-card2 {
    box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.64), 0px 3px 6px 0px rgba(0, 0, 0, 0.48), 0px 5px 12px 1px rgba(0, 0, 0, 0.36);
    margin-top: 17px;
  }
}
</style>

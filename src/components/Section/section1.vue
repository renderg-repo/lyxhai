<template>
  <!-- 性能强大 经济实惠 -->
  <div class="price-detail flex-align-center flex-column-direction">
    <h2 class="section-title mb60">性能强大 经济实惠</h2>
    <div class="price-detail-content mb30">
      <div class="price-detail-tab flex-center">
        <a 
          class="price-detail-tab-item" 
          v-for="(item, index) in tabList" 
          :key="item.id" 
          :class="{active: activeIndex == index}" 
          @click="handleTabClick(index)">
          {{ item.title }}
        </a>
      </div>

      <div class="price-detail-box flex-align-center flex-wrap">
        <div class="price-detail-item flex-column-direction" v-for="(item, index) in detailList" :key="item.id">
          <div class="price-detail-item-header flex-center flex-between">
            <div class="price-detail-item-title">
              <span>{{ item.gpu }}</span>
              <span v-if="item.vram"> / {{ item.vram }}GB</span>
            </div>
            <div class="flex-align-center">
              <div class="fire-icon-box flex-center flex-align-center" v-if="item.recommend">
                <el-image class="icon" :src="iconUrl"></el-image>
              </div>
              <div v-if="item.mark" class="tag-icon" :style="{background: `var(--${getMarkStyle(item)})`}">{{ item.mark }}</div>
            </div>
          </div>
          <div class="price-detail-item-content flex-between flex-align-end">
            <div>
              <p>单精度：{{ item.singlePrecision }} TFLOPS</p>
              <p>半精度：{{ item.halfPrecision }} Tensor TFL</p>
            </div>
            <div class="flex-align-end">
              <!-- 原价 -->
              <span class="original-price">
                ¥{{ (getUnitAndPrice(item).price/0.6).toFixed(2) }}/{{ getUnitAndPrice(item).unit }}
              </span>
              <!-- 现价 -->
              <span style="font-family: PingFang SC-Light;">
                ¥<span class="price-text">{{ getUnitAndPrice(item).price }}</span>/{{ getUnitAndPrice(item).unit }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <p class="section-description">更多型号海量供应，包日包月价格更低！</p> -->
  </div>
</template>

<script>
import api from "../../assets/js/api";
export default {
  data() {
    return {
      activeIndex: 0,
      tabList: [
        {
          id: 1,
          title: "按量",
        },
        {
          id: 2,
          title: "包日",
        },
        {
          id: 3,
          title: "包月",
        },
      ],
      iconUrl: require("../../assets/image/index/price_detail/recommend.png"),
      detailList: [
        {
          id: 1,
          title: "RTX 4090 / 24GB",
          tag: "推荐",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "main-color"
        },
        {
          id: 2,
          title: "RTX 3090 / 24GB",
          tag: "特价",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "warning-color"
        },
        {
          id: 3,
          title: "RTX 4090D / 24GB",
          tag: "独家",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "error-color"
        },
        {
          id: 4,
          title: "RTX 4090D / 24GB",
          tag: "",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
        },
        {
          id: 5,
          title: "RTX 4090 / 24GB",
          tag: "推荐",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "main-color"
        },
        {
          id: 6,
          title: "RTX 3090 / 24GB",
          tag: "特价",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "warning-color"
        },
        {
          id: 7,
          title: "RTX 4090D / 24GB",
          tag: "独家",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "error-color"
        },
        {
          id: 8,
          title: "RTX 4090D / 24GB",
          tag: "",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
        },
        {
          id: 9,
          title: "RTX 4090 / 24GB",
          tag: "推荐",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
            unit: "时",
          color: "main-color"
        },
        {
          id: 10,
          title: "RTX 3090 / 24GB",
          tag: "特价",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "warning-color"
        },
        {
          id: 11,
          title: "RTX 4090D / 24GB",
          tag: "独家",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时",
          color: "error-color"
        },
        {
          id: 12,
          title: "RTX 4090D / 24GB",
          tag: "",
          single_precision: 82.58,
          half_precision: 164.5,
          price: 2.58,
          unit: "时"
        },
      ]
    }
  },
  computed: {
    // mark框样式
    getMarkStyle() {
      return (item) => {
        let color;
        if (item.mark == "NEW") {
          color = "new-color";
        } else if (item.mark == "独家") {
          color = "new-color";
        } else if (item.mark == "推荐") {
          color = "recommend-color";
        } else if (item.mark == "特价") {
          color = "warning-color"
        }else {
          color = "recommend-color";
        }
        return color;
      }
    },
    // 转换单位和价格
    getUnitAndPrice() {
      return (item) => {
        switch (this.activeIndex) {
          case 0:
            return { unit: "时", price: item.unitPrice.toFixed(2) };
          case 1:
            return { unit: "天", price: item.dayPrice.toFixed(2) };
          case 2:
            return { unit: "月", price: item.monthPrice.toFixed(2) };
          default:
            return { unit: "", price: "" };
        }
      }
    },
  },
  created() {
    // 获取GPU配置
    try {
      api.getGpuConfig().then(res => {
        // console.log(res);
        res.forEach(item => {
          item["unit"] = "时";
          item["day"] = "天";
          item["month"] = "月";
        });
        this.detailList = res;
      })
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    handleTabClick(index) {
      this.activeIndex = index;
    },
    
  }
}
</script>

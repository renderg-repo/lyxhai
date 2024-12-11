<template>
<div class="computing ">
  <div class="computing-box ">
    <div class="computing-item" v-for="(item, index) in computingList" :key="item.id" :class="getClassArray(item.id)">
      <template v-if="item.id == 1">
        <div class="item-img-box first" :class="getMarginDirection(item.id)">
          <template v-if="screenWidth > 768">
            <el-image :src="item.image_xl"></el-image>
          </template>
          <template v-if="screenWidth > 500 && screenWidth <= 768">
            <el-image :src="item.image_sm"></el-image>
          </template>
          <template v-if="screenWidth <= 500">
            <el-image :src="item.image_xs"></el-image>
          </template>
        </div>
        <div class="detail-box first">
          <h2>{{item.title}}</h2>
          <p v-html="item.description" class="description"></p>
          <ul>
            <li class="comput-item flex-align-center ">
              <p class="comput-item-title">CPU：</p>
              <p>{{item.cpu}}</p>
            </li>
            <li class="comput-item flex-align-center ">
              <p class="comput-item-title">GPU：</p>
              <p>{{item.gpu}}</p>
            </li>
            <li class="comput-item flex-align-center ">
              <p class="comput-item-title">内存：</p>
              <p>{{item.memory}}</p>
            </li>
            <li class="comput-item flex-align-center ">
              <p class="comput-item-title">网卡：</p>
              <p>{{item.network}}</p>
            </li>
            <li class="comput-item flex-align-center ">
              <p class="comput-item-title">系统盘：</p>
              <p>{{item.system_disk}}</p>
            </li>
            <li class="comput-item flex-align-center ">
              <p class="comput-item-title">价格：</p>
              <p>{{item.price}}</p>
            </li>
            <li class="comput-item flex-align-center ">
              <p class="comput-item-title">售后：</p>
              <p>{{item.after_sales}}</p>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="item-img-box" :class="getMarginDirection(item.id)">
          <template v-if="screenWidth > 500">
            <el-image :src="item.image_xl"></el-image>
            <el-image :src="item.image_xl" class="reflection"></el-image>
          </template>
          <template v-else>
            <el-image :src="item.image_xs"></el-image>
            <el-image :src="item.image_xs" class="reflection"></el-image>
          </template>
        </div>
        <div class="detail-box">
          <h2>{{item.title}}</h2>
          <p v-html="item.description" :class="getItemTextAlign(item.id)" class="description"></p>
          <ul>
            <li class="comput-item flex-align-center flex-between">
              <div class="flex" :class="getItemTextAlign(item.id)">
                <p class="comput-item-title">CPU：</p>
                <p>{{item.cpu}}</p>
              </div>
            </li>
            <li class="comput-item flex-align-center flex-between">
              <div class="flex" :class="getItemTextAlign(item.id)">
                <p class="comput-item-title">GPU：</p>
                <p>{{item.gpu}}</p>
              </div>
            </li>
            <li class="comput-item flex-align-center flex-between">
              <div class="flex" :class="getItemTextAlign(item.id)">
                <p class="comput-item-title">内存：</p>
                <p>{{item.memory}}</p>
              </div>
            </li>
            <li class="comput-item flex-align-center flex-between">
              <div class="flex" :class="getItemTextAlign(item.id)">
                <p class="comput-item-title">网卡：</p>
                <p>{{item.network}}</p>
              </div>
            </li>
            <li class="comput-item flex-align-center flex-between">
              <div class="flex" :class="getItemTextAlign(item.id)">
                <p class="comput-item-title">系统盘：</p>
                <p>{{item.system_disk}}</p>
              </div>
            </li>
            <li class="comput-item flex-align-center flex-between">
              <div class="flex" :class="getItemTextAlign(item.id)">
                <p class="comput-item-title">价格：</p>
                <p>{{item.price}}</p>
              </div>
            </li>
            <li>
              <div class="flex" :class="getItemTextAlign(item.id)">
                <p class="comput-item-title">售后：</p>
                <p>{{item.after_sales}}</p>
              </div>
            </li>
          </ul>
          <!-- <p :class="getItemTextAlign(item.id)">
            <span>数据盘：</span>
            <span>{{item.data_disk}}</span>
          </p> -->
        </div>
      </template>
    </div>
  </div>
  <!-- <div class="computing-footer flex-center flex-align-center">
    <span class="mr20">专业支持：</span>
    <span class="mr20">{{ name }}</span>
    <span>{{ phone }}</span>
  </div> -->
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
export default {
  name: 'Computing',
  computed: {
    ...mapGetters(["screenWidth"]),
    getClassArray() {
      return (id) => {
        let arr = [];
        if (this.screenWidth > 768) {
          if (id % 2 == 0) {
            arr = [ 'flex-row-reverse', 'flex-center'];
          } else {
            if (id === 1) {
              arr = ['flex-align-start', 'flex-center'];
            }
            if (id === 3) {
              arr = ['flex-center'];
            }
          }
        } else {
          arr = ['flex-column-direction', 'flex-align-center', 'flex-center'];
        }
        return arr;
      }
    },
    // 获取文字对其方式
    getItemTextAlign() {
      return (id) => {
        if (this.screenWidth > 768) {
          if (id % 2 == 0) {
            // return ['text-align-right'];
          }
          return [];
        }
        return [];
      }
    },
    getMarginDirection() {
      return (id) => {
        let directionValue = "",
        marginValue = 0;
        if (id % 2 == 0) {
          directionValue = "ml"
        } else {
          directionValue = "mr"
        }
        if (this.screenWidth >= 1440) {
          // marginValue = 140;
        } else if (this.screenWidth > 768 && this.screenWidth < 1440) {
          marginValue = 20;
        } else {
          marginValue = 0;
        }
        return directionValue + marginValue;
      }
    }
  },
  data() {
    return {
      computingList: [{
          id: 1,
          title: 'AMD 7532 双路4卡4090D工作站',
          image_xl: require('../../assets/image/computing/computing01-xl.png'),
          image_sm: require('../../assets/image/computing/computing01-sm.png'),
          image_xs: require('../../assets/image/computing/computing01-xs.png'),
          description: '4卡工作站（AMD），性价比最高，可放办公室',
          cpu: "AMD 7532",
          memory: "DDR4 512G 3200",
          system_disk: "1TB Sata SSD",
          data_disk: "",
          gpu: "RTX 4090D 24G*4",
          network: "25G 双口网卡",
          price: "￥78000",
          after_sales: "整机三年质保，免费上门，1年免费远程支持。",
        },
        {
          id: 2,
          title: 'Intel 8352v 双路8卡4090D服务器',
          image_xl: require('../../assets/image/computing/computing02-xl.png'),
          image_xs: require('../../assets/image/computing/computing02-xs.png'),
          description: '8卡GPU服务器（Intel）&nbsp;，性价比高。',
          cpu: "Intel 8352V*2（2.2GHz 32C64T）",
          memory: "三星DDR4 512G 3200",
          system_disk: "WD 1T sata ssd",
          data_disk: "WD 7.68T U.2 NVME ssd*2",
          gpu: "RTX 4090D 24G*8",
          network: "25G 双口网卡",
          price: "￥186000",
          after_sales: "整机三年质保，免费上门，1年免费远程支持。",
        },
        {
          id: 3,
          title: 'AMD 7543 双路8卡4090D服务器',
          image_xl: require('../../assets/image/computing/computing02-xl.png'),
          image_xs: require('../../assets/image/computing/computing02-xs.png'),
          description: '性能强悍，性价比极高。',
          cpu: "AMD 7543*2（2.9Ghz 32C64T）",
          memory: "三星DDR4 512G 3200",
          system_disk: "WD 1T sata ssd",
          data_disk: "WD 7.68T U.2 NVME ssd*2",
          gpu: "RTX 4090D 24G*8",
          network: "25G 双口网卡",
          price: "￥182000",
          after_sales: "整机三年质保，免费上门，1年免费远程支持。",
        },
        {
          id: 4,
          title: 'AMD 9554 双路8卡4090D服务器',
          image_xl: require('../../assets/image/computing/computing03-xl.png'),
          image_xs: require('../../assets/image/computing/computing03-xs.png'),
          description: '单台128物理核心，目前性能最强，配置最高，价格最贵。',
          cpu: "AMD 9554*2（3.1GHz 64C128T）",
          memory: "三星DDR5 768G RECC 4800",
          system_disk: "WD 1T sata ssd",
          data_disk: "WD 7.68T U.2 NVME ssd*2",
          gpu: "RTX 4090D 24G*8",
          network: "25G 双口网卡",
          price: "￥234000",
          after_sales: "整机三年质保，免费上门，1年免费远程支持。",
        },
      ],
      name: '冯先生',
      phone: '18600080622'
    }
  },
}
</script>

<style>

</style>

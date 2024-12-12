<template>
  <el-breadcrumb class="breadcrumb" >
    <el-breadcrumb-item :to="{ path: '/hosts' }">
      <span class="cbread">GPU实例</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <div class="container">
    <div class="table-container">
      <!-- 区域 -->
      <div class="top-bar top-bar1">
        <div class="flex">
          <p class="subTitle">选择区域</p>
          <el-tooltip :content="tooltip" show-arrow placement="right" effect="light" >
            <i style="margin-left: 8px; font-size: 20px; color: rgba(255, 255, 255, 0.6);" class="spacehpc_iconfont hpc_basic_icon_info_circle"></i>
          </el-tooltip>
        </div>
        <div class="zoneList">
          <el-tabs 
            class="tabs" 
            v-model="activezone"
            @tab-change="handleTabChange">
            <template v-for="zone in zoneList" :key="zone.id">
              <el-tab-pane 
               :label="zone.description" 
               :name="zone.id"
              ></el-tab-pane>
            </template>
          </el-tabs>
        </div>
      </div>
      <!-- 配置 -->
      <div class="top-bar">
        <div class="tab-bar">
          <div class="config">
            <div class="subTitle">选择配置</div>
            <el-radio-group 
              style="margin-top: 20px" 
              class="gpus" 
              v-model="selectedGpu">
              <el-radio 
                v-for="(item, index) in filteredGpuConfigs" 
                :key="index"
                size="large"
                border
                :disabled="item.configNum == 0"
                :value="item.id"
                @change="GpuConfigsChange(item)"
                >
                <div class="title flex">
                  <div class="gpuName" :title="item.gpu">
                    {{ item.gpu }}/{{ item.vram }}GB*{{
                      selectedGpuNum[index + 1]
                    }}
                  </div>
                </div>
                <div class="descript">
                  <div class="flex space-between">
                    <div>{{ item.vram * selectedGpuNum[index + 1] }}GB VRAM </div>
                    <div class="tag" >
                      {{ item.mark }}
                    </div>
                  </div>
                  <div>
                    {{ item.ram * selectedGpuNum[index + 1] }}GB RAM
                    {{ item.cores * selectedGpuNum[index + 1] }} vCPU
                  </div>
                </div>
                <el-select 
                  @click.prevent 
                  popper-class="selectPop selectPop1"
                  style="width: 280px;
                    height:32px;
                    font-size:14px" 
                  class="select" 
                  v-model="selectedGpuNum[index + 1]"
                  :disabled="item.configNum == 0">
                  <el-option 
                    @click="handleGpu(item, i)" 
                    v-for="(i, index) in item.gpuMax" 
                    :key="index"
                    :value="i"
                    :label="item.gpu + ` / ${item.vram}GB*` + i" 
                    :disabled="item.configNum < i">
                    {{ item.gpu }} / {{ item.vram }}GB*{{ i }}
                    <span v-if="item.configNum < i"
                      :style="{ backgroundColor: 'rgba(109, 69, 19, 0.50)', width: '37px', height: '20px', display: 'inline-block', lineHeight: '20px', textAlign: 'center', marginLeft: '5px', fontSize: '12px', color: '#rgba(255, 255, 255, 0.45)', borderRadius: '4px', right: '10px', position: 'absolute' }">
                      不足
                    </span>
                  </el-option>
                </el-select>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <!-- 磁盘容量 -->
      <div class="mirror">
        <div class="subTitle"> 磁盘容量 </div>
        <div class="flex f14 " style="margin-top: 10px">
          <div>免费容量：100 GB</div>
          <div class="ml30 flex">
            付费容量：
            <div class="storage">{{ storage || 0 }}</div> GB
          </div>
          <div class="flex ml30">
            <el-checkbox 
              v-model="expansion" 
              label="扩容：" 
              @change="expansionchange"
              :disabled="isexpansion">
            </el-checkbox>
            <div 
              class="flex" 
              style="border-radius: 8px; overflow: hidden">
              <el-input 
                :disabled="!expansion" 
                v-model="storage" 
                :class="{ 'disabled-input': !expansion }"
                class="input-bg input240" :placeholder="expandTheScope" controls-position="right"
                @input="handleInput" />
            </div>
            <span class="ml10">GB</span>
          </div>
        </div>
        <div class="des">
          请注意：系统盘提供 100 G 免费空间。按量计费实例超出的容量，将按
          {{ storagePrice.dayPrice }} 元/日/GB，在每日 0
          点进行扣费，无论是否关机。使用中可随时扩容系统盘容量。
        </div>
      </div>
      <!-- 选择镜像 -->
      <div class="mirror mirror2">
        <div class="subTitle">选择镜像</div>
        <el-tabs 
          class="tabs"
          v-model="isoType"
          @tab-change="handleimgTabChange">
          <el-tab-pane label="基础镜像" name="0">
            <el-radio-group
              v-model="osName">
              <el-radio
               v-for="(val, key, index) in imagesList" 
               :value="key" 
               :key="index"
               border
               @change="handleOsName"
               class="baseImage">
               
                <div class="flex imgTitle">
                  <img v-if="val[0] && val[0].iconUrl" :src="val[0].iconUrl" width="28" height="28" alt="" />
                  <div class="f18 fw700 cf6 title"> {{ key }}</div>
                </div>
                <div>
                  <el-select 
                    @click.prevent 
                    class="input-bg" 
                    style="width: 216px; position: relative; left: -7px;"
                    v-model="selectedVersion[key]" 
                    :name="key" 
                    value-key="osName" 
                    placeholder="请选择版本"
                    popper-class="selectPop optionPop baseimgPop">
                    <el-option 
                      v-for="(item, i) in val" :key="key + i" 
                      :value="item.osVersion"
                      @click="handleVer(key, item, item.osVersion)">
                      {{ item.osVersion }}
                    </el-option>
                  </el-select>
                </div>
              </el-radio>
            </el-radio-group>
          </el-tab-pane>
          <el-tab-pane label="镜像" name="1">
            <el-select 
              v-model="myMirror" 
              class="input-bg myimg" 
              popper-class="selectPop" 
              style="width: 360px;">
              <template #prefix>
                <div style="height: 22px; width: 22px; margin-right: 2px">
                  <img height="22px" :src="iconUrl" alt="" />
                </div>
              </template>
              <el-option 
                v-for="item in myimgList" 
                :label="item.imgName" 
                :key="item.id" 
                :value="item.id"
                @change="handmyimg(item)">
                <div class="flex">
                  <div style="height: 22px; width: 22px; margin-right: 10px">
                    <img height="22px" :src="item.iconUrl" alt="" />
                  </div>
                  {{ item.imgName }}
                </div>
              </el-option>
            </el-select>
          </el-tab-pane>
          <el-tab-pane label="镜像市场" name="2">
            镜像市场
            <!-- <div class="flex">
              <div class="marketRow flex" v-for="(item, index) in marketImages" :key="index">
                <div class="flex">
                  <div class="imgIcon">
                    <img :src="item.iconUrl" width="32" height="32" alt="" />
                  </div>
                  <div style="width: 228px">
                    <el-popover placement="top-start" title="" width="auto" trigger="hover" :content="item.imageName">
                      <template #reference>
                        <div class="imgName"> {{ item.imageName }}</div>
                      </template>
                    </el-popover>
                    <div class="imgType">
                      {{ item.osName }} {{ item.osVersion }}
                      <p style="
                          width: 1px;
                          height: 60%;
                          margin: 0px 20px;
                          background-color: #26303e;
                          align-self: center;
                        "></p>
                      <span>{{ item.imgSize }}GB</span>
                    </div>
                  </div>
                  <div style="
                      background-color: #26303e;
                      width: 1px;
                      height: 40px;
                      margin: 0px 20px;
                    "></div>
                </div>
                <div style="width: 400px; overflow: hidden">
                  <div class="app">
                    <div class="flex">
                      <div v-if="item.driverVersion">NVIDIA-driver {{ item.driverVersion }}&nbsp;|&nbsp;</div>
                      <div>CUDA {{ item.cudaVersion }}</div>
                    </div>
                  </div>
                </div>
                <div style="
                    background-color: #26303e;
                    width: 1px;
                    height: 40px;
                    margin: 0px 20px;
                  "></div>
                <div>
                  <div class="imgApp">
                    更新时间
                    <div style="width: 20px ;display: flex;margin-left: 16px;">
                      <div style="min-width: 20px;"> <img src="@/assets/images/hosts/hot.svg" v-if="item.star" height="20" alt="" /></div> 
                      <i class="icon hpc_basic_icon_export cursor f16" v-if="item.docUrl" @click="godocurl(item.docUrl)"
                        style="margin: 2px 0px 0px 6px;"></i>
                    </div>
                  </div>
                  <div class="app">{{ formatDate(item.updatedAt) }}</div>
                </div>
              </div>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus"
import { zoneAll, configs, vmStoragePrice, images, imageUser, imageMarket } from '@/api/hosts'

export default {
  data() {
    return {
      tooltip: "实例在不同地域内网络是独立的，无法进行内网通信。",
      activezone: null,
      zoneList: [],
      selectedGpu: null,
      filteredGpuConfigs: [],
      gpuConfigList: [],
      selectedGpuNum: [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      storage: null,
      expansion: false,
      isexpansion: false,
      expandTheScope: '',
      storagePrice: {
        dayPrice: 10,
      },
      isoType: null,
      osName: '',
      gpuModel: null,
      imagesList: [],
      selectedVersion: {},
      osTypeList: {},
      myMirror: '',
      iconUrl: '',
      dictValue: '',
      searchValue: '',
      myimgList: [],
      marketImages: []
    }
  },
  created () {
    this.activezone = 7
    this.getImages()
    this.getStoragePrice()
    this.getZoneList()
  },
  methods: {
    // 获取区域列表
    async getZoneList () {
      try {
        const res = await zoneAll()
        // console.log('res', res)
        if (res.code == 200) {
          this.zoneList = res.data
          this.activezone = this.zoneList[0].id
          this.getGPUconfigs(this.activezone)
        } else {
          ElMessage({
            type: "warning",
            message: res.message,
          })
        }
      } catch (error) {}
    },
    // 区域tab切换
    handleTabChange(id) {
      // console.log('id', id)
      this.activezone = id
      this.getGPUconfigs(id)
      this.isoType = 0
      this.handleimgTabChange(0)
      // if (this.filteredGpuConfigs.length) {
      //   console.log('=====', this.gpuModel)
      //   this.getImages()
      // }
    },
    // 获取区域对应配置
    async getGPUconfigs (zoneId) {
      try {
        const res = await configs({ zoneId })
        // console.log('GPUconfigs', res)
        if (res.code == 200) {
          if (res.data.list) {
            this.filteredGpuConfigs = res.data.list
            this.getDefaultGpuModel(res)
            this.selectedGpu = res.data.defaultId
            this.getImages()
          } else {
            this.filteredGpuConfigs = []
            ElMessage({
              type: "warning",
              message: '当前区域暂无配置，请选择其他区域',
            })
          }
        } else {
          ElMessage({
            type: "warning",
            message: res.message,
          })
        }
      } catch (error) {
        console.error('Error fetching configs:', error);
      }
    },
    getDefaultGpuModel (res) {
      for (const item of res.data.list) {
        if (item.id == res.data.defaultId) {
          this.gpuModel = item.gpu
        }
      }
    },
    // 切换配置
    GpuConfigsChange (item) {
      // console.log('item', item)
      this.gpuModel = item.gpu
      this.getImages()
    },
    // 选择配置规格
    handleGpu (item, i) {
      console.log('item', item)
      console.log('i', i)
    },
    // 扩容
    expansionchange () {

    },
    // 输入框只能输入数字
    handleInput () {
      this.storage = this.storage.replace(/[^\d.]/g, "")
    },
    // 获取磁盘价格
    async getStoragePrice() {
      const res = await vmStoragePrice({ project: "vm_storage" })
      if (res.code == 200) {
        this.storagePrice = res.data
      }
    },
    // 镜像tab change
    handleimgTabChange (value) {
      console.log('value', value)
      if (value == 0) {
        // 基础镜像
        this.getImages()
        console.log('====')
      }
      if (value == 1) {
        // 镜像
        this.getmyimageUser()
      }
      if (value == 2) {
        // 镜像市场
        this.getimageMarket()
      }
    },
    // 获取基础镜像
    async getImages () {
      let obj = {
        zoneId: this.activezone,
        gpuModel: this.gpuModel
      }
      const res = await images(obj)
      if (res.code == 200) {
        let keys = Object.keys(res.data)
        this.osName = keys[0]
        Object.entries(res.data).forEach(([key, value]) => {
          this.selectedVersion[key] = value[0].osVersion
        })
        this.imagesList = res.data
        console.log('imagesList', this.imagesList)
      }
    },
    // 基础镜像列表切换
    handleOsName (value) {
      // console.log('va===', value)
      this.osName = value
    },
    // 基础镜像下拉框数据切换
    handleVer (key, item, osVersion) {
      console.log(key, item, osVersion)
    },
    // 获取我的镜像列表
    getmyimageUser () {
      imageUser({ zoneId: this.activezone }).then((res) => {
        // console.log('res镜像', res)
        if (res.code == 200) {
          this.myimgList = res.data
          this.myMirror = this.myimgList[0]
          this.iconUrl = this.myimgList[0].iconUrl
        } else {
          ElMessage({
            type: "warning",
            message: res.message,
          })
        }
      })
    },
    // 我的镜像下拉框选择
    handmyimg (item) {
      console.log('item', item)
      this.iconUrl = item.iconUrl
    },
    // 获取镜像市场
    async getimageMarket() {
      let obj = {
        imageType: '1',
        labels: this.dictValue,
        searchValue: this.searchValue,
        gpuModel: this.gpuModel,
        zoneId: this.activezone
      }
      const res = await imageMarket(obj)
      console.log('res市场', res)
    }
  }
}
</script>

<style lang="less" scoped>
// 提取的样式
@import '../../assets/css/create.less';
</style>

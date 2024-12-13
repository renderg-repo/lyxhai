<template>
  <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/hosts' }">
      <span class="cbread">GPU实例</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-if="queryType == 'clone'"><span class="fw700 f16 cf85">克隆实例</span></el-breadcrumb-item>
    <el-breadcrumb-item v-if="showBreadcrumbItem"><span class="fw400 f16 cf6">{{ vmInfo.name
        }}</span></el-breadcrumb-item>
    <el-breadcrumb-item v-if="queryType == 'toquantity'"><span class="fw700 f16 cf85">转按量计费</span></el-breadcrumb-item>
    <el-breadcrumb-item v-if="queryType == 'todailymonthly'"><span
        class="fw700 f16 cf85">转包日包月</span></el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="queryType == 'edit'"><span class="fw700 f16 cf85">升降配置</span></el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="queryType == 'renewal'"><span
        class="fw700 f16 cf85">包日/包月续费</span></el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="showTopBar1"><span class="fw700 f16 cf85">创建实例</span></el-breadcrumb-item>
  </el-breadcrumb>
  <div class="container">
    <div class="table-container">
      <div class="top-bar" v-if="queryType == 'clone'">
        <div class="subTitle">源实例</div>
        <div class="subDes">
          <p style="width: 180px;">{{ vmInfo.name }} </p><span style="margin-left: 15px;">{{ vmInfo.vmid }} </span>
        </div>
      </div>
      <div class="top-bar top-bar1" v-if="showTopBar">
        <div class="flex">
          <div class="subTitle">选择区域</div>
          <i @mouseenter="showTips = true" @mouseleave="showTips = false" style="
              margin-left: 8px;
              font-size: 20px;
              color: rgba(0, 0, 0, 0.6);
            " class="spacehpc_iconfont hpc_basic_icon_info_circle"></i>
          <div v-show="showTips">
            <div class="tipText" v-if="queryType == 'clone'">
              克隆实例，不可更改区域。
            </div>
            <div class="tipText" v-else-if="queryType == 'edit'">
              升降配置，只可以在本区操作。
            </div>
            <div class="tipText " v-else>
              实例在不同地域内网络是独立的，无法进行内网通信。
            </div>
          </div>
        </div>
        <template v-if="zoneList && zoneList.length > 0">
          <el-tabs 
            v-if="queryType == 'clone' || queryType == 'edit'" 
            class="tabs" 
            v-model="activezone"
            @tab-change="handleTabClick">
            <template v-for="zone in zoneList" :key="zone.id">
              <el-tab-pane 
                v-if="zone.id == pveCreateParam.zoneId" 
                :label="zone.description" 
                :name="zone.id"
                :disabled="queryType == 'clone' || queryType == 'edit'"></el-tab-pane>
            </template>
          </el-tabs>
          <el-tabs 
            v-else 
            class="tabs" 
            v-model="pveCreateParam.zoneId" 
            @tab-change="handleTabClick">
            <el-tab-pane 
              v-for="zone in zoneList" 
              :label="zone.description" 
              :key="zone.id"
              :name="zone.id"
              :disabled="queryType == 'clone' || queryType == 'edit'"></el-tab-pane>
          </el-tabs>
        </template>
      </div>
      <div class="top-bar" v-if="showTopBar">
        <div class="tab-bar" v-loading="configLoading" element-loading-background="rgba(0, 0, 0, 0)">
          <div class="config">
            <div class="subTitle">选择配置</div>
            <div style="margin-top: 20px">
              <el-radio-group class="gpus" v-model="pveCreateParam.configId">
                <el-radio 
                  v-for="(item, index) in filteredGpuConfigs"
                  @change="handleGpu(item, selectedGpuNum[index + 1])" 
                  :value="item.id" 
                  size="large"
                  :disabled="item.configNum == 0" :key="index" border
                  :style="`opacity: ${item.configNum == 0 ? 0.5 : 1}`">
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
                      <div class="tag" :style="`background-color: ${matchMarkColor(item.mark)}`">
                        {{ item.mark }}
                      </div>
                    </div>
                    <div>
                      {{ item.ram * selectedGpuNum[index + 1] }}GB RAM
                      {{ item.cores * selectedGpuNum[index + 1] }} vCPU
                    </div>
                  </div>
                  <el-select @click.prevent popper-class="selectPop selectPop1"
                    style="width: 280px;height:32px;font-size:14px" class="select" v-model="selectedGpuNum[index + 1]"
                    :disabled="item.configNum == 0">
                    <el-option 
                      @click="handleGpu(item, i)" 
                      v-for="i in item.gpuMax" 
                      :key="i"
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
      </div>

      <div class="mirror" v-if="showTopBar">
        <div class="subTitle ">磁盘容量</div>
        <div class="flex f14 " style="margin-top: 10px">
          <div>总容量：{{ storagePrice.defaultStorage }} GB（免费）<span v-show="storage">+ {{ storage || 0 }} GB （付费）</span></div>
          <!-- <div class="ml30 flex">
            付费容量：
            <div class="storage">{{ storage || 0 }}</div> GB
          </div> -->
          <div class="flex ml30" v-if="queryType !== 'edit' && queryType !== 'clone'">
            <el-checkbox 
              v-model="expansion" 
              label="扩容：" 
              :disabled="isexpansion"
              @change="expansionchange"
              ></el-checkbox>
            <div 
              class="flex" 
              style="border-radius: 8px; overflow: hidden">
              <el-input :disabled="!expansion" v-model="cost" :class="{ 'disabled-input': !expansion }"
                class="input-bg input240" :placeholder="expandTheScope" controls-position="right"
                @input="handleInput" />
            </div>
            <span class="ml10" 
            style="color: rgba(0, 0, 0, 0.6);"
            :style="expansion ? 'color: rgba(0, 0, 0, 60%)' : 'color: rgba(0, 0, 0, 0.3)'">GB</span>
          </div>
        </div>
        <div class="des">
          请注意：系统盘{{ storagePrice.diskFreeSize }}G以内免费，按量计费实例超出部分按照
          {{ storagePrice.dayPrice }} 元/日/GB，每日0点扣费(无论是否关机)。过大容量会导致开机、保存镜像过程变长。
        </div>
      </div>
      <div class="mirror" v-if="queryType == 'clone'">
        <div class="subTitle">镜像</div>
        <div class="subDes">
          <p style="margin-right: 12px;">以实例：</p> {{ vmInfo.vmid }} 当前系统状态为镜像创建新的实例。
        </div>
      </div>
      <div v-else-if="queryType == 'edit'"></div>
      <div class="mirror mirror2" v-else-if="showTopBar">
        <div class="subTitle">选择镜像</div>
        <el-tabs class="tabs" 
          v-model="pveCreateParam.isoType" 
          @tab-click="handleimgTabClick">
          <el-tab-pane 
            label="基础镜像" 
            :name="0" 
            v-loading="baseImageLoading"
            element-loading-background="rgba(0, 0, 0, 0)">
            <el-radio-group 
              v-model="pveCreateParam.osName" 
              @change="handleOsName">
              <el-radio v-for="(val, key, i) in imagesList" :value="key" :key="i" border class="baseImage">
                <div class="flex imgTitle">
                  <img v-if="val[0] && val[0].iconUrl" :src="val[0].iconUrl" width="28" height="28" alt="" />
                  <div class="f18 fw700 cf6 title">{{ key }}</div>
                </div>
                <div>
                  <el-select @click.prevent class="input-bg" style="width: 216px; position: relative; left: -7px;"
                    v-model="selectedVersion[key]" :name="key" value-key="osName" placeholder="请选择版本"
                    popper-class="selectPop optionPop baseimgPop">
                    <el-option v-for="(item, i) in val" :key="key + i" :value="item.osVersion"
                      @click="handleVer(key, item, item.osVersion)">
                      {{ item.osVersion }}
                    </el-option>
                  </el-select>
                </div>
              </el-radio>
            </el-radio-group>
          </el-tab-pane>
          <el-tab-pane label="我的镜像" :name="2">
            <el-select 
              v-model="osName" 
              class="input-bg myimg" 
              popper-class="selectPop" style="width: 360px;">
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
                @click="handmyimg(item)">
                <div style="height: 22px; width: 22px; margin-right: 10px">
                  <img height="22px" :src="item.iconUrl" alt="" />
                </div>
                {{ item.imgName }}
              </el-option>
            </el-select>
          </el-tab-pane>
          <el-tab-pane label="镜像市场" :name="1" v-if="imageMarketShow">
            <div class="flex">
              <!-- <div class="marketRow flex" v-for="(item, index) in marketImages" :key="index">
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
              </div> -->
              <div class="marketRow flex" >
                <div class="flex">
                  <div class="imgIcon">
                    <img :src="selectImg.iconUrl" width="32" height="32" alt="" />
                  </div>
                  <div style="width: 228px">
                    <el-popover placement="top-start" title="" width="auto" trigger="hover" :content="selectImg.imageName">
                      <template #reference>
                        <div class="imgName"> {{ selectImg.imageName }}</div>
                      </template>
                    </el-popover>
                    <div class="imgType">
                      {{ selectImg.osName }} {{ selectImg.osVersion }}
                      <p style="
                          width: 1px;
                          height: 60%;
                          margin: 0px 20px;
                          background-color: #26303e;
                          align-self: center;
                        "></p>
                      <span>{{ selectImg.storageSize }}GB</span>
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
                      <div v-if="selectImg.driverVersion">NVIDIA-driver {{ selectImg.driverVersion }}&nbsp;|&nbsp;</div>
                      <div>CUDA {{ selectImg.cudaVersion }}</div>
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
                      <div style="min-width: 20px;"> <img src="@/assets/images/hosts/hot.svg" v-if="selectImg.star" height="20" alt="" /></div> 
                      <i class="icon hpc_basic_icon_export cursor f16" v-if="selectImg.docUrl" @click="godocurl(selectImg.docUrl)"
                        style="margin: 2px 0px 0px 6px;"></i>
                    </div>
                  </div>
                  <div class="app">{{ formatDate(selectImg.updatedAt) }}</div>
                </div>
              </div>
              <div class="changeBtn ml10" @click="openmarket()">更换</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="top-bar" v-if="queryType == 'toquantity' || queryType == 'todailymonthly' || queryType == 'renewal'">
        <div class="flex felx-center"><span class="cf85 fw700">当前实例</span>
          <el-popover popper-class="notice_pop" placement="right" :offset="10" trigger="hover"
            :width="queryType == 'toquantity' ? 366 : 426">
            <template #reference>
              <i class="spacehpc_iconfont hpc_basic_icon_info_circle f20" v-if="queryType !== 'renewal'"
                style="margin-left: 10px;color: rgba(255, 255, 255, 0.3);"></i>
            </template>
            <div class="notice_card">
              <div class="notice_content " v-if="queryType == 'toquantity'">
                包日包月转按量计费则会退款，具体规则详见帮助文档。
              </div>
              <div class="notice_content " v-if="queryType == 'todailymonthly'">
                转包日包月后，先结算当前按量计费费用后再扣除包日包月费用。
              </div>
            </div>
          </el-popover>
        </div>
        <div class="flex felx-center f14" style="margin:15px 0px;">
          <span class="cf30">实例名称/ID：</span> <span class="cf6 mr30"> {{ vmInfo.name }}
            &nbsp;&nbsp;{{
              vmInfo.vmid
            }}</span><span class="cf30">GPU：&nbsp;&nbsp;</span><span class="cf6 mr30">{{ vmInfo.gpu }}*{{
              vmInfo.gpuNum
            }}卡</span><span class="cf30">磁盘容量：&nbsp;&nbsp;</span><span class="cf6 mr30">免费：{{ storagePrice.defaultStorage }} G &nbsp;&nbsp;
            付费容量：<span v-if="vmInfo.storage > 100">{{
              vmInfo.storage - 100
            }}</span><span v-else>0</span> GB</span><span class="cf30">计费：&nbsp;&nbsp;</span><span
            class="cf6 mr30"><span v-if="vmInfo.chargeType == 0">按量计费</span><span
              v-if="vmInfo.chargeType == 1">包日计费</span><span v-if="vmInfo.chargeType == 2">包月计费</span></span>
        </div>
        <p class="flex felx-center cf30" v-if="vmInfo.chargeType == 0 || queryType == 'renewal'"><el-icon
            style="color: rgba(255, 255, 255, 0.3);">
            <WarningFilled />
          </el-icon> <span class="f12"> &nbsp; 包日包月实例到期后，付费系统盘将按 0.01 元/日/GB，在每日 0 点进行扣费，无论是否关机。</span></p>
      </div>
      <div class="top-bar" v-if="queryType == 'toquantity'">
        <p class="cf85 fw700" style="margin-bottom: 15px;">退款订单</p>
        <div style="width: 100%;">
          <el-table :data="refundInformation.refundOrderDetailList" style="width: 100%;" v-loading="ordersloading"
            flexible :header-cell-style="headerCellStyle" border :cell-style="cellStyle">
            <!-- 定义表格列 -->
            <el-table-column prop="orderNo" label="订单ID" :show-overflow-tooltip="true" width="200">
              <template #default="{ row }">
                <span class="">{{ row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单费用起止时间" :show-overflow-tooltip="true" width="324">
              <template #default="{ row }">
                <p class="w100">{{ row.chargeFrom }} 至 {{ row.chargeTo }}</p>
              </template>
            </el-table-column>
            <el-table-column label="订单类型" width="150">
              <template #default="{ row }">
                <span class=" ">{{ match(row.project) }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="计费" width="">
              <template #default="{ row }">
                <span class="cf85 mr30"><span v-if="row.chargeType == 0">按量计费</span><span
                    v-if="row.chargeType == 1">包日计费</span><span v-if="row.chargeType == 2">包月计费</span></span>
              </template>
            </el-table-column> -->
            <el-table-column prop="balanceAmount" label="余额支付" width="150">
              <template #default="{ row }">
                <span class=" mr30"> ￥{{ (row.balanceAmount).toFixed(2) }}</span>

              </template>
            </el-table-column>
            <el-table-column prop="couponAmount" label="支付券支付" width="150">
              <template #default="{ row }">
                <span class=" mr30"> ￥{{ (row.couponAmount).toFixed(2) }}</span>

              </template>
            </el-table-column>

            <el-table-column prop="expendAmount" label="订单费用" width="150">
              <template #default="{ row }">
                <span class="cf85 mr30"> ￥{{ (row.expendAmount).toFixed(2) }}</span>

              </template>
            </el-table-column>
            <el-table-column prop="couponAmount" label="已用时长" width="150">
              <template #default="{ row }">
                <span class="cf85 mr30"> {{ row.useTimes }}小时</span>

              </template>
            </el-table-column>
            <el-table-column prop="couponAmount" label="已产生费用" width="150">
              <template #default="{ row }">
                <span class="cf85 mr30"> ￥{{ (row.useAmount).toFixed(2) }}</span>

              </template>
            </el-table-column>
            <el-table-column prop="couponAmount" label="退款金额" width="">
              <template #default="{ row }">
                <span class="cf85 mr30"> ￥{{ (row.refundBalance).toFixed(2) }}</span>

              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
      <div class="top-bar" v-if="queryType == 'toquantity'">

        <p class="cf85 fw700" style="margin-bottom: 15px;">订单汇总</p>

        <div class=" cf85">
          <!-- <div class="Forms" style="width:240px ;">
            <div class="header">已使用时长</div>
            <div class="Formscontent">{{ refundInformation.useTimes }}小时</div>
          </div> -->
          <div class="Forms" style="min-width: 400px;">
            <div class="f14 mr30"><span class="cf30">原订单费用：</span><span class="cf6">￥{{ refundInformation.totalAmount
                }}</span></div>
            <div class="f14 mr30"><span class="cf30">已产生费用：</span><span class="cf6">￥{{ refundInformation.totalUseAmount
                }}</span></div>
            <div class="f14 mr30"><span class="cf30">退款金额：</span><span class="cf6">￥{{ refundInformation.refundBalance
                }}</span></div>
            <div class="Formscontent"></div>
          </div>

        </div>
        <p class="flex felx-center cf30 "><el-icon style="color: rgba(255, 255, 255, 0.3); margin: 15px 0px;">
            <WarningFilled />
          </el-icon> <span class="f12"> &nbsp; 已消费金额最高封顶为已支付金额。</span></p>
      </div>
      <div class="top-bar" v-if="queryType == 'toquantity'">
        <p class="cf85 fw700" style="margin-bottom:15px">按量计费价格</p>
        <div class="flex felx-center f14">
          <span class="cf6">配置费用：</span> <span class="cf6 mr20">￥{{ vmInfo.vmConfigUnit.unitPrice }}/时 +
            磁盘费用：￥{{
              ((vmInfo.storage - 100) * 0.01).toFixed(2) }}/天
          </span> <el-popover placement="top" width="484px">
            <template #reference>
              <el-link class="ml5" type="primary" :underline="false">
                费用明细
              </el-link>
            </template>
            <div class="detailBox">

              <div class="flex head">
                <div>计费项</div>
                <div>原价</div>
                <div>优惠金额</div>
                <div>最终价格</div>
              </div>
              <div class="flex row" style="border-bottom: 1px solid #26303e">
                <div>实例</div>
                <div class="flex">
                  ￥
                  <span>{{
                    (vmInfo.vmConfigUnit.unitPrice *
                      vmInfo.gpuNum).toFixed(2)
                  }}</span>
                </div>
                <div>￥ 0.00</div>
                <div>
                  <p class="cred flex">
                    ￥<span>{{
                      (vmInfo.vmConfigUnit.unitPrice *
                        vmInfo.gpuNum).toFixed(2)
                    }}</span>
                  </p>
                </div>
              </div>
              <div class="flex row" v-if="this.$route.query.id">
                <div>磁盘</div>
                <div class="flex">
                  ￥
                  <span v-show="pveCreateParam.chargeType == 0">{{
                    (storagePrice.dayPrice * storage).toFixed(2)
                  }}</span>
                  <span v-show="pveCreateParam.chargeType == 1">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      pveCreateParam.payTimes
                    ).toFixed(2)
                  }}</span>
                  <span v-show="pveCreateParam.chargeType == 2">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      (pveCreateParam.payTimes * 30)
                    ).toFixed(2)
                  }}</span>
                </div>
                <div>￥0.00</div>
                <div class="cred flex">
                  ￥
                  <span v-show="pveCreateParam.chargeType == 0">{{
                    (storagePrice.dayPrice * storage).toFixed(2)
                  }}</span>
                  <span v-show="pveCreateParam.chargeType == 1">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      pveCreateParam.payTimes
                    ).toFixed(2)
                  }}</span>
                  <span v-show="pveCreateParam.chargeType == 2">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      (pveCreateParam.payTimes * 30)
                    ).toFixed(2)
                  }}</span>
                </div>
              </div>
              <div class="flex row" v-else>
                <div>磁盘</div>
                <div class="flex">
                  ￥
                  <span v-show="pveCreateParam.chargeType == 0">{{
                    (storagePrice.dayPrice * storage).toFixed(2)
                  }}/天</span>
                  <span v-show="pveCreateParam.chargeType == 1">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      pveCreateParam.payTimes
                    ).toFixed(2)
                  }}</span>
                  <span v-show="pveCreateParam.chargeType == 2">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      (pveCreateParam.payTimes * 30)
                    ).toFixed(2)
                  }}</span>
                </div>
                <div>￥0.00</div>
                <div class="cred flex">
                  ￥
                  <span v-show="pveCreateParam.chargeType == 0">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      discount
                    ).toFixed(2)
                  }}/天</span>
                  <span v-show="pveCreateParam.chargeType == 1">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      pveCreateParam.payTimes *
                      discount
                    ).toFixed(2)
                  }}</span>
                  <span v-show="pveCreateParam.chargeType == 2">{{
                    (
                      storagePrice.dayPrice *
                      storage *
                      (pveCreateParam.payTimes * 30) *
                      discount
                    ).toFixed(2)
                  }}</span>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
        <p class="flex felx-center cf30 "><el-icon style="color: rgba(255, 255, 255, 0.3); margin: 15px 0px;">
            <WarningFilled />
          </el-icon> <span class="f12"> &nbsp; 按量计费实例超出的容量，将按 0.01 元/日/GB，在每日 0 点进行扣费，无论是否关机。使用中可随时扩容系统盘容量。</span></p>
      </div>
      <div class="top-bar" v-if="queryType == 'renewal'">
        <p class="cf85 fw700">当前租用周期</p>
        <div class="flex felx-center f14 cf6" style="margin:15px 0px;">{{ vmInfo.chargeAt }} 至 {{ vmInfo.expireAt
          }}&nbsp;&nbsp; 共
          {{ daysBetweenDates }} 天
        </div>
        <p class="flex felx-center cf30 "><el-icon style="color: rgba(255, 255, 255, 0.3);">
            <WarningFilled />
          </el-icon> <span class="f12"> &nbsp; 续费后，到期时间会在当前时间上延长。</span></p>
      </div>

      <div class="top-bar" v-if="showcoupons">

        <el-collapse v-model="activeNames" @change="handleChange()">
          <el-collapse-item name="1">
            <template #title>
              <p style="line-height: 26px; height: 28px; background: transparent" class="f18 fw700 flex">优惠券</p>
              <div class="tag">
                <div class="tagbox"
                  :style="{ background: (Couponlist && Couponlist.length) ? '' : '#e1e2e4 !important' }">
                  <span v-if="Couponlist && Couponlist.length">{{ Couponlist.length }}</span>
                </div>
                <p class="active cf6" v-if="checkList.length > 0">
                  已选：满{{ checkList[0].minSpend }}
                  <span v-if="!checkList[0].discountType">- {{ checkList[0].amount }}</span>
                  <span v-if="checkList[0].discountType">打 {{ formattedAmount(checkList[0].amount) }} 折</span>
                </p>
              </div>
            </template>
            <div>
              <div class="Couponlistbox" v-show="Couponlist && Couponlist.length">
                <DictComponent :requiredDictTypes="requiredDictTypes">
                  <template #default="{ dicts, dictMate }">
                    <el-checkbox-group class="Couponlist" v-model="checkList" @change="handleCheckboxChange">
                      <el-checkbox :value="item" v-for="item in Couponlist" :key="item.code" class="Coupons"
                        :class="{ cf35: item.useStatus == 2, Couponsbk: item.useStatus }">
                        <div class="Couponstop">
                          <div style="width: 100%">
                            <div class="topamount" :class="{ cf35: item.useStatus == 2 || item.useStatus == 1 }">
                              <p class="amounts">
                                <span class="f14" v-if="!item.discountType">￥</span>
                                {{ item.discountType == 1 ? formattedAmount(item.amount) : item.amount }}
                                <span class="f14" v-if="item.discountType">折</span>
                              </p>
                              <p class="pt26 cf6" style="margin-right: 14px">
                                满{{ item.minSpend }}可用
                              </p>
                              <p class="pt26 flex-1 cf45" :class="{ cf35: item.useStatus == 2 || item.useStatus == 1 }"
                                style="text-align: right">
                                有效期至 {{ item.validTo }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="Couponsbottom">
                          <div class="cf6">{{ item.ruleDesc }}</div>
                          <i class="icon hpc_basic_icon_question_circle f16 cf6"></i>
                          <div class="tag">
                            {{ dictMate("discountType", item.discountType) }}
                          </div>
                        </div>
                      </el-checkbox>
                    </el-checkbox-group>
                  </template>
                </DictComponent>
              </div>
              <div v-show="Couponlist && Couponlist.length == 0" class="f14 lh22 cf6" style="background-color: #e1e2e4;">无可用优惠券</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="bottom-slot">
        <div class="bottom-bar">
          <div>
            <div class="left" v-if="queryType !== 'edit' && queryType !== 'toquantity'">
              <div class="sumType f18">
                计费方式：
                <el-select @change="pveCreateParam.payTimes = 1" popper-class="selectPop" class="input-bg"
                  v-model="pveCreateParam.chargeType" style="width: 160px; border-radius: 8px; overflow: hidden">
                  <el-option v-if="queryType !== 'todailymonthly' && queryType !== 'renewal'" :value="0"
                    label="按量计费">按量计费</el-option>
                  <el-option :value="1" label="包日计费">包日计费</el-option>
                  <el-option :value="2" label="包月计费">包月计费</el-option>
                </el-select>
              </div>
              <div class="num " v-if="pveCreateParam.chargeType != 0">
                <div class="f18" style="color: rgba(0, 0, 0, 0.6)">购买时长：</div>
                <div class="">
                  <el-select 
                    popper-class="selectPop" 
                    v-if="pveCreateParam.chargeType == 1"
                    v-model="pveCreateParam.payTimes"
                    style="width: 100px; border-radius: 8px; overflow: hidden; height:32px">
                    <el-option :value="1" label="1日"></el-option>
                    <el-option :value="2" label="2日"></el-option>
                    <el-option :value="3" label="3日"></el-option>
                    <el-option :value="4" label="4日"></el-option>
                    <el-option :value="5" label="5日"></el-option>
                    <el-option :value="6" label="6日"></el-option>
                  </el-select>
                  <el-select popper-class="selectPop" v-if="pveCreateParam.chargeType == 2"
                    v-model="pveCreateParam.payTimes" style="width: 100px;height:32px">
                    <el-option :value="1" label="1月"></el-option>
                    <el-option :value="2" label="2月"></el-option>
                    <el-option :value="3" label="3月"></el-option>
                    <el-option :value="4" label="4月"></el-option>
                    <el-option :value="5" label="5月"></el-option>
                    <el-option :value="6" label="6月"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="fee" v-if="queryType !== 'toquantity'" :key="computedFee">
              <div class="sum" style="padding-right: 20px;">
                <div
                  v-if="storage && pveCreateParam.chargeType == 0 && CreateView && CreateView.vmChargeInfoVoList[1].amount"
                  style="display: flex;height: 26px;align-items: center;">
                  <div class="lh20"> 磁盘费用：</div>
                  <div class="cred f24 flex ">
                    <div style="font-size: 14px">￥</div>
                    <div v-show="CreateView && CreateView.vmChargeInfoVoList && CreateView.vmChargeInfoVoList[1]"
                      style="line-height: 22px;position: relative;top: -3px;">
                      {{
                        typeof CreateView.vmChargeInfoVoList[1].amount === 'number'
                          ? CreateView.vmChargeInfoVoList[1].amount.toFixed(2)
                          : '0.00'
                      }}
                    </div>

                  </div>

                  <div class="cred" style="font-size: 12px;" v-show="pveCreateParam.chargeType == 0">/天
                  </div>
                  <el-popover popper-class="notice_pop" placement="top" :offset="10" width="268" trigger="hover">
                    <template #reference>
                      <img style="margin-left: 5px;width: 20px;" src="@/assets/images/hosts/qicon.png" alt="" />
                    </template>
                    <div class="cf6">
                      无论是否关机，扩容磁盘均会产生费用。
                    </div>
                  </el-popover>
                </div>

                <div style="display: flex;align-items: baseline;margin-top: auto">
                  <p class="totalCouponsAmount" v-if="accountInfo.currentCouponsAmount" style="">
                    <span> 支付券：</span><span>￥{{ accountInfo.currentCouponsAmount.toFixed(2) }}</span>
                    <span class="cf45">（优先抵扣）</span>
                  </p>
                </div>
              </div>
              <div class="solde sum">
                <div class="flex f14" style="height: 26px">
                  <p class="lh20 fc85">配置费用：</p>
                  <div class="cred flex f24" v-if="pveCreateParam.chargeType == 0">
                    <div style="font-size: 14px;">￥</div>
                    <div v-if="CreateView && CreateView.vmChargeInfoVoList" style="position: relative;top: -3px;">
                      {{ CreateView.vmChargeInfoVoList[0].amount || 0.00 }}
                    </div>
                  </div>
                  <div class="cred  flex f24" v-else>
                    <div style="font-size: 14px">￥</div>
                    <div v-if="CreateView">
                      {{ CreateView.totalTradeAmount }}
                    </div>
                  </div>
                  <div class="cred" style="font-size: 12px;" v-show="pveCreateParam.chargeType == 0">/时
                  </div>

                  <el-popover placement="top" width="484px">
                    <template #reference>
                      <el-link class="ml5" type="primary" :underline="false" style="height: 22px;">
                        明细
                      </el-link>
                    </template>
                    <div class="detailBox">
                      <div class="flex head">
                        <div>计费项</div>
                        <div>原价</div>
                        <div>优惠金额</div>
                        <div>最终价格</div>
                      </div>
                      <div class="flex row" style="border-bottom: 1px solid #26303e">
                        <div>实例</div>
                        <div class="flex">
                          ￥ <span v-if="CreateView">
                            {{ CreateView.vmChargeInfoVoList[0].amount }}
                          </span>
                        </div>
                        <div>￥<span v-if="CreateView">
                            {{ CreateView.vmChargeInfoVoList[0].discountAmount }}
                          </span></div>
                        <div class="cred flex">
                          ￥<span v-if="CreateView">
                            {{ CreateView.vmChargeInfoVoList[0].tradeAmount }}
                          </span>
                        </div>
                      </div>
                      <div class="flex row">
                        <div>磁盘</div>
                        <div class="flex">
                          ￥<span v-if="CreateView">
                            {{ CreateView.vmChargeInfoVoList[1].amount }}
                          </span>
                        </div>
                        <div>￥<span v-if="CreateView">
                            {{ CreateView.vmChargeInfoVoList[1].discountAmount }}
                          </span></div>
                        <div class="cred flex">
                          ￥<span v-if="CreateView">
                            {{ CreateView.vmChargeInfoVoList[1].tradeAmount }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </el-popover>
                </div>
                <div class="chargeRow">
                  <div class="balance fc85">
                    账户余额：￥{{ accountInfo.balance }}
                  </div>
                  <el-button class="chargeBtn" text bg @click="this.$router.push('/mine/recharge')">充值</el-button>
                </div>
              </div>
            </div>
            <div class="fee" v-if="queryType == 'toquantity'">
              <span class="cf6 f14" style="padding-right: 60px; display: flex;  align-items: end;">实际退款金额以提交时间为准</span>
              <div class="solde sum">
                <div> <span>退回费用：</span>
                  <span class="cred f24" v-if="this.$route.query.id">
                    <span style="font-size: 12px">￥</span>
                    <span>{{ refundInformation.refundBalance }}</span>
                  </span>
                </div>
              </div>
            </div>
            <el-button v-if="queryType == 'clone'" class="primarybtn creatBtn " style="padding: 7px 32px"
              :loading="isLoading" @click="handleClone" type="primary">立即克隆</el-button>
            <el-button v-else-if="queryType == 'toquantity'" class="primarybtn creatBtn " style="padding: 7px 32px; "
              :loading="isLoading" @click="handlechangeChargeType('amount')" type="primary">确定</el-button>
            <el-button v-else-if="queryType == 'todailymonthly'" class="primarybtn creatBtn " style="padding: 7px 32px;"
              :loading="isLoading" @click="handlechangeChargeType('monthlySubscription')" type="primary">确定</el-button>
            <el-button v-else-if="queryType == 'edit'" class="primarybtn creatBtn" style="padding: 7px 32px"
              :loading="isLoading" @click="handleEdit" type="primary">立即更改</el-button>
            <el-button v-else-if="queryType == 'renewal'" class="primarybtn creatBtn " style="padding: 7px 32px"
              :loading="isLoading" @click="renewalbtn" type="primary">确定</el-button>
            <el-button v-else class="primarybtn creatBtn" style="padding: 7px 32px; height: 36px; width: 120px"
              @click="createAButton" type="primary">立即创建</el-button>
            <el-button class="bgBtn  creatBtn" text bg style="width: 120px;margin-left: 20px;"
              @click="this.$router.push('/hosts')">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog 
      class="imageMarketDialog" 
      v-model="fileNotice" 
      title="镜像市场" 
      style="width: 968px; margin-top: 40px"
      width="500px" 
      @close="fileNoticeClose">
      <div class="noticeContent">
        <!-- <div class="toptag">
          <div v-for="(item, index) in imagetype" :key="index"
            :class="{ imagetypes: true, selected: selectedIndex === index }" @click="selectItem(index, item)">
            {{ item.dictLabel }}
          </div>
        </div> -->
        <!-- style="min-width: 300px; width: 380px" -->
        <el-input 
          class="input-bg" 
          style="height: 36px;margin-bottom: 15px;" 
          placeholder="搜索镜像名称、作者" 
          v-model="searchValue" @change="getimageMarket()"
          clearable :suffix-icon="Search" ></el-input>
      </div>
      <!-- 标签 -->
      <div class="flex-align-center flex-between">
        <div class="mirror-tag-box mini-mirror-tag-box flex-align-start flex-between" v-if="activeIndex != 2">
          <div class="mirror-tag-list flex-align-center flex-wrap">
            <p 
              v-for=" (value, key, index) in mirrorTags" 
              :key="index" 
              class="mirror-tag-item mr10 flex-align-center" 
              style="margin-left: 0;" 
              :style="moreStyle(value, index)" 
              @click="handleSelectTag(key, index)">
              <span style="margin-right: 5px;">{{ key }}</span>
              <el-icon v-if="isShowTagIcon(key, index)"><Select /></el-icon>
            </p>
          </div>
        </div>
        <div class="mirror-tag-selected mb20 mini-mirror-tag-selected">
          已选：{{ selectedTags }}
        </div>
      </div>
      <div class="centent" v-loading="imageMarketListloading">
        <div class="marketRow flex" 
          v-for="(item, index) in imageMarketList" 
          :key="index" @click="SelectMirror(item)"
          :style="{
            borderColor: selectedItemId === item.id ? '#2696FF' : 'transparent',
          }">
          <div class="flex" style=" flex: 2; border-right: 1px solid #26303e; margin-right: 20px" >
            <div class="imgIcon">
              <img :src="item.iconUrl" width="32" height="32" alt="" />
            </div>
            <!-- style="width: 228px" -->
            <div >
              <el-popover placement="top-start" title="" width="auto" trigger="hover" :show-after="1500"
                :content="item.imageName">
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
                <span>{{ item.storageSize }}GB</span>
              </div>
            </div>
            <!-- <div style="
                background-color: #26303e;
                width: 1px;
                height: 40px;
                margin: 0px 20px;
              "></div> -->
          </div>

          <div style=" flex: 1; overflow: hidden">
            <div class="imgApp">作者</div>
            <div class="app">
              @ {{ formatDate(item.author) }}
              <!-- <div class="flex">
                <div v-if="item.driverVersion">NVIDIA-driver {{ item.driverVersion }}&nbsp;|&nbsp;</div>
                <div>CUDA {{ item.cudaVersion }}</div>
              </div> -->
              <!-- <el-popover placement="top-start" title="" width="auto"
                :disabled="concatenateAppNames(item.applications).length < 69" trigger="hover" :show-after="1500"
                :content="concatenateAppNames(item.applications)">
                <template #reference>
                  <span :ref="'appNames' + index">{{ concatenateAppNames(item.applications) }}</span>
                </template>
              </el-popover> -->
            </div>
          </div>
          <div style="
              background-color: #26303e;
              width: 1px;
              height: 40px;
              margin: 0px 20px;
            "></div>
          <div>
            <div class="imgApp" style="flex: 1">
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
        <div class="" style="text-align: center ;position: relative;top: 50%;" v-if="!imageMarketList.length">暂无数据</div>
      </div>


      <template #footer>
        <div class="noticeFooter">
          <el-button style="width: 76px;border-radius: 8px 8px 8px 8px; " class="bgBtn" text bg
            @click="closedialog()">取消</el-button>
          <el-button style="width: 76px;border-radius: 8px 8px 8px 8px;" class="primarybtn" type="primary"
            @click="changeMirror()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 订单确认弹窗 -->
    <el-dialog 
      class="noticeDialog" 
      title="订单确认" 
      v-model="orderConfirmation" 
      style="width: 530px;">
      <div class="ps">
        <p class="cf6">区域：</p>
        {{ getTheRegion(pveCreateParam.zoneId) }}
      </div>
      <div class="ps">
        <p class="cf6">配置：</p>{{ getarrangement(pveCreateParam.configId) }} *
        {{ pveCreateParam.gpuNum }}
      </div>
      <div class="ps">
        <p class="cf6">磁盘容量：</p>
        <!-- 创建部分传递总容量 -->
        免费容量：{{ storagePrice.defaultStorage }} GB &nbsp;&nbsp;
        付费容量：{{ storage || 0 }} GB
      </div>
      <div class="ps">
        <p class="cf6">镜像：</p>{{ pveCreateParam.imageName }}
      </div>

      <div class="ps">
        <p class="cf6">计费方式：</p>{{
          pveCreateParam.chargeType === 0
            ? "按量计费"
            : pveCreateParam.chargeType === 1
              ? "包日计费"
              : "包月计费"
        }}
      </div>
      <div class="ps">
      <div v-if="pveCreateParam.chargeType == 0 && storage">
        <span class="cf6"> 磁盘费用：</span>
        <span class="cred f24">
          <span style="font-size: 12px">￥</span>
          <span>{{ formattedPrice }}</span>
        </span>
        <span class="cred " style="font-size: 12px ;margin-right: 20px" v-show="pveCreateParam.chargeType == 0">/天
        </span>
      </div>

      <span class="cf6">配置费用：</span>
      <span class="cred f24">
        <span style="font-size: 12px">￥</span>
        <span v-if="CreateView && pveCreateParam.chargeType == 0">
          {{ CreateView.vmChargeInfoVoList[0].amount || 0.00 }}
        </span>

        <span v-else><span v-if="CreateView">
            {{ CreateView.totalTradeAmount }}
          </span></span>
      </span>
      <span class="cred" style="font-size: 12px" v-show="pveCreateParam.chargeType == 0">/时</span>
    </div>
      <template #footer>
        <div class="noticeFooter2">
          <el-button class="bgBtn" text bg @click="closedialog()">取消</el-button>
          <el-button class="primarybtn" type="primary" :loading="isLoading" @click="handleCreate()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 续费弹窗 -->
    <el-dialog 
      class="renewalDialog" 
      title="包日/包月续费" 
      v-model="renewalVisible" 
      style="width: 530px;">
      <p class="ps">
      <p class="cf6">实例名称/ID：</p>{{ vmInfo.name }}
      </p>
      <p class="ps">
      <p class="cf6">区域：</p>{{ getTheRegion(pveCreateParam.zoneId) }}
      </p>
      <p class="ps">
      <p class="cf6">配置：</p>{{ getarrangement(pveCreateParam.configId) }} *
      {{ pveCreateParam.gpuNum }}
      </p>
      <p class="ps">
      <p class="cf6">磁盘容量：</p>免费容量：{{ storagePrice.defaultStorage }}GB &nbsp;&nbsp;
      付费容量：{{ storage || 0 }}GB
      </p>
      <p class="ps">
      <p class="cf6">镜像：</p>{{ pveCreateParam.imageName }}

      </p>

      <p class="ps">
      <p class="cf6">原计费方式：</p>{{
        vmInfo.chargeType === 0
          ? "按量计费"
          : vmInfo.chargeType === 1
            ? "包日计费"
            : "包月计费"
      }}
      </p>
      <p class="ps">
      <p class="cf6">续费时长：</p>{{ pveCreateParam.payTimes }} {{
        pveCreateParam.chargeType === 0
          ? "小时"
          : pveCreateParam.chargeType === 1
            ? "天"
            : "月"
      }}
      </p>
      <p class="ps">
      <p class="cf6">原到期时间：</p>{{ vmInfo.expireAt }}
      </p>
      <p class="ps">
      <p class="cf6">续费后到期时间：</p>{{ newExpireAt }}
      </p>
      <p class="ps">
      <div v-if="pveCreateParam.chargeType == 0 && storage">
        <span class="cf6"> 磁盘费用：</span>
        <span class="cred f24">
          <span style="font-size: 12px">￥</span>
          <span>{{ formattedPrice }}</span>
        </span>
        <span class="cred mr20" style="font-size: 12px;" v-show="pveCreateParam.chargeType == 0">/天
        </span>
      </div>
      <span class="cf6">配置费用：</span>
      <span class="cred f24">
        <span style="font-size: 12px">￥</span>
        <span v-if="CreateView">{{ CreateView.totalTradeAmount }}</span>
      </span>
      </p>
      <template #footer>
        <div class="noticeFooter2">
          <el-button class="bgBtn" text bg @click="closedialog()">取消</el-button>
          <el-button class="primarybtn" type="primary" :loading="isLoading" @click="handlerenew()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 余额不足多卡弹窗 -->
    <el-dialog 
      class="balanceDialog" 
      v-model="balanceVisible" 
      :width="dialogWidth" 
      :show-close="false"
      :style="{ width: dialogWidth }">
      <template #title>
        <i style="
            margin: 0px 12px 0 0;
            color: rgba(38, 150, 255, 1);
            font-size: 20px;
          " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i> 余额不足
      </template>
      <div class="f14">租用多卡实例，钱包余额需大于10元，余额不足<span class="linkbtn"
          @click="this.$router.push('mine/recharge')">请充值</span>
      </div>
      <template #footer>


        <el-button type="primary" style="width:76px" class="primarybtn" @click="balanceVisible = false">我知道了</el-button>

      </template>
    </el-dialog>

  </div>

</template>
<script>
import { ElMessage } from "element-plus";
import { queryDictData } from "@/api/dictionary";
import {
  configs,
  images,
  create,
  zoneAll,
  vminfo,
  clone,
  change,
  vmStoragePrice,
  vmDiskPrice,
  imageMarket,
  imageUser,
  getRefundInfo,
  getNewPrice,
  changeChargeType,
  renew,
  vmConfigChange,
  matchcouponslist,
  vmChargeCreateView,
  getImgLabels,  
} from "@/api/hosts";
import { Zone } from "@/api/files";
import { getAccount } from "@/api/recharge";
import { ArrowRight } from "@element-plus/icons-vue";
import { Calendar, Search, Plus, Delete } from "@element-plus/icons-vue";
import DictComponent from "@/components/DictComponent.vue";
import router from "@/routers/routes";
import debounce from 'lodash/debounce';
export default {
  name: "hostCreate",
  data() {
    return {
      ArrowRight,
      Search,
      zoneList: [],
      accountInfo: {},
      gpuConfigs: [],
      imagesList: {},
      diyImages: [],
      checkList: [],
      marketImages: [],
      composing: false, // 这个变量用来追踪输入法状态
      selectedVersion: {},
      selectImg: {},
      activezone: null,
      gpuModel: '',
      selectedGpuNum: [
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1,
      ],
      osName: "",
      pveCreateParam: {
        autoRenew: false,
        chargeType: 0,
        configId: '',
        gpuNum: 1,
        imgType: 0,
        isoType: 0,
        imageName: '',
        osName: "",
        osVersion: "",
        templateId: 1,
        vmNum: 1,
        zoneId: null,
        payTimes: 1,
        storage: "",
        imgStorage: null,
        selected: [],
      },
      selectedGpu: {
        unitPrice: 0,
        dayPrice: 0,
        monthPrice: 0,
      },
      datalist: [{}, {}, {}, {}],
      refundInformation: {},
      computedFee: 1,
      isLoading: false,
      markColors: [],
      allProject: [],
      polling: null,
      configLoading: false,
      baseImageLoading: false,
      ordersloading: false,
      queryId: null,
      queryType: null,
      vmInfo: { vmConfigUnit: { unitPrice: "" } },
      showTips: false,
      expansion: false,
      storage: null,
      cost: null,
      storagePrice: {},
      selectedImage: {},
      discount: 1,
      // 弹窗提醒交互逻辑
      imagetype: "",
      selectedIndex: 0,
      fileNotice: false,
      orderConfirmation: false,
      dictValue: "",
      searchValue: "",
      selectedItemId: null,
      Selecteditem: [],
      imageMarketList: [],
      imageMarketListloading: false,
      myimgList: [],
      iconUrl: "",
      renewalVisible: false,
      balanceVisible: false,
      requiredDictTypes: ["payType", "awardEventType", "discountType"],
      activeNames: '1',
      CouponsQueryParam: {
        chargeType: 0,
        gpuModel: "",
        zoneId: 1,
        vmSpend: 0,
        diskSpend: 0,
        selected: []
      },
      listOfOffers: {},
      Couponlist: {},
      CreateView: {
        vmChargeInfoVoList: [{ amount: "0.00" }, { amount: "0.00", }]
      },
      minCapacity: 0, // 默认最小值
      maxCapacity: 400, // 默认最大值
      isexpansion: false,
      expandTheScope: "",
      freestorage: 50,
      mirrorTags: [],
      imgLabels: [], // 标签查询参数
      imageMarketShow: true // 镜像市场显隐
    };

  },
  created() {
    const id = this.$route.query.id;
    const osName = this.$route.query.osName;
    const type = this.$route.query.type;
    const isoType = this.$route.query.imgType;
    console.log('this.$route.query', this.$route.query)
    this.getMyMirrorTagList()
    if (id) {
      this.getVminfo(id).then(() => {
        this.getZone().then(() => {
          if (id) {
            if (type == "toquantity") {
              this.RefundInfo(id);
            }
            // this.expansion = false;
            this.queryId = id;
            this.queryType = type;
            return;
          }
          if (isoType) {
            this.pveCreateParam.isoType = Number(isoType);
            if (isoType == 1) {
              this.searchValue = osName;
              this.getimageMarket().then((res) => {
                if (this.imageMarketList) {
                  this.selectedItemId = this.imageMarketList[0].id;
                  this.Selecteditem = this.imageMarketList[0];
                  this.marketImages = []
                  this.marketImages.push(this.imageMarketList[0]);
                }
              });
              this.fileNotice = true;
            }
            else if (!isoType) {

            }

          } else {
            this.getimageMarket().then(res => {
              this.marketImages = []
              this.marketImages.push(this.imageMarketList[0]);
            });
          }
          this.getImages(0);
        })
      })
    } else {
      console.log('创建实例')
      this.getZone().then(() => {
        // if (id) {
        //   if (type == "toquantity") {
        //     this.RefundInfo(id);
        //   }
        //   this.expansion = false;
        //   this.queryId = id;
        //   this.queryType = type;

        //   return;
        // }
        
        if (isoType) {
          this.pveCreateParam.isoType = Number(isoType);
          if (isoType == 1) {
            this.searchValue = osName;
            this.getimageMarket().then((res) => {
              if (this.imageMarketList) {
                this.selectedItemId = this.imageMarketList[0].id;
                this.Selecteditem = this.imageMarketList[0];
                this.marketImages = []
                this.marketImages.push(this.imageMarketList[0]);
              }
            });
            this.fileNotice = true;
          } else if (isoType == 2) {
            this.getmyimageUser().then(() => {
              const myImgId = this.$route.query.myImgId
              const item = this.myimgList.find(img => img.id == myImgId)
              if (item.storageSize > 50) {
                this.expansion = true;
                this.cost = Math.ceil(item.storageSize - 50)
                this.getStoragePrice(this.cost)
                // ElMessage({
                //   type: "warning",
                //   message: "磁盘不足，已为您自动扩容",
                // });
              } else {
                this.expansion = false;
                this.storage = "";
                this.cost = null
                this.storagePrice.defaultStorage = 50
              }
              this.osName = item.imgName
              this.iconUrl = item.iconUrl;
              this.pveCreateParam.osName = item.imgName;
              this.pveCreateParam.imageName = item.imgName;
              this.pveCreateParam.templateId = item.id;
              this.pveCreateParam.osVersion = item.osVersion;
              this.pveCreateParam.imgStorage = item.storageSize
              this.pveCreateParam.imgType = 2
            })
          }
          else if (!isoType) {

          }

        } else {
          console.log('imageMarketList', this.imageMarketList[0])
          this.getimageMarket().then(res => {
            this.marketImages = []
            this.marketImages.push(this.imageMarketList[0]);
          });
        }
        this.getImages(0);
      })
    }

    this.getDictData();
    // this.getImages(0);
    // this.getImages(1);
    this.getAccountInfo();
    this.getStoragePrice();
    this.getcouponslist()
  },
  watch: {
    pveCreateParam: {
      handler: debounce(function (newVal, oldVal) {
        this.$nextTick(() => {
          this.CouponsQueryParam.chargeType = newVal.chargeType;
          this.CouponsQueryParam.zoneId = newVal.zoneId;
          if (this.$route.query.type !== 'toquantity') {
            this.vmCreateView()
          }
        });
      }, 300), // 300ms debounce time
      deep: true
    },

    selectedGpu(newVal, oldVal) {
      if (this.queryId && this.queryType !== 'clone') {
        this.selectedGpu = this.vmInfo.vmConfigUnit
      }
    },
    Couponlist: {
      handler(newVal, oldVal) {
        if (!Array.isArray(this.Couponlist) || this.Couponlist.length === 0) {
          this.pveCreateParam.selected = [];
          this.checkList = [];
        }
      },
      deep: true
    },
    CouponsQueryParam: {
      handler(newVal, oldVal) {
        nextTick().then(() => {
          if (this.queryType !== 'edit') {
            this.getcouponslist();
          }
        });
      },
      deep: true // 如果 CouponsQueryParam 是一个对象，使用深度监听
    },
    storage: {
      handler: debounce(function (newVal, oldVal) {
        this.$nextTick(() => {
          if (this.$route.query.type !== 'toquantity') {
            this.vmCreateView()
          }
        });
      }, 300), // 300ms debounce time
      deep: true
    },
  }
  ,
  computed: {
    isButtonDisabled() {
      const { balance, currentCouponsAmount } = this.accountInfo;
      const totalAvailable = balance + currentCouponsAmount;
      // 这里你需要替换为你实际要比较的值
      return (
        this.createtotalPrice >= totalAvailable ||
        this.totalPrice >= totalAvailable
      );
    },


    isButtonDisabled2() {
      // 这里你应该添加你的逻辑来决定按钮是否禁用
      // 例如，如果 totalPrice 小于某个值，按钮应该禁用
      const { balance, currentCouponsAmount } = this.accountInfo;
      return this.totalPrice < balance + currentCouponsAmount;
    },
    isRoutePerfectForCreation() {
      // 路由是 'create' 且没有 URL 参数
      return (
        this.$route.path === "/create" &&
        Object.keys(this.$route.query).length === 0
      );
    },
    showTopBar1() {      // 定义不显示 top-bar 的 queryType 类型
      const excludedTypes = ["toquantity", "todailymonthly", "renewal", "clone"];
      // 检查当前 queryType 是否在列表中
      return !excludedTypes.includes(this.queryType);
    },
    showcoupons() {
      // 定义不显示 top-bar 的 queryType 类型
      const excludedTypes = ["toquantity", "edit", "", ""];
      // 检查当前 queryType 是否在列表中
      return !excludedTypes.includes(this.queryType);
    },
    showTopBar() {
      // 定义不显示 top-bar 的 queryType 类型
      const excludedTypes = ["toquantity", "todailymonthly", "renewal", ""];
      // 检查当前 queryType 是否在列表中
      return !excludedTypes.includes(this.queryType);
    },
    showBreadcrumbItem() {
      // 定义显示 breadcrumb 的 queryType 类型
      const includedTypes = ["toquantity", "todailymonthly", "edit", "renewal"];
      // 检查当前 queryType 是否在列表中
      return includedTypes.includes(this.queryType);
    },
    daysBetweenDates() {
      // 确保日期数据存在
      if (!this.vmInfo.chargeAt || !this.vmInfo.expireAt) {
        return 0;
      }
      // 创建日期对象
      const startDate = new Date(this.vmInfo.chargeAt);
      const endDate = new Date(this.vmInfo.expireAt);

      // 计算两个日期之间的差值（毫秒）
      const diff = endDate - startDate;

      // 将毫秒转换为天数
      const days = diff / (1000 * 60 * 60 * 24);

      // 返回天数，可以根据需要四舍五入或向下取整
      return Math.ceil(days);
    },
    newExpireAt() {
      const expireDate = new Date(this.vmInfo.expireAt);
      let payTimesInMilliseconds;
      if (this.pveCreateParam.chargeType === 2) {
        // 将月份转换为毫秒数
        const currentMonth = expireDate.getMonth();
        const currentYear = expireDate.getFullYear();
        const newMonth = currentMonth + this.pveCreateParam.payTimes;
        const newYear = Math.floor(newMonth / 12) + currentYear;
        const remainingMonths = newMonth % 12;
        const newExpireDate = new Date(
          newYear,
          remainingMonths,
          expireDate.getDate(),
          expireDate.getHours(),
          expireDate.getMinutes(),
          expireDate.getSeconds()
        );
        payTimesInMilliseconds = newExpireDate.getTime() - expireDate.getTime();
      } else {
        // 将天数转换为毫秒数
        payTimesInMilliseconds =
          this.pveCreateParam.payTimes * 24 * 60 * 60 * 1000;
      }
      const newExpireDate = new Date(
        expireDate.getTime() + payTimesInMilliseconds
      );
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formattedExpireDate = newExpireDate
        .toLocaleString("zh-CN", options)
        .replace(/\//g, "-");
      return formattedExpireDate;
    },
    // 计算磁盘价格
    formattedPrice() {
      const { chargeType, payTimes } = this.pveCreateParam;
      const dayPrice = this.storagePrice.dayPrice;
      const storage = this.storage
      let price = 0;
      if (chargeType === 0) {
        price = dayPrice * storage;
      } else if (chargeType === 1) {
        price = dayPrice * storage * payTimes;
      } else if (chargeType === 2) {
        price = dayPrice * storage * (payTimes * 30);
      }
      // 如果计算出的价格小于0，则返回0
      if (price < 0) {
        price = 0;
      }
      // 返回格式化后的价格
      return price.toFixed(2);
    },

    filteredGpuConfigs() {
      if (this.queryId && this.queryType == 'edit') {
        // return this.gpuConfigs.filter((item) => item.id == this.vmInfo.configId);
        return this.gpuConfigs;
      } else {
        // console.log('gpuConfigs', this.gpuConfigs)
        return this.gpuConfigs;
      }
    },

    dialogWidth() {
      return "400px";
    },
    // 标签背景色
    moreStyle() {
      return (value, index) => {
        if (index == 0) {
          return {
            color: '#2696FF',
            borderColor: '#15395B',
            backgroundColor: '#111D2C'
          };
        } else {
          switch (value) {
            case '#1FA89F':
              return {
                color: '#1FA89F',
                borderColor: '#214E50',
                backgroundColor: '#0E2525'
              }
              break;
            case '#D6386F':
              return {
                color: '#D6386F',
                borderColor: '#674B55',
                backgroundColor: '#22141B'
              }
              case '#1DA669':
                return {
                  color: '#1DA669',
                  borderColor: '#265440',
                  backgroundColor: '#0F241B'
                }
                break;
              case '#3C9F33':
                return {
                  color: '#3C9F33',
                  borderColor: '#164917',
                  backgroundColor: '#12231D'
                }
                case '#D89614':
                  return {
                    color: '#D89614',
                    borderColor: '#594214',
                    backgroundColor: '#2B2111'
                  }
                  case '#E92D38':
                    return {
                      color: '#E92D38',
                      borderColor: '#532028',
                      backgroundColor: '#210F0F'
                    }
                    case '#CA2BD2':
                      return {
                        color: '#CA2BD2',
                        borderColor: '#522654',
                        backgroundColor: '#240F24'
                      }
                      break;
                    default:
                      return {
                        color: '#2696FF',
                        borderColor: '#15395B',
                        backgroundColor: '#111D2C'
                      };
                      break;
          }
        }
      }
    },
    // 标签是否显示选中符号
    isShowTagIcon() {
      let that = this;
      return (key, index) => {
        if (that.imgLabels && that.imgLabels.length > 0) {
          return that.imgLabels.includes(key);
        } else {
          if (index === 0) {
            return true
          }
          return false
        }
      }
    },
    selectedTags() {
      if (this.imgLabels && this.imgLabels.length > 0) {
        return this.imgLabels.join('、');
      } else {
        return '所有镜像';
      }
    }
  },
  methods: {
    //输入框只能输入数字
    handleInput(event) {
      this.getStoragePrice(event)
      if (this.storage >= this.maxCapacity) {
        this.storage =
          Math.max(1, Math.min(this.maxCapacity, parseInt(this.storage, 10))) || "";
      }
      if (this.storage < this.minCapacity) {
        this.storage =
          Math.max(1, Math.min(this.minCapacity, parseInt(this.storage, 10))) || "";
      }
    },
    expansionchange() {
      if (this.expansion == false) {
        this.storage = null
        this.cost = null
        this.storagePrice.defaultStorage = 50
        this.pveCreateParam.storage = 50
      }
    },
    godocurl(url) {
      window.open(url);
    },
    formattedAmount(amount) {
      return (amount * 10).toFixed(1);
    },
    getcouponslist() {
      if (this.queryId && this.queryType !== 'clone') {
        this.CouponsQueryParam.gpuModel = this.vmInfo.gpu
      }
      matchcouponslist(this.CouponsQueryParam).then((res) => {
        this.Couponlist = res.data;
      });
    },
    handleCheckboxChange() {

      this.pveCreateParam.selected = []
      if (this.checkList.length > 1) {
        // 如果选中的数量大于1，则只保留最后一个选中的
        this.checkList = [this.checkList[this.checkList.length - 1]];
        this.CouponsQueryParam.selected = this.checkList;
        this.pveCreateParam.selected = []
      }
      this.CouponsQueryParam.selected = this.checkList;
      this.pveCreateParam.selected.push(this.checkList[0].code)
      console.log(this.checkList, '123');
    },
    handleChange() { console.log(this.activeNames); },
    //复制分享
    share(row) {
      // 获取基础 URL
      const baseUrl = window.location.href;

      const osName = encodeURIComponent(row.imageName); // 编码 osName 以确保 URL 的正确性
      const shareLink = `${baseUrl}?osName=${osName}`;

      // 检查浏览器是否支持 navigator.clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // 将链接复制到剪贴板
        navigator.clipboard
          .writeText(shareLink)
          .then(() => {
            // 提供用户反馈，告知链接已复制
            this.$message({
              message: "邀请链接已复制到剪贴板",
              type: "success",
            });
          })
          .catch((err) => {
            console.error("复制失败:", err);
            this.$message.error("复制邀请链接失败");
          });
      } else {
        // 如果不支持 navigator.clipboard，提供备选方案
        this.copyFallback(shareLink);
      }
    },
    // 创建一个临时文本框并将文本复制到其中
    copyFallback(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      // 提示用户链接已复制
      this.$message({
        message: "邀请链接已复制到剪贴板",
        type: "success",
      });
    },
    //打开镜像市场
    openmarket() {
      this.fileNotice = true;
      this.imgLabels = []
      this.dictValue = "";
      this.searchValue = "";
      this.getimageMarket();
      this.checkTextWidth();
    },
    checkTextWidth() {
      this.$nextTick(() => {
        // console.log("Refs:", this.$refs);
        // setTimeout(() => {
        //   this.imageMarketList.forEach((item, index) => {
        //     const spanRef = this.$refs['appNames' + index];
        //     // console.log(`Ref 'appNames' + ${index}:`, spanRef);
        //     if (spanRef && spanRef[0]) {
        //       const span = spanRef[0];
        //       const width = span.offsetWidth;
        //       // console.log(`Width of 'appNames' + ${index}:`, width);
        //       this.$set(item, 'popoverDisabled', width < 380);
        //       // console.log(`popoverDisabled of item ${index}:`, item.popoverDisabled);
        //     } else {
        //       console.error(`Ref 'appNames' + ${index} not found`);
        //     }
        //   });
        // }, 100); // 延迟 100 毫秒
      });
    },

    fileNoticeClose() {
      this.searchValue = "";
      // this.getimageMarket();
      this.selectedIndex = 0;
      this.selectedItemId = null;
    },
    //关闭弹窗
    closedialog() {
      this.selectedIndex = 0;
      this.selectedItemId = null;
      this.renewalVisible = false;
      this.fileNotice = false;
      this.orderConfirmation = false;
    },
    //获取磁盘价格
    async getStoragePrice(price) {
      const params = {
        storage: Number(price) || 0
      }
      const res = await vmDiskPrice(params);
      console.log('vmDiskPrice', res)
      if (res.code == 200) {
        this.storagePrice = res.data
        this.storagePrice.dayPrice = res.data.diskPrice;
        if (res.data.totalStorage <= 100 && res.data.totalStorage > res.data.defaultStorage) {
          this.storagePrice.defaultStorage = res.data.totalStorage
          this.storage = 0
        } else {
          this.storagePrice.defaultStorage = res.data.defaultStorage
          this.storage = res.data.payStorage
        }
        this.pveCreateParam.storage = res.data.totalStorage
      }
    },
    SelectMirror(item) {
      console.log('SelectMirror', item)
      this.Selecteditem = item;
      this.selectedItemId = item.id;
    },
    //获取镜像市场列表
    async getimageMarket() {
      console.log('configId', this.pveCreateParam.configId)
      this.imageMarketList = []
      this.imageMarketListloading = true
      var imageLabels 
      if (this.imgLabels &&this.imgLabels.length > 0) {
        imageLabels = this.imgLabels.join(',')
      } else {
        imageLabels = ''
      }
      const res = await imageMarket({
        imageType: '1',
        labels: imageLabels,
        searchValue: this.searchValue,
        configId: this.pveCreateParam.configId,
        zoneId: this.activezone
      });
      if (res.code == 200) {
        this.marketImages = []
        this.imageMarketList = res.data;
        if (res.data.length) {
          this.marketImages.push(this.imageMarketList[0]);
        }
        this.imageMarketListloading = false
      }
    },
    //获取实例信息
    async getVminfo(id) {
      const res = await vminfo({ id });
      if (res.code == 200) {
        this.vmInfo = res.data;
        this.pveCreateParam.zoneId = res.data.zoneId;
        this.pveCreateParam.gpuNum = res.data.gpuNum;
        this.pveCreateParam.imgStorage = res.data.storage
        // console.log(this.pveCreateParam.gpuNum);
        // this.storage = Math.ceil(res.data.storage - this.freestorage);
        if (Number(res.data.storage) > 50) {
          this.cost = Math.ceil(res.data.storage - 50)
          this.getStoragePrice(this.cost)
          this.expansion = true
          // ElMessage({
          //   type: "warning",
          //   message: "磁盘不足，已为您自动扩容",
          // })
        } else {
          this.expansion = false;
          this.storagePrice.defaultStorage = 50
          this.storage = "";
          this.cost = null;
        }
        this.minCapacity = res.data.storage - this.freestorage;
        if (res.data.vmConfigUnit.configNum) {
          this.pveCreateParam.configId = res.data.configId;
        }
        if (this.pveCreateParam.gpuNum > res.data.vmConfigUnit.configNum && this.$route.query.type !== "todailymonthly") {
          this.pveCreateParam.gpuNum = 1
        }
        this.pveCreateParam.imageName = res.data.imageName
        this.pveCreateParam.chargeType = res.data.chargeType;
        this.selectedGpu = {
          unitPrice: res.data.vmConfigUnit.unitPrice, dayPrice: res.data.vmConfigUnit.dayPrice, monthPrice: res.data.vmConfigUnit.monthPrice,
        }
        if (this.$route.query.type == "todailymonthly") {
          this.pveCreateParam.chargeType = 1;
        }
        // this.getConfigs(this.pveCreateParam.zoneId);
      } else {
        ElMessage({
          type: "warning",
          message: res.message,
        });
      }
    },
    //获取退款
    async RefundInfo(id) {
      this.ordersloading = true;
      const res = await getRefundInfo({ id });
      if (res.code == 200) {
        this.ordersloading = false;
        this.refundInformation = res.data;
      } else {
        ElMessage({
          type: "warning",
          message: res.message,
        });
        this.ordersloading = false;
      }
    },
    //获取地区
    async getZone() {
      try {
        const res = await zoneAll();
        if (res.code == 200) {
          this.zoneList = res.data;
          this.imageMarketShow = res.data.some(zone => zone.displayImageMarket);
          if ( this.$route.query.id ) {
            this.activezone = this.pveCreateParam.zoneId
          } else {
            if (this.$route.query.zoneId) {
              this.activezone = Number(this.$route.query.zoneId)
              this.pveCreateParam.zoneId = Number(this.$route.query.zoneId)
            } else {
              this.pveCreateParam.zoneId = this.zoneList[0].id;
              this.activezone = this.zoneList[0].id;
            }
          }
          this.getConfigs(this.pveCreateParam.zoneId);
          this.getmyimageUser();
        }
      } catch (error) { }
    },
    //选择镜像
    selectItem(index, item) {
      this.dictValue = item.dictValue;
      this.selectedIndex = index;
      this.getimageMarket();
      this.imageMarketListloading = false
    },
    //镜像选择
    changeMirror() {
      if (this.Selecteditem.length == 0) {
        ElMessage({
          type: "warning",
          message: "请选择镜像！",
        });
        return;
      }
      this.selectImg = this.Selecteditem
      console.log('this.selectImg', this.selectImg)
      // this.marketImages = [];
      // this.marketImages.push(this.Selecteditem);

      this.selectedItemId = null;
      this.fileNotice = false;
      const selectedImage = this.selectImg;
      
      if (selectedImage.storageSize > 50) {
        this.expansion = true;
        // this.storage = Math.ceil(((selectedImage.imgSize - 100) * 100)/ 100 ) 
        this.cost = Math.ceil(((selectedImage.storageSize - 50) * 100)/ 100 ) 
        this.getStoragePrice(this.cost)
        // ElMessage({
        //   type: "warning",
        //   message: "磁盘不足，已为您自动扩容",
        // });
      } else {
        this.expansion = false;
        this.storage = "";
        this.cost = "";
        this.storagePrice.defaultStorage = 50
      }
      // let img = this.marketImages[0];
      this.pveCreateParam.osName = this.selectImg.osName;
      this.pveCreateParam.imageName = this.selectImg.imageName;
      this.pveCreateParam.templateId = this.selectImg.id;
      this.pveCreateParam.osVersion = this.selectImg.osVersion;
      this.pveCreateParam.imgStorage = this.selectImg.storageSize
      this.pveCreateParam.imgType = 1;
    },
    async getAccountInfo() {
      const res = await getAccount();
      this.accountInfo = res.data;
    },
    //地区切换
    handleTabClick(tab) {
      console.log('tab', tab)
      const zoneItem = this.zoneList.find(zone => zone.id == tab);
      this.imageMarketShow = zoneItem.displayImageMarket
      this.selectedGpu = {
        unitPrice: 0,
        dayPrice: 0,
        monthPrice: 0,
      };
      this.computedFee++;
      this.activezone = tab;
      console.log('activezone', this.activezone)
      this.pveCreateParam.configId = '';
      this.pveCreateParam.zoneId = tab;
      this.selectedGpuNum = [
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1,
      ];
      this.marketImages = []
      if (this.pveCreateParam.isoType == 2) {
        this.pveCreateParam.imageName = "";
        this.pveCreateParam.osName = ''
        this.osName = ''
      }
      this.pveCreateParam.isoType = 0
      this.pveCreateParam.gpuNum = 1;
      this.expansion = false
      this.isexpansion = false
      this.storage = ''
      // this.getImages(0);
      // this.pveCreateParam.imageName = "";
      this.iconUrl = "";
      this.getmyimageUser();
      this.getConfigs(tab);
      this.getImages(0)

    },
    handleimgTabClick(tab) {
      console.log('====', tab.paneName);
      this.getStoragePrice(0)
      this.osName = "";
      this.iconUrl = "";
      this.expansion = false;
      this.storage = 0;
      this.cost = 0 
      this.getImages(1);
      // this.getimageMarket();
      this.pveCreateParam.imgType = tab.paneName;
      this.pveCreateParam.osName = "";
      this.pveCreateParam.templateId = "";
      this.pveCreateParam.imageName = '';
      this.pveCreateParam.osVersion = "";
      this.pveCreateParam.imgStorage = null
      if (tab.paneName == 0) {
        let keys = Object.keys(this.imagesList);
        this.pveCreateParam.osName = keys[0];
        this.pveCreateParam.imageName = this.imagesList[keys[0]][0].imageName;
        this.pveCreateParam.templateId = this.imagesList[keys[0]][0].id;
        this.pveCreateParam.osName = this.imagesList[keys[0]][0].osName;
        this.pveCreateParam.imgStorage = this.imagesList[keys[0]][0].storageSize
        // Object.entries(res.data).forEach(([key, value]) => {
        //   this.selectedVersion[key] = value[0].osVersion;
        //   this.pveCreateParam.osVersion = this.imagesList[keys[0]][0].osVersion;
        // });
        if (this.imagesList[keys[0]][0].storageSize > 50) {
          // ElMessage({
          //   type: "warning",
          //   message: "磁盘不足，已为您自动扩容",
          // })
          this.expansion = true;
          this.cost = Math.ceil(((this.imagesList[keys[0]][0].storageSize - 50) * 100)/ 100 )
          this.getStoragePrice(this.cost)
        } else {
          this.expansion = false;
          this.storage = null
          this.cost = null
          this.storagePrice.defaultStorage = 50
        }
      }
      if (tab.paneName == 1) {
        this.getimageMarket().then(() => {
          let img = this.marketImages[0];
          this.selectImg = this.marketImages[0]
          console.log('img22', img)
          this.pveCreateParam.osName = img.osName;
          this.pveCreateParam.imageName = img.imageName;
          this.pveCreateParam.templateId = img.id;
          this.pveCreateParam.osVersion = img.osVersion;
          this.pveCreateParam.imgStorage = img.storageSize
          if (img.storageSize > 50) {
            // ElMessage({
            //   type: "warning",
            //   message: "磁盘不足，已为您自动扩容",
            // })
            this.expansion = true;
            // this.storage = Math.ceil(((img.imgSize - 100) * 100)/ 100 )
            this.cost = Math.ceil(((img.storageSize - 50) * 100)/ 100 )
            this.getStoragePrice(this.cost)
          } else {
            this.expansion = false;
            this.storage = null
            this.cost = null
            this.storagePrice.defaultStorage = 50
          }
        })
      }
    },
    // 获取配置列表
    async getConfigs(zoneId, noDefault) {
      if (!noDefault) {
        this.configLoading = true;
      }
      try {
        const res = await configs({ zoneId });
        console.log('resZ', res)
        if (res.code !== 200) {
          console.log(res.message);
          return;
        }
        this.gpuConfigs = res.data.list;
        this.configLoading = false;
        if (noDefault) {
          return;
        }
        if (res.data.list && res.data.list.length > 0) {
          let selectedGpu = null;
          for (const item of res.data.list) {
            if (item.id === res.data.defaultId) {
              this.CouponsQueryParam.gpuModel = item.gpu;
              if (item.configNum) {
                this.pveCreateParam.configId = res.data.defaultId || res.data.list[0].id;
              }
            }
            if (item.id === this.vmInfo.configId || item.id === res.data.defaultId) {
              selectedGpu = item;
              break;
            }
          }
          res.data.list.forEach((config, index) => {
            if (config.id == res.data.defaultId) {
              if (config.configCapacities.length) {
                this.maxCapacity = config.configCapacities[0].storageAvailableMaxSizeGb
              }
              if (!this.maxCapacity) {
                this.isexpansion = false
                this.expandTheScope = `容量范围：${this.minCapacity} - ${this.maxCapacity}`
              } else {
                this.expandTheScope = `容量范围：${this.minCapacity} - ${this.maxCapacity}`
              }
            }
          });
          this.selectedGpu = selectedGpu;
        }
        if (this.vmInfo && this.vmInfo.gpuNum) {
          this.pveCreateParam.configId = this.vmInfo.configId
          this.gpuConfigs.forEach((config, index) => {
            if (config.id === this.vmInfo.configId) {
              const gpuNum = this.vmInfo.gpuNum;
              const freeGpuNum = this.vmInfo.vmConfigUnit.configNum;
              const selectedIndex = this.queryType === 'edit' ? 1 : index + 1;
              this.selectedGpuNum[index + 1] = this.vmInfo.gpuNum
            }
          });
        }
        if (this.queryId) {
          return;
        }
      } catch (error) {
        console.error('Error fetching configs:', error);
      }
    }
    ,
    //轮询
    startPolling() {
      this.polling = setInterval(() => {
        this.getConfigs(this.pveCreateParam.zoneId, true);
      }, 1000 * 1);
    },
    //获取基础镜像
    async getImages(isoType) {
      // console.log('configId', this.pveCreateParam.configId)
      this.baseImageLoading = true;
      let obj = { 
        zoneId: this.pveCreateParam.zoneId,
        configId: this.pveCreateParam.configId
      }
      
      const res = await images(obj);

      if (res.code == 200) {
        this.baseImageLoading = false;
        if (isoType == 0) {
          this.imagesList = res.data;
          let keys = Object.keys(res.data);
          console.log('res', res.data)
          // console.log('zoneId', this.pveCreateParam.osName)
          this.pveCreateParam.osName = keys[0];
          this.pveCreateParam.imageName = res.data[keys[0]][0].imageName;
          this.pveCreateParam.templateId = res.data[keys[0]][0].id;
          this.pveCreateParam.osName = res.data[keys[0]][0].osName;
          this.pveCreateParam.imgStorage = res.data[keys[0]][0].storageSize
          Object.entries(res.data).forEach(([key, value]) => {
            this.selectedVersion[key] = value[0].osVersion;
            this.pveCreateParam.osVersion = res.data[keys[0]][0].osVersion;
          });
          if (res.data[keys[0]][0].storageSize > 50) {
            this.expansion = true
            this.cost = Math.ceil(res.data[keys[0]][0].storageSize - 50)
            this.getStoragePrice(this.cost)
              // ElMessage({
              //   type: "warning",
              //   message: "磁盘不足，已为您自动扩容",
              // });
          } else {
            this.expansion = false;
            this.storage = null;
            this.cost = null
            this.storagePrice.defaultStorage = 50
          }
        } else if (isoType == 1) {

        }
      } else {
        // this.baseImageLoading = false
        this.imagesList = []
      }
    },
    handleSelectVersion(val, key) {
      this.selectedVersion[key] = val;
    },
    handleCpu(cores) {
      this.cores = cores;
    },
    handleGpu(gpu, i) {
      // console.log('gpu00000', gpu)
      if (gpu.configNum < i) {
        return;
      }
      this.CouponsQueryParam.gpuModel = gpu.gpu
      this.selectedGpu = gpu;
      gpu.configCapacities.forEach(item => {
        if (item.gpuDevicesCount) {
          this.maxCapacity = item.storageAvailableMaxSizeGb
        }
      });
      // this.getImages(0) // 基础镜像
      // this.getimageMarket() // 镜像市场
      // this.getmyimageUser() // 我的镜像
      // if (this.osName) {
      //   this.osName = ''
      // }
      this.pveCreateParam.configId = gpu.id;
      this.pveCreateParam.gpuNum = i;
    },
    handleOsName(key) {
      this.pveCreateParam.templateId = this.imagesList[key][0].id;
      this.pveCreateParam.osVersion = this.selectedVersion[key];
      this.pveCreateParam.imageName = this.imagesList[key][0].imageName;
      this.pveCreateParam.imgStorage = this.imagesList[key][0].storageSize
      const selectedImage = this.imagesList[key][0];
      if (selectedImage.storageSize > 50) {
        this.expansion = true;
        this.cost = Math.ceil(selectedImage.storageSize - 50)
        this.getStoragePrice(this.cost)
        // this.storage = Math.ceil(selectedImage.storage - 100);
        // ElMessage({
        //   type: "warning",
        //   message: "磁盘不足，已为您自动扩容",
        // });
      } else {
        this.expansion = false;
        this.cost = null
        this.storage = null
        this.storagePrice.defaultStorage = 50
      }
    },
    handleVer(key, item, ver) {
      console.log('item', item)
      this.pveCreateParam.osName = key;
      this.pveCreateParam.templateId = item.id;
      this.pveCreateParam.osVersion = ver;
      this.pveCreateParam.imageName = item.imageName;
      this.pveCreateParam.imgStorage = item.storageSize
      this.selectedImage = item;
      if (item.storageSize > 50) {
        this.expansion = true
        this.cost = Math.ceil(item.storageSize - 50)
        this.getStoragePrice(this.cost)
      } else {
        this.expansion = false
        this.storage = null
        this.cost = null
        this.storagePrice.defaultStorage = 50
      }
    },
    //选择我的镜像
    handmyimg(item) {
      if (item.storageSize > 50) {
        this.expansion = true;
        // this.storagePrice.defaultStorage = 100
        // this.storage = Math.ceil(item.imgSize - 100);
        this.cost = Math.ceil(item.storageSize - 50);
        this.getStoragePrice(this.cost)
        // ElMessage({
        //   type: "warning",
        //   message: "磁盘不足，已为您自动扩容",
        // });
      } else {
        this.expansion = false;
        this.storagePrice.defaultStorage = 50
        // this.pveCreateParam.storage = item.imgSize
        this.storage = "";
        this.cost = null;
      }
      this.pveCreateParam.imgStorage = item.storageSize
      this.pveCreateParam.osName = item.imgName;
      this.pveCreateParam.imageName = item.imgName;
      this.pveCreateParam.templateId = item.id;
      this.pveCreateParam.osVersion = item.osVersion;
      this.iconUrl = item.iconUrl;
      this.osName = item.imgName;
      this.pveCreateParam.imgType = 2;
    },
    getTheRegion(id) {
      // console.log('====', id)
      const item = this.zoneList.find((item) => item.id == id);
      return item ? item.description : "";
    },
    getarrangement(id) {
      const item = this.gpuConfigs.find((item) => item.id == id);
      this.gpuModel = item.gpu
      return item ? item.gpu + " / " + item.vram + "GB" : "";
    },
    createAButton() {
      if (!this.pveCreateParam.configId) {
        ElMessage({
          type: "error",
          message: "请选择配置！",
        });
        return;
      }
      if (!this.pveCreateParam.osName) {
        ElMessage({
          type: "error",
          message: "请选择镜像！",
        });
        return;
      }
      if (this.accountInfo.allowedAmount < 10 && this.pveCreateParam.gpuNum > 1) {
        this.balanceVisible = true;
        return
      }
      if (this.pveCreateParam.storage < this.pveCreateParam.imgStorage) {
        ElMessage({
          type: "error",
          message: "磁盘容量小于所需磁盘大小，所需磁盘容量："+ this.pveCreateParam.imgStorage + "GB",
        });
        return
      }
      // console.log('this.pveCreateParam', this.pveCreateParam)
      this.orderConfirmation = true;
    },
    //续费按钮
    renewalbtn() {
      this.renewalVisible = true;
    },
    concatenateAppNames(applications) {
      return applications.map((app) => app.name).join("   |   ");
    },

    //创建新的镜像
    async handleCreate() {
      this.isLoading = true;
      this.pveCreateParam.osVersion =
        this.selectedVersion[this.pveCreateParam.osName];
      let { pveCreateParam } = this;
      if (pveCreateParam.chargeType == 0) {
        pveCreateParam.autoRenew = false;
        pveCreateParam.payTimes = 0;
      }
      // pveCreateParam.storage = this.storagePrice.totalStorage
      
      // if (this.expansion) {
      //   // 创建部分传递总容量
      //   pveCreateParam.storage = Number(this.storage);
      // } else {
      //   pveCreateParam.storage = 0;
      // }
      const params = { ...pveCreateParam };
      try {
        const res = await create(params);
        if (res.code == 200) {
          this.isLoading = false;
          ElMessage({
            type: "success",
            message: "创建成功",
          });
          this.$router.push({ path: "/hosts" });
        } else {
          this.isLoading = false;
          ElMessage({
            type: "error",
            message: res.message,
          });
        }
      } catch (error) {
        this.isLoading = false;
        ElMessage({
          type: "error",
          message: "创建失败，请联系管理员",
        });
      }
    },
    //克隆镜像
    async handleClone() {
      if (this.accountInfo.allowedAmount < 10 && this.pveCreateParam.gpuNum > 1) {
        this.balanceVisible = true;
        return
      }
      this.isLoading = true;
      let { pveCreateParam } = this;
      if (pveCreateParam.chargeType == 0) {
        pveCreateParam.autoRenew = false;
        pveCreateParam.payTimes = 0;
      }
      const params = {
        autoRenew: pveCreateParam.autoRenew,
        chargeType: pveCreateParam.chargeType,
        cloneId: this.queryId,
        configId: pveCreateParam.configId,
        gpuNum: pveCreateParam.gpuNum,
        payTimes: pveCreateParam.payTimes,
        vmNum: pveCreateParam.vmNum,
        zoneId: pveCreateParam.zoneId,
        selected: pveCreateParam.selected,
        storage: pveCreateParam.storage
      };
      // params.storage = this.storage;
      if (!params.configId) {
        ElMessage({
          type: "error",
          message: '请选择配置',
        });
        this.isLoading = false;
        return
      }
      const res = await clone(params);
      if (res.code == 200) {
        this.isLoading = false;
        ElMessage({
          type: "success",
          message: res.message,
        });
        this.$router.push({ path: "/hosts" });
      } else {
        this.isLoading = false;
        ElMessage({
          type: "error",
          message: res.message,
        });
      }
    },
    async handleEdit() {
      if (this.accountInfo.allowedAmount < 10 && this.pveCreateParam.gpuNum > 1) {
        this.balanceVisible = true;
        return
      };
      this.isLoading = true;
      let { pveCreateParam } = this;
      console.log(pveCreateParam, 'pveCreateParam', this.vmInfo, 'pveCreateParam');
      console.log(this.vmInfo, 'this.vmInfo');

      if (pveCreateParam.gpuNum == this.vmInfo.gpuNum && pveCreateParam.configId == this.vmInfo.configId) {
        ElMessage({
          type: "error",
          message: "请调整显卡数量",
        });
        this.isLoading = false;
        return;
      }
      if (pveCreateParam.chargeType == 0) {
        pveCreateParam.autoRenew = false;
        pveCreateParam.payTimes = 0;
      }
      const params = {
        id: this.queryId,
        gpuNum: pveCreateParam.gpuNum,
        configId: pveCreateParam.configId,
      };
      if (this.expansion) {
        params.storage = this.vmInfo.storage + Number(this.storage);
      } else {
        params.storage = this.vmInfo.storage;
      }
      const res = await vmConfigChange(params);
      if (res.code == 200) {
        this.isLoading = false;
        ElMessage({
          type: "success",
          message: res.message,
        });
        this.$router.push({ path: "/hosts" });
      } else {
        this.isLoading = false;
        ElMessage({
          type: "error",
          message: res.message,
        });
      }
    },
    async getDictData() {
      try {
        const res = await queryDictData({ type: "markColor" });
        const res1 = await queryDictData({ type: "imageType" });
        const res2 = await queryDictData({ type: "Project" });
        if (res1.code == 200) {
          this.imagetype = res1.data;
        }
        if (res.code == 200) {
          this.markColors = res.data;
        }
        if (res2.code == 200) {
          this.allProject = res2.data;
        } else {
          console.log(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    matchMarkColor(label) {
      let markColor = "";
      this.markColors.map((item) => {
        if (item.dictLabel == label) {
          markColor = item.dictValue;
        }
      });
      return markColor;
    },
    async getmyimageUser() {
      let obj = { 
        zoneId: this.pveCreateParam.zoneId,
        configId: this.pveCreateParam.configId 
      };
      await imageUser(obj).then((res) => {
        console.log('imageUser', res)
        if (res.code == 200) {
          this.myimgList = res.data;
        }

      });
    },
    // 退费table样式
    headerCellStyle() {
      return {
        backgroundColor: "#0b1320",
        color: "rgba(255, 255, 255, 0.45)",
      };
    },
    cellStyle() {
      return {
        backgroundColor: "#1D222A",
        color: "rgba(255, 255, 255, 0.6)",
      };
    },
    handlechangeChargeType(type) {
      if (type == "amount") {
        this.isLoading = true
        let obj = {
          chargeType: 0,
          id: this.vmInfo.id,
          payTimes: "",

        };
        changeChargeType(obj).then((res) => {
          if (res.code == 200) {
            ElMessage({
              type: "success",
              message: res.message,
            });
            this.$router.push({ path: "/hosts" });
          } else {
            ElMessage({
              type: "error",
              message: res.message,
            });
          }
          this.isLoading = false
        });
      }
      if (type == "monthlySubscription") {
        let obj = {
          chargeType: this.pveCreateParam.chargeType,
          id: this.vmInfo.id,
          payTimes: this.pveCreateParam.payTimes,
          selected: this.pveCreateParam.selected,
        };
        changeChargeType(obj).then((res) => {
          if (res.code == 200) {
            ElMessage({
              type: "success",
              message: res.message,
            });
            this.$router.push({ path: "/hosts" });
          } else {
            ElMessage({
              type: "error",
              message: res.message,
            });
          }
        });
      }
    },
    //
    match(val) {
      let text = "";
      this.allProject.map((item) => {
        if (item.dictValue == val) {
          text = item.dictLabel;
        }
      });
      return text;
    },
    //续费按钮
    handlerenew() {
      this.isLoading = true;
      let obj = {
        chargeType: this.pveCreateParam.chargeType,
        id: this.queryId,
        payTimes: this.pveCreateParam.payTimes,
        selected: this.pveCreateParam.selected,
      };
      renew(obj).then((res) => {
        if (res.code == 200) {
          this.isLoading = false;
          ElMessage({
            type: "success",
            message: "续费成功",
          });
          this.$router.push({ path: "/hosts" });
        } else {
          this.isLoading = false;
          ElMessage({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    calculateBasePrice() {
      const { chargeType, gpuNum, vmNum, payTimes } = this.pveCreateParam;
      // console.log(this.selectedGpu[
      //   chargeType == 0
      //     ? "unitPrice"
      //     : chargeType == 1
      //       ? "dayPrice"
      //       : "monthPrice"
      // ], 'price');
      const gpuPrice = this.calculatePrice(
        this.selectedGpu[
        chargeType == 0
          ? "unitPrice"
          : chargeType == 1
            ? "dayPrice"
            : "monthPrice"
        ],
        gpuNum,
        vmNum,
        payTimes,
        1, // 原价不打折
        chargeType
      );
      const storagePrice = this.calculatePrice(
        this.storagePrice.dayPrice,
        this.storage,
        1,
        payTimes,
        1, // 原价不打折
        chargeType
      );
      if (chargeType == 2) {
        return Number(gpuPrice) + Number(storagePrice * 30);
      } else { return Number(gpuPrice) + Number(storagePrice); }
    },
    calculateDiscount(basePrice) {
      if (this.CouponsQueryParam.selected.length === 0) {
        return 0;
      }
      const coupon = this.CouponsQueryParam.selected[0];
      if (coupon.discountType === 0) {
        // 满减优惠
        return basePrice >= coupon.minSpend ? coupon.amount : 0;
      } else if (coupon.discountType === 1) {
        // 折扣优惠
        return basePrice * (1 - coupon.amount);
      }
      return 0;
    },
    calculateDiscountedPrice(originalPrice, basePrice, discountAmount) {
      const discountRatio = originalPrice / basePrice;
      return (originalPrice - discountAmount * discountRatio).toFixed(2);
    },
    //通用计算函数
    calculatePrice(price, quantity, vmNum, payTimes, discount, chargeType) {
      // 打印所有参数
      // console.log("calculatePrice called with:");
      // console.log("price:", price);
      // console.log("quantity:", quantity);
      // console.log("vmNum:", vmNum);
      // console.log("payTimes:", payTimes);
      // console.log("discount:", discount);
      // console.log("chargeType:", chargeType);

      // 确保所有参数都是有效的数字
      const validPrice = price != null ? price : 0;
      const validQuantity = quantity != null ? quantity : 0;
      const validVmNum = vmNum != null ? vmNum : 0;
      const validPayTimes = payTimes != null ? payTimes : 0;
      const validDiscount = discount != null ? discount : 1;

      if (chargeType === 0) {
        // 按小时计费
        return (validPrice * validQuantity * validVmNum * validDiscount).toFixed(2);
      } else if (chargeType === 1) {
        // 按天计费
        return (validPrice * validQuantity * validVmNum * validPayTimes * validDiscount).toFixed(2);
      } else if (chargeType === 2) {
        // 按月计费（假设每月30天）
        return (validPrice * validQuantity * validVmNum * validPayTimes * validDiscount).toFixed(2);
      }
      return 0; // 如果没有匹配的 chargeType，返回 0
    },
    // 立即创建/克隆费用预览
    vmCreateView() {
      let obj = {
        chargeType: this.pveCreateParam.chargeType,
        configId: this.pveCreateParam.configId,
        gpuNum: this.pveCreateParam.gpuNum,
        payTimes: this.pveCreateParam.payTimes,
        selected: this.pveCreateParam.selected,
        storage: Number(this.storage),
        zoneId: this.pveCreateParam.zoneId
      }
      vmChargeCreateView(obj).then((res) => {
        if (res.code == 200) {
          this.CreateView = res.data,
            this.CouponsQueryParam.vmSpend = this.CreateView.vmChargeInfoVoList[0].amount
          this.CouponsQueryParam.diskSpend = this.CreateView.vmChargeInfoVoList[1].amount
        }
      })

    },
    // 获取镜像标签
    getMyMirrorTagList() {
      let obj = {
        imgType: 1
      }
      getImgLabels(obj)
        .then((res) => {
          console.log('=====', res)
          const newObj = Object.assign({
            "所有镜像": "#15395B"
          }, res.data);
          this.mirrorTags = newObj;
        }).catch(err => {
          this.mirrorTags = {};
        })
    },
    // 选择tag标签
    handleSelectTag(key, index) {
      console.log('key--', key)
      console.log('index--', index)
      // 所有镜像
      if (index === 0) {
        this.imgLabels = [];
      } else {
        // 基础镜像单选
        if (this.imgLabels) {
          let _index = this.imgLabels.indexOf(key);
          if (_index > -1) {
            this.imgLabels.splice(_index, 1);
          } else {
            this.imgLabels.push(key);
          }
        }
        console.log('this.imgLabels', this.imgLabels)
      }
      this.getimageMarket()
      // this.publicQueryMethod();
    },
    //格式化时间
    formatDate(dateString) {
      return dateString ? dateString.replace('T', ' ') : '';
    }
  },
  
  mounted() {
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  setup() { },
};
</script>
<style lang="less" scoped>
// 提取的样式
@import '../../assets/css/create.less';
</style>

<style lang="less">
.fc85 {
  color: rgba(0, 0, 0, 0.85);
}
.el-popover.el-popper {
  border: none !important;
  background: #D7DBE2 !important;
  border-radius: 10px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.48),
    0px 6px 16px 0px rgba(0, 0, 0, 0.32), 0px 9px 28px 0px rgba(0, 0, 0, 0.2) !important;
}

.notice_pop {
  padding: 0 !important;

  .notice_content {
    font-size: 14px;
    padding: 15px 8px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
  }
}

/* 如果是在全局样式文件中，可能需要增加权重或使用更具体的选择器 */
.el-input-number.disabled-input .el-input__inner {
  --el-disabled-text-color: rgba(255, 255, 255, 0.3);
  /* 将禁用状态下的文字颜色改为红色 */
}

.el-select-dropdown__item {
  display: flex;
  align-items: center;

  color: rgba(0, 0, 0, 0.85);
}

.selectPop1 .el-select-dropdown__wrap {
  max-height: 388px !important;
}
</style>

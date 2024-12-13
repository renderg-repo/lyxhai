<template>
  <div class="container flex-column">
    <div class="title">
      GPU实例
      <el-popover popper-class="notice_pop" placement="right" :offset="10" trigger="hover" :width="380"
        popper-style="padding: 5px 8px;">
        <template #reference>
          <i class="spacehpc_iconfont hpc_basic_icon_info_circle" style="margin-left: 10px; font-size: 20px"></i>
        </template>
        <div class="notice_card">
          <div class="notice_content" style="color: rgba(0, 0, 0, 0.85)">
            关机期间不计费，关机状态持续 7 天，自动删除实例。
          </div>
        </div>
      </el-popover>
    </div>
    <template v-if="!isEmpty">
      <div class="top-bar">
        <div>
          <el-button class="primarybtn universalMediumbtn" @click="goto('/create')" type="primary"><img
              src="@/assets/images/hosts/+.svg" style="margin-right: 6px; height: 16px; width: 16px"
              alt="" />创建实例</el-button>
          <el-button @click="handleRefresh" class="ghostbtn universalMediumbtn" style="padding: 7px 16px 7px 14px">
            <i style="font-size: 16px; margin-right: 6px; font-size: 16px"
              class="spacehpc_iconfont hpc_basic_icon_refresh_bt"></i>
            刷新列表
          </el-button>
        </div>
        <div class="flex">
          <el-input @change="getList" clearable class="input input-bg" placeholder="搜索实例名称、ID、配置"
            v-model="queryParams.searchValue" style="width: 300px"> <template v-slot:suffix>
              <i class="icon hpc_basic_icon_search f22"></i>
            </template></el-input>
          <el-link type="primary" style="margin: 0px 10px" @click="getHelp" :underline="false">帮助</el-link>
        </div>
      </div>
      <el-table 
        ref="tableRef" 
        row-key="id" 
        class="table-container table" 
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0)" 
        :data="vmList" 
        :row-style="{ height: '126px' }"
        :cell-style="cellStyle" 
        @selection-change="handleSelectionChange">
        <el-table-column label="实例名称/ID" prop="id" min-width="200" sortable>
          <template #default="{ row }">
            <div class="flex justity-between">
              <div class="name" v-show="!(showID == row.id)" :title="row.name">
                {{ row.name }}
              </div>
              <el-input 
                :key="row.id" ref="editInput" 
                v-if="showID == row.id " 
                v-model="hostName" 
                maxlength="20" 
                :placeholder="row.name"
                @input="editHostnameInput"
                @change="editHostname(row.id)"
                @blur="inputBlur(row.id)"></el-input>
              <i v-if="row.status !== 'deleted' && row.status !== 'destroy' "
                class="spacehpc_iconfont f22 hpc_gpu_icon_edit copy_icon"
                @click="handleEditHostname($event, row.id)"></i>
            </div>
            <div class="flex justity-between">
              <div style="color: rgba(0, 0, 0, 0.45)">{{ row.vmid }}</div>
              <i v-if="row.status != 'destroy'" class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon f22"
                @click="copyClick(`${row.vmid}`)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="180">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="filterPop tablePop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allStatus || filters.isAllStatus ? 'check' : ''
                      ">{{ column.label }}</span>
                    <i class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allStatus || filters.isAllStatus
                      ? 'checked'
                      : ''
                      "></i>

                  </div>
                </template>
                <div>
                  <el-checkbox style="margin-bottom: 0px" v-model="filters.allStatus"
                    :indeterminate="filters.isAllStatus" @change="handleCheckAllChange('status', $event)">全部状态
                  </el-checkbox>
                  <el-divider />
                  <el-checkbox-group class="checkGroup" v-model="filters.status"
                    @change="handleCheckboxGrop('status', $event)">
                    <el-checkbox v-for="item in allStatus" :key="item.dictValue" :value="item.dictLabel">
                      {{ item.dictLabel }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </template>
          <template #default="scope">
            <div style="display: flex; place-items: center">
              <span v-if="scope.row.status" class="dot" :class="matchBg(scope.row.status)"></span>
              <div class="cf85 flex-align-center flex-between flex-1">
                <p>{{ match(scope.row.status) }}</p>
                <span v-if="scope.row.vmProgress">{{ scope.row.vmProgress.progress }}%</span>
              </div>
            </div>
            
            <div class="flex cf45 f12" style="margin:3px 0px 0px 15px"
              v-if="scope.row.status == 'stopping' && scope.row.chargeType == 0">
              已结束计费</div>
            <div class="flex cf45 f12" style="margin:3px 0px 0px 15px"
              v-if="scope.row.status == 'locking'">
              {{ matchReason(scope.row.statusReasonCode) }}</div>
            <div 
            v-if="scope.row.vmProgress && 
                  scope.row.status == 'starting' && 
                  scope.row.vmProgress.stage == 'vm_progress_image_sync'"
              class=" cf45 f12" style="margin:3px 0px 0px 15px">
              <el-progress :percentage="scope.row.vmProgress.progress" :show-text="false" stroke-width="2" style="margin: 6px 0 ;" />
              <p class="flex-between flex-align-center">
                <span>首次创建较慢，未计费</span>
              </p>
            </div>
            <div class="flex cf45 f12" style="margin:3px 0px 0px 15px"
              v-if="(scope.row.chargeType == 0 && scope.row.status == 'created' || 
                    scope.row.chargeType == 0 && scope.row.status == 'starting' || 
                    scope.row.chargeType == 0 && scope.row.status == 'running') && !scope.row.vmProgress">
              未开始计费</div>
            <div class="flex cf45 f12" style="margin:3px 0px 0px 15px"
              v-if="scope.row.vmConfigUnit && scope.row.status == 'stopped' && scope.row.vmConfigUnit.configNum < scope.row.gpuNum && scope.row.chargeType == 0">
              GPU不足</div>
            <div class="cred  flex f12" v-if="scope.row.usedStorage / scope.row.storage > 0.95"
              style="margin-left: 15px;">
              磁盘预警</div>
            <div class="flex" v-if="!scope.row.gpuStart">
              <el-icon>
                <Remove />
              </el-icon>
              <span style="margin-left: 5px"> 无卡模式</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="计费" min-width="120">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="tablePop filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allChargeTypes || filters.isAllChargeTypes
                      ? 'check'
                      : ''
                      ">{{ column.label }}</span>
                    <i class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allChargeTypes || filters.isAllChargeTypes
                      ? 'checked'
                      : ''
                      "></i>
                  </div>
                </template>
                <div>
                  <el-checkbox style="height: 22px;margin-bottom: 0px" v-model="filters.allChargeTypes"
                    :indeterminate="filters.isAllChargeTypes"
                    @change="handleCheckAllChange('ChargeTypes', $event)"><span style="">全部计费</span>
                  </el-checkbox>
                  <el-divider style="margin-top: 20px 0px 0px 0px;" />
                  <el-checkbox-group class="checkGroup" v-model="filters.ChargeTypes"
                    @change="handleCheckboxGrop('ChargeTypes', $event)">
                    <el-checkbox style="height: 22px;" v-for="item in ChargeTypes" :key="item.dictValue"
                      :value="item.dictValue">
                      <span style="color: rgba(0, 0, 0, 0.85)">{{
                        item.dictLabel
                      }}</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </template>
          <template #default="{ row }">
            <div v-show="row.chargeType == 0" style="color: rgba(0, 0, 0, 0.85)">按量计费</div>
            <div v-show="row.chargeType == 1" style="color: rgba(0, 0, 0, 0.85)">包日计费</div>
            <div v-show="row.chargeType == 2" style="color: rgba(0, 0, 0, 0.85)">包月计费</div>
          </template>
        </el-table-column>
        <el-table-column label="配置" prop="gpuNum" min-width="180">
          <template #default="{ row }">
            <p>{{ row.gpu }}*{{ row.gpuNum }}卡</p>
            <el-popover 
              :offset="5" 
              :width="320" 
              popper-class="filterPop"
              popper-style="padding: 30px 15px 10px 30px !important;width:311px" :show-arrow="false"
              placement="bottom-start">
              <template #reference>
                <el-link type="primary" :underline="false">查看详情</el-link>
              </template>
              <div>
                <p v-if="row.chargeType == 0">
                  费用：￥{{ row.useUnitPrice }}元/时
                </p>
                <p v-if="row.chargeType == 1">
                  费用：￥{{ row.useDayPrice }}元/日
                </p>
                <p v-if="row.chargeType == 2">
                  费用：￥{{ row.useMonthPrice }}元/月
                </p>
                <p style="
                    height: 1px;
                    background-color: #26303e;
                    margin: 20px 0px;
                  "></p>
                <p>CPU： {{ row.cores }}核心</p>
                <p>内存： {{ row.ram }}GB</p>
                <p>GPU： {{ row.gpu }}*{{ row.gpuNum }}卡</p>
                <p>CUDA版本： {{ row.cudaVersion }}</p>
                <p>显存： {{ row.vram }}GB</p>
                <p>镜像： {{ row.imageName }}</p>
                <p v-if="row.status != 'destroy'">
                  系统盘： {{ row.usedStorage }}GB/{{ row.storage }}GB
                </p>
                <p>
                  磁盘费用： 
                  <span >{{ row.storage < 100 ? row.storage : 100 }} </span>GB(免费)
                  <span >{{ row.storage > 100 ? Number(row.storage) - 100 : 0 }}</span>GB(付费)
                </p>
                <p>
                  计费方式：{{ getChargeTypeText(row.chargeType) }}
                  <!-- {{  new Date(row.expireAt) - new Date()  }} -->
                  <el-switch v-if="row.chargeType && new Date(row.expireAt) - new Date() > 0"
                    :disabled="new Date(row.expireAt) - new Date() < 180000"
                    style="padding: 0px 5px 0px 5px; min-width: 20px" v-model="row.expireUnit" size="small"
                    @change="automaticConversion(row)" /><span
                    v-if="row.chargeType && new Date(row.expireAt) - new Date() > 0">到期后转按量</span>
                </p>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="计划" :show-overflow-tooltip="true" min-width="200">
          <template #header="{ column }">
            <div style="display: flex; width: 100%; justify-content: space-between">
              <span>计划</span>
              <el-popover popper-class="notice_pop" placement="top" :offset="10" trigger="hover" :width="356"
                popper-style="padding: 5px 8px;">
                <template #reference>
                  <img src="@/assets/images/hosts/warning (3).svg" style="width: 12px" alt="" />
                </template>
                <div class="notice_card">
                  <div class="notice_content" style="color: rgba(0, 0, 0, 0.85); font-size: 14px">
                    到期时间是包日包月实例到期时间，到期后自动关机。
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
          <template #default="{ row }">
            <template v-if="row.chargeType == '0' && row.status !== 'destroy'">
              <div v-if="row.shutdownAt == null && row.status == 'ready'">
                <p>手动关机</p>
                <el-link :disabled="row.status !== 'ready'" @click="handleSetVisible(row)" type="primary"
                  :underline="false">设置关机时间</el-link>
              </div>
              <div v-if="row.freedAt && row.status == 'stopped' || row.freedAt && row.status == 'error' || row.freedAt && row.status == 'createdError'">
                <vue-countdown 
                  :time="(Number(row.freedAtSeconds)*1000)" 
                  :transform="transformSlotProps"
                  :interval="1000 * 60" 
                  v-slot="{ days, hours, minutes }">
                  {{ days }}天{{ hours }}小时{{ minutes }}分后删除
                   <!-- <span class="cred"
                    @click="handleConfirm(row, 'destroy')">删除</span> -->
                </vue-countdown>
              </div>
              <div v-if="row.shutdownAt && !row.freedAt && row.status == 'ready'">
                <div>
                  <vue-countdown 
                    v-if="Number(row.shutdownAtSeconds) >= 60"
                    :time="(Number(row.shutdownAtSeconds)*1000)" 
                    :transform="transformSlotProps"
                    :interval="1000 * 60"
                    v-slot="{ days, hours, minutes }">
                    {{ days }}天{{ hours }}小时{{ minutes }}分后关机
                  </vue-countdown>
                  <div v-else>{{ row.shutdownAtSeconds  }} 秒后关机</div>
                </div>
                <div v-if=" row.shutdownAtSeconds > 60">
                  <el-link type="primary" :underline="false" 
                  @click="handleSetVisible(row)" v-if="row.status !== 'destroy'">修改</el-link>
                  <el-link type="primary" :underline="false"  style="margin-left: 16px"
                    @click="Shutdownbutton(row)" v-if="row.status !== 'destroy'">取消</el-link>
                </div>
                
              </div>
            </template>
            <template v-else>
              <div v-if="
                row.status !== 'destroy' &&
                new Date(row.expireAt) - new Date() > 0">
                <span :style="{ color: isExpiringSoon(row.expireAt) ? '#FF9000' : 'inherit' }"> {{ row.expireAt }}
                  到期</span>
                  <!-- isExpiringSoon(row.expireAt) -->
                <div
                  v-show="new Date(row.expireAt) - new Date() > 180000 && isExpiringSoon(row.expireAt)"
                  class="linkbtn" @click="handleRoute(row, 'renewal')">续费
                </div>
              </div>
              <div v-if="
                row.status !== 'destroy' &&
                new Date(row.expireAt) - new Date() < 0
              ">
                <vue-countdown :time="new Date(row.freedAt) - new Date()" :interval="1000 * 60"
                  v-slot="{ days, hours, minutes }">
                  {{ days }}天{{ hours }}小时{{ minutes }}分后删除 
                  <!-- <span class="cred"
                    @click="handleConfirm(row, 'destroy')">删除</span> -->
                </vue-countdown>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="区域" prop="zoneId" min-width="120">
          <template #header="{ column }">
            <div class="filter">
              <el-popover :show-arrow="false" popper-class="tablePop filterPop" trigger="click" placement="bottom">
                <template #reference>
                  <div>
                    <span class="label" :class="filters.allArea || filters.isAllArea ? 'check' : ''
                      ">{{ column.label }}</span>
                    <i class="spacehpc_iconfont hpc_basic_icon_filter" :class="filters.allArea || filters.isAllArea ? 'checked' : ''
                      "></i>
                  </div>
                </template>
                <div>
                  <el-checkbox class='mb0' v-model="filters.allArea" :indeterminate="filters.isAllArea"
                    @change="handleCheckAllChange('area', $event)">全部区域
                  </el-checkbox>
                  <el-divider />
                  <el-checkbox-group class="checkGroup" v-model="filters.area"
                    @change="handleCheckboxGrop('area', $event)">
                    <el-checkbox v-for="item in areas" :key="item.name" :value="item.name">
                      {{ item.description }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </template>
          <template #default="{ row }">
            <span class="cf6">
              {{ matchArea(row.zoneId) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="登录信息" prop="username" min-width="300">
          <template #default="{ row }">
            <div class="cf6" v-if="row.status == 'ready'">
              <template v-if="row.osType !== 'windows'">
                <div class="flex justity-between">
                  <span>ssh root@{{ row.sshLoginHost }} -p {{ row.sshLoginPort }}</span>
                  <i class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon" @click="
                    copyClick(`ssh root@${row.sshLoginHost} -p ${row.sshLoginPort}`)
                    "></i>
                </div>
                <div class="flex justity-between">
                  **********
                  <i class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon"
                    @click="copyClick(`${row.sshLoginPassword}`)"></i>
                </div>
              </template>
              <template v-else-if="row.osType == 'windows'">
                <div class="flex justity-between">

                  <span>{{ row.sshLoginHost }}:{{ row.sshLoginPort }}</span>

                  <i class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon"
                    @click="copyClick(`${row.sshLoginHost}:${row.sshLoginPort}`)"></i>
                </div>
                <div class="flex justity-between">
                  Administrator
                  <i class="spacehpc_iconfont hpc_ssh_icon_copy copy_icon" @click="copyClick(`Administrator`)"></i>
                </div>
                <div class="flex justity-between">
                  **********
                  <i class="spacehpc_iconfont hpc_ssh_icon_copy copy_icon"
                    @click="copyClick(`${row.sshLoginPassword}`)"></i>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="应用" prop="applications" min-width="140">
          <template #default="{ row }">
            <template v-if="row.appInfos && row.status == 'ready'">
              <div v-for="item in row.appInfos" :key="item.id">
                <template v-if="row.gpuStart || item.appName !== '应用服务'">
                  <el-link v-show="item.display" type="primary" :underline="false"
                    :href="getUrlWithHostname(item.accessUrl, item.authInfo, item)" target="_blank"
                    :title="item.appName">
                    <div class="truncate">
                      {{ item.appName }}
                    </div>
                  </el-link>
                </template>
              </div>
              <div 
                v-if="row.osType !== 'windows' && row.status == 'ready'" 
                class="linkbtn" 
                @click="portMapping(row)">
                端口映射
              </div>
            </template>

          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="130">
          <template #default="{ row }">
            <template v-if="row.status != 'destroy'" >
              <el-button 
                v-if="row.lastStartAt == null ? row.status == 'ready' : 
                      row.status == 'ready' || 
                      row.status == 'starting' || 
                      row.status == 'running' || 
                      row.status == 'stopping' || 
                      row.status == 'created'" 
                      :disabled="shutdownStatus(row) "
                 link @click="handleConfirm(row, 'shutdown')">关机</el-button>
              <el-button v-if="row.lastStartAt == null ?  
                               row.status == 'stopped' : 
                               row.status == 'stopped' || 
                               row.status == 'error' " 
                :disabled="row.status == 'deleted'"
                 link @click="handleConfirm(row, 'start')">开机</el-button>
              <el-popover 
                v-if="row.status != 'createdError' && row.status != 'deleted' && 
                      row.lastStartAt != null" 
                      trigger="hover" 
                      v-model="opearatPopVisible" 
                      :show-arrow="false" 
                      placement="bottom-end"
                      :hide-after="0"
                      width="134" popper-style="border: none;padding: 0;min-width: 134px;">
                <template #reference>
                  <el-button link>
                    <i style="font-size: 20px" class="spacehpc_iconfont hpc_basic_icon_more"></i>
                  </el-button>
                </template>
                <div class="operate" >
                  <el-tooltip placement="left-start" effect="dark" content="按量计费实例关机后可使用无卡模式开机。费用为0.2元/时"
                    v-if="row.chargeType == '0'">
                    <el-link :class="{ itemcf: row.status == 'stopped', item: true }" :disabled="!(row.status == 'stopped' && row.chargeType == '0')
                      " :underline="false" @click="handleConfirm(row, 'noGPU')">
                      无卡模式开机
                    </el-link>
                  </el-tooltip>
                  <el-tooltip placement="left-start" effect="dark" content="按量计费实例关机后可以升降配置">
                    <el-link :disabled="row.status !== 'stopped'"
                      :class="{ itemcf: row.status == 'stopped', item: true }" :underline="false"
                      @click="handleRoute(row, 'edit')">
                      升降配置
                    </el-link>
                  </el-tooltip>
                  <el-tooltip placement="left-start" effect="dark" content="关机状态下可以扩容">
                    <el-link :class="{ itemcf: row.status == 'stopped', item: true }" :underline="false"
                      :disabled="row.status !== 'stopped'" @click="handleExpansion(row, 'expansion')">
                      磁盘扩容
                    </el-link>
                  </el-tooltip>
                  <el-tooltip placement="left-start" effect="dark" content="关机状态下可以保存">
                    <el-link class="item" :underline="false" :disabled="row.status !== 'stopped'"
                      :class="{ itemcf: row.status == 'stopped', item: true }" @click="handlesaveimage(row)">
                      保存镜像
                    </el-link>
                  </el-tooltip>
                  <el-tooltip v-if="row.chargeType !== 0" placement="left-start" effect="dark"
                    content="包日包月实例可以转按量计费，实例无需关机">
                    <el-link :disabled="!(
                      (row.status == 'stopped' ||
                        row.status == 'ready') &&
                      row.chargeType !== 0
                    ) || (new Date(row.expireAt) - new Date() < 180000 && new Date(row.expireAt) - new Date() > 0)
                      " :underline="false"
                      :class="{
                        itemcf:
                          (row.status == 'stopped' ||
                            row.status == 'ready') &&
                          row.chargeType !== 0,
                        item: true,
                      }" @click="handleRoute(row, 'toquantity')">
                      转按量计费
                    </el-link>
                  </el-tooltip>
                  <el-tooltip v-if="row.chargeType !== 0" placement="left-start" effect="dark"
                    content="包日包月实例可以直接续费，实例无需关机">
                    <el-link :disabled="!(
                      (row.status == 'stopped' ||
                        row.status == 'ready') &&
                      row.chargeType !== 0
                    ) || (new Date(row.expireAt) - new Date() < 180000 && new Date(row.expireAt) - new Date() > 0)
                      " :underline="false"
                      :class="{
                        itemcf:
                          (row.status == 'stopped' ||
                            row.status == 'ready') &&
                          row.chargeType !== 0,
                        item: true,
                      }" @click="handleRoute(row, 'renewal')">
                      续费
                    </el-link>
                  </el-tooltip>
                  <el-tooltip v-if="row.chargeType == 0" placement="left-start" effect="dark" :content="row.gpuStart == false
                    ? '无卡模式下，若需切换包日包月，请先关机再进行操作。'
                    : '按量计费实例可以转包日包月计费，实例无需关机'
                    ">
                    <el-link :disabled="!(
                      (row.status == 'stopped' ||
                        row.status == 'ready') &&
                      row.chargeType == 0 &&
                      row.gpuStart !== false
                    )
                      " :underline="false" :class="{
                        itemcf:
                          (row.status == 'stopped' ||
                            row.status == 'ready') &&
                          row.chargeType == 0 &&
                          row.gpuStart !== false,
                        item: true,
                      }" @click="handleRoute(row, 'todailymonthly')">
                      转包日包月
                    </el-link>
                  </el-tooltip>
                  <el-tooltip placement="left-start" effect="dark" content="关机状态下可克隆实例">
                    <el-link :disabled="row.status !== 'stopped'"
                      :class="{ itemcf: row.status == 'stopped', item: true }" :underline="false"
                      @click="handleRoute(row, 'clone')">
                      克隆
                    </el-link>
                  </el-tooltip>
                  <el-tooltip placement="left-start" effect="dark" content="开机状态下才可重启">
                    <el-link class="item" :underline="false" @click="handleConfirm(row, 'reboot')"
                      :class="{ itemcf: row.status == 'ready', item: true }" :disabled="row.status != 'ready'">
                      重启
                    </el-link>
                  </el-tooltip>
                  <el-tooltip placement="left-start" effect="dark" :content="row.chargeType != 0 ? '包日包月实例不可以删除' : '删除后实例不可恢复'">
                    <el-link :class="{
                      itemcf:
                        row.status !== 'ready',
                      item: true,
                    }" 
                    :underline="false" 
                    :disabled="row.status == 'ready' || row.chargeType != 0"
                    @click="handleConfirm(row, 'destroy')">
                      删除
                    </el-link>
                  </el-tooltip>
                </div>
              </el-popover>
              <el-button 
                v-if="(row.chargeType == 0 && row.status == 'createdError') || 
                row.lastStartAt == null " 
                link @click="handleConfirm(row, 'destroy')">删除</el-button>
              <p 
                v-if="row.chargeType !== 0 && row.status == 'createdError'"
                 style="color: #df444d; font-size: 14px; cursor: pointer;"
                 @click="openGlobalDialog()"
                 >请联系客服</p>
            </template>
          </template>
        </el-table-column>
        <template #append v-if="(listData.pageNum == listData.totalPage ||
          listData.totalPage == 0) &&
          !loading
          ">
          <div v-if="queryParams.searchValue && listData.length == 0" class="noMoreData flex-1">
            搜索无结果
          </div>
          <div v-if="(listData.totalPage == 0 || listData.list == null) && !loading"
            class="noMoreData flex-1">
            暂无更多
          </div>
        </template>
      </el-table>
      <!-- </div> -->
      <div class="pagination-bar pagination">
        <el-pagination 
          class="input-bg" 
          popper-class="pagination-bar" 
          @size-change="handleSizeChange"
          @current-change="handlePagination" 
          :current-page="queryParams.pageNum" 
          :total="totalCount"
          :page-size="queryParams.pageSize" 
          :page-sizes="[10, 20, 30, 50]" 
          layout="total,prev,pager,next,sizes,jumper">
        </el-pagination>
      </div>
    </template>
    <template v-if="isEmpty">
      <div class="empty">
        <div class="flex justity-between flex-1">
          <div>
            <div class="title">专为AI而生的高性能云</div>
            <div class="des">
              <p>经济，高效且专业的分布式GPU云。</p>
              <p style="margin-top: 15px">开发，训练，扩展AI应用程序。</p>
            </div>
            <el-button class="primarybtn" @click="goto('/create')" type="primary" style="border-radius: 8px">
              立即创建
              <img style="margin-left: 6px" src="@/assets/images/hosts/right.png" />
            </el-button>
          </div>
          <img src="@/assets/images/hosts/GPU.png" width="200" height="200" alt="" />
        </div>
      </div>
    </template>
    <!-- 确认弹窗 -->
    <el-dialog class="confirmDialog" :show-close="false" :style="{ width: dialogWidth }" v-model="confirmVisible">
      <div class="flex">
        <i class="spacehpc_iconfont hpc_basic_icon_info_filled" :style="iconStyle"></i>

        <div class="flex confirmContent" v-if="editType !== 'expansion'">
          确认
          <span v-if="editType == 'start'">开机</span>
          <span v-if="editType == 'shutdown'">关机</span>
          <span v-if="editType == 'noGPU'">无卡模式开机</span>
          <span v-if="editType == 'clone'">克隆实例</span>
          <span v-if="editType == 'reboot'">重启实例</span>
          <span v-if="editType == 'destroy'">删除实例</span>
          <span v-if="editType == 'cancelShutdown'">取消定时关机</span>
          吗？
        </div>
        <div class="flex confirmContent" v-if="
          row &&
          row.chargeType !== 0 &&
          new Date(row.expireAt) < new Date() &&
          editType == 'expansion'
        ">
          实例包日包月到期，需转按量计费或续费后方可启用磁盘扩容功能
        </div>
      </div>
      <div>
        <p v-if="editType == 'shutdown' && row.chargeType == 0" class="descript">
          关机期间不计费，关机状态持续 7 天，自动删除实例。
        </p>
        <p v-if="editType == 'shutdown' && row.chargeType == 0" class="descript">
          关机后释放 GPU 资源，再次开机可能会面临 GPU 不足无法开机。是否关机？
        </p>
        <p v-if="editType == 'shutdown' && row.chargeType !== 0" class="descript">
          <!-- 包卡的实例关机后GPU将继续为您保留，您可以随时开机使用。 -->
          已预付此实例费用，暂不建议关机。如有问题，可联系客服。
        </p>
        <p v-if="editType == 'noGPU'" class="descript">
          按量计费实例关机后可使用无卡模式开机。费用为0.2元/时
        </p>
        <p v-if="editType == 'clone'" class="descript">关机状态下可克隆实例</p>
        <p v-if="editType == 'start' && row.chargeType == 0" class="descript">
          实例将按￥{{
            (row.vmConfigUnit.unitPrice * row.gpuNum).toFixed(2)
          }}/时整点扣费
        </p>
        <p v-if="editType == 'reboot'" class="descript">开机状态下才可重启</p>
        <p v-if="editType == 'edit'" class="descript">
          按量计费实例关机后下可升降配置
        </p>

      </div>

      <template #footer>
        <el-button v-if="
          row &&
          row.status != 'stopped' &&
          editType != 'start' &&
          editType != 'shutdown' &&
          editType != 'reboot' &&
          editType != 'noGPU' &&
          editType != 'destroy' && editType != 'cancelShutdown'
        " type="primary" class="primarybtn newbtn" @click="confirmVisible = false">
          我知道了
        </el-button>
        <template v-else>
          <el-button class="ghostbtn newbtn" @click="confirmVisible = false">取消</el-button>
          <el-button v-show="editType == 'start'" v-if="
            !(
              row &&
              row.chargeType !== 0 &&
              new Date(row.expireAt) < new Date()
            )
          " class="primarybtn newbtn" type="primary" @click="handleOperate(editID, 'start')">确定</el-button>
          <el-button v-show="editType == 'start'" v-if="
            row && row.chargeType !== 0 && new Date(row.expireAt) < new Date()
          " class="primarybtn newbtn" type="primary" @click="confirmVisible = false">确定</el-button>
          <el-button v-if="
            row &&
            row.chargeType !== 0 &&
            new Date(row.expireAt) < new Date() &&
            editType == 'expansion'
          " class="primarybtn newbtn" type="primary" @click="confirmVisible = false">确定</el-button>
          <el-button v-show="editType == 'shutdown'" class="primarybtn newbtn" type="primary"
            @click="handleOperate(editID, 'shutdown')">确定</el-button>
          <el-button v-show="editType == 'cancelShutdown'" class="primarybtn newbtn" type="primary"
            @click="cancelShutdown(row)">确定</el-button>
          <el-button v-show="editType == 'noGPU'" class="primarybtn newbtn" type="primary"
            @click="handleNoGpuStart(editID)">确定</el-button>

          <el-button v-show="editType == 'clone'" class="primarybtn newbtn" type="primary"
            @click="handleRoute(row, 'clone')">确定</el-button>
          <el-button v-show="editType == 'edit'" class="primarybtn" type="primary"
            @click="handleRoute(row, 'edit')">确定</el-button>
          <el-button v-show="editType == 'reboot' && batchList.length > 0" class="primarybtn newbtn" type="primary"
            @click="handleBatchReboot">确定</el-button>
          <el-button v-show="editType == 'reboot' && batchList.length <= 0" class="primarybtn newbtn" type="primary"
            @click="handleReboot(editID)">确定</el-button>
          <el-button v-show="editType == 'destroy' && batchList.length > 0" class="primarybtn newbtn warningbtn"
            type="primary" @click="handleBatchDel">确定</el-button>
          <el-button :loading="btnloading" v-show="editType == 'destroy' && batchList.length <= 0"
            class=" newbtn warningbtn" type="primary" @click="handleDel(editID)">确定</el-button>
        </template>
      </template>
    </el-dialog>
    <!-- 倒计关机弹窗 -->
    <el-dialog class="setDialog" :title="setile" style="width: 516px" v-model="setVisible">
      <div>
        <el-form class="set" label-width="106" label-position="right" :model="setFormData" ref="setForm"
          :rules="setRules" hide-required-asterisk>
          <el-form-item label="设置关机时间：" prop="setDate" style="align-items: center">
            <el-row :gutter="10" style="height: 32px">
              <el-col :span="13">
                <el-date-picker type="date" v-model="setFormData.setDate" :disabled-date="disabledDate"
                  value-format="YYYY-MM-DD" style="width: 160px" @change="sumConstDate">
                </el-date-picker>
              </el-col>
              <el-col :span="10">
                <el-form-item>
                  <el-time-select 
                    class="timeSelect" 
                    popper-class="selectPop10" 
                    ref="timeSelect"
                    v-model="setFormData.setime" 
                    :start="startTime" 
                    end="23:59" 
                    step="00:30" 
                    placeholder=" "  
                    @change="sumConst" 
                     
                    style="width: 140px" filterable>
                  </el-time-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="账户余额：">
            ￥{{ accountInfo.balance }}
          </el-form-item>
          <el-form-item label="支付券余额：">
            ￥{{ accountInfo.currentCouponsAmount }}
            <span class="cf45">（优先抵扣）</span>
          </el-form-item>
          <el-form-item label="预计消费：" style=" line-height: 20px">
            <span class="cred">￥</span>
            <span class="cred f24" style=" line-height: 20px;    position: relative;
    top: -4px;" >{{
              (unitPrice * constime).toFixed(2)
            }}</span>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="flex flex-center">
          <el-button class="button bg-btn newbtn" text bg @click="setVisible = false">取消</el-button>
          <el-button style="margin-left: 30px" class="primarybtn button newbtn" type="primary"
            @click="handleSetFree('setForm')">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 磁盘扩容弹窗 -->
    <el-dialog 
      class="expansionDialog" 
      @close="expansionClose"
      title="磁盘扩容" 
      style="width: 530px" 
      v-model="expansionVisible">
      <div>
        <el-form label-position="right" label-width="82px">
          <el-form-item label="当前总计：">
            <span class="volume">{{ Number(row.storage) + Number(expansionVol) }} GB</span>
          </el-form-item>
          <el-form-item label="扩容：">
            <div class="flex flex-1">
              <div class="flex-1">
                <el-input 
                  class="input-bg" 
                  @keydown.enter.prevent 
                  @input="handleInput" 
                  v-model="expansionVol"
                  :placeholder=expandTheScope />
              </div>
              <div class="cf6 ml10">GB</div>
            </div>
            <div class="des">
              系统将在每天凌晨 0
              点根据当天峰值使用量（不论实例是否运行）进行扣费。
            </div>
          </el-form-item>
          <el-form-item label="磁盘费用：">
            <div class="flex">
              <span class="currency">￥</span>
              <div class="price" v-if="row.chargeType == 2 || row.chargeType == 1">
                <!-- -->
                <span v-if="Number(row.storage) > 100 && !totalPrice ">
                  {{ (diffDays *
                    storagePrice.dayPrice *
                    ((Number(row.storage) > 100 ? Number(row.storage) - 100 : 0) +
                      Number(expansionVol)) ).toFixed(2) }}
                </span>
                <span v-else> {{ (totalPrice).toFixed(2) }}</span>
              </div>

              <div class="price" v-if="row.chargeType == 0">
                <span v-if="Number(row.storage) > 100 && !totalPrice " >
                  {{
                    (
                      ((Number(row.storage) > 100
                        ? Number(row.storage) - 100
                        : 0) +
                        Number(expansionVol)) *
                      storagePrice.dayPrice.toFixed(2)
                    ).toFixed(2)
                  }}
                </span>
                <span v-else> {{ (totalPrice).toFixed(2) }}</span>
                <!-- <span class="price" v-else>{{ storagePrice.dayPrice }}</span> -->
                <span class="currency">/日</span>
              </div>

              <span v-if="row.chargeType == 2 || row.chargeType == 1" class="cf6" style="margin-left: 10px">({{
                currentDateFormatted }}至{{
                  formatDate(row.expireAt)
                }})</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button class="bgBtn newbtn" text bg style="width: 120px; line-height: 36px; height: 36px"
            @click="this.expansionVisible = false">取消</el-button>
          <el-button 
            class="primarybtn newbtn" 
            style="
              width: 120px;
              margin-left: 29px;
              line-height: 36px;
              height: 36px;
            " type="primary"
            :loading="expandLoading" 
            @click="setExpansion">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 保存镜像弹窗 -->
    <el-dialog class="saveImageDialog" title="保存镜像" style="width: 450px" v-model="saveImageVisible"
      @opened="onDialogOpened" @close="closedialog">
      <div>
        <div class="flex flex-1">
          <el-input class="input-bg" style="width: 100%" @keydown.enter.prevent maxlength="25" ref="createInput"
            v-model="imgname" placeholder="请输入镜像名称" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer" style="padding-right: 5px">
          <el-button style="border: 1px solid rgba(255, 255, 255, 0.15)" class="newbtn ghostbtn"
            @click="closedialog()">取消</el-button>

          <el-button class="primarybtn button newbtn" type="primary" @click="setImage()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 计费方式变换弹窗 -->
    <el-dialog v-model="billingVisible" style="width: 600px">
      <template #title>
        <i style="
            margin: 3px 12px 0 0;
            color: rgba(38, 150, 255, 1);
            font-size: 16px;
          " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i>
        <span>请关闭定时关机后转包日包月</span>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="primarybtn newbtn" type="primary" @click="billingVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 升降配置弹窗 -->
    <el-dialog v-model="liftingVisible" class="liftingDialog" style="width: 700px">
      <template #title> </template>
      <i style="
          margin: 3px 12px 0 0;
          color: rgba(38, 150, 255, 1);
          font-size: 16px;
        " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i>
      <span class="cf85 f14">升降配置仅支持按量计费实例。如需调整配置，请先转按量计费后再进行升降配置操作</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="primarybtn newbtn" type="primary" @click="liftingVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 包日包月实例到期后开机弹窗 -->
    <el-dialog v-model="expireAtVisible" class="expireAtDialog" title="实例开机" style="width: 480px">
      <div class="flex" style="line-height: 20px">
        <i style="margin-right: 10px; color: #2696ff; font-size: 16px"
          class="spacehpc_iconfont hpc_basic_icon_info_filled"></i>
        <span class="cf85">原包日/包月计费周期已结束，请重新选择计费方式。</span>
      </div>
      <div class="flex flex-center" style="margin-top: 18px">
        <el-radio-group v-model="expireAtboot" class="ml-4">
          <el-radio value="1" size="large">包日/包月续费</el-radio>
          <el-radio value="2" size="large">转按量计费</el-radio>
        </el-radio-group>
      </div>

      <template #footer>
        <div class="dialog-footer" style="padding-right: 5px;text-align: center">
          <el-button style="border: none" class="bgBtn" @click="closedialog()">取消</el-button>

          <el-button class="primarybtn button" type="primary" @click="expireAtDialoggo()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 转按量弹窗 -->
    <el-dialog v-model="toquantityVisible" class="toquantityDialog" title="转按量计费" style="width: 530px">
      <div class=" " style="line-height: 20px; flex-flow: column">
        <p class="ps">
        <p class="cf6">实例名称/ID：</p>
        {{ row.name }}
        </p>

        <p class="ps">
        <p class="cf6">区域：</p>
        {{ matchArea(row.zoneId) }}
        </p>

        <p class="ps">
        <p class="cf6">配置：</p>
        {{ row.gpu + " / " + row.vram + "GB" + "*" + row.gpuNum + "卡" }}
        </p>

        <p class="ps">
        <p class="cf6">磁盘容量：</p>
        免费容量：100GB &nbsp;&nbsp; 付费容量：<span v-if="row.storage > 100"> {{ row.storage - 100 || 0 }}</span><span
          v-else>0</span>GB
        </p>
        <p class="ps">
        <p class="cf6">镜像：</p>
        {{ row.imageName }}
        </p>

        <p class="ps">
        <p class="cf6">计费方式：</p>
        {{ getChargeTypeText(0) }}
        </p>
        <p class="ps">
          <span class="cf6"> 磁盘费用：</span>
          <span class="cred f24">
            <span style="font-size: 12px">￥</span>
            <span>{{
              (storagePrice.dayPrice * (row.storage > 100 ? (row.storage - 100) : 0)).toFixed(2)
            }}</span>
          </span>
          <span class="cred" style="font-size: 12px">/日 </span>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <span class="">配置费用：</span>

          <span class="cred f24">
            <span style="font-size: 12px">￥</span>
            <span>{{ row.vmConfigUnit.unitPrice }}</span>
          </span>
          <span class="cred" style="font-size: 12px">/时</span>
        </p>
      </div>

      <template #footer>
        <div class="noticeFooter" style="padding-right: 5px">
          <el-button class="bgBtn" @click="closedialog()">取消</el-button>

          <el-button class="primarybtn button" :loading="btnloading" type="primary"
            @click="handlechangeChargeType()">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 开机无卡弹窗 -->
    <el-dialog class="shortagegpuDialog" v-model="shortagegpuVisible" :show-close="false" width="550px"
      style="width: 550px">
      <template #title>
        <i style="
            margin: 3px 14px 0 0;
            color: rgba(38, 150, 255, 1);
            font-size: 16px;
          " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i>
        <span>该主机空闲GPU不足</span>
      </template>
      <div class="body">
        <div class="line">实例GPU需求数量：{{ row.gpuNum }}卡</div>
        <div class="line" style="margin-bottom: 12px" v-if="row.vmConfigUnit">
          实例所在节点空闲GPU数量：{{ row.vmConfigUnit.configNum }}卡
        </div>
        <div class="line">您可以：</div>
        <div class="line">
          1. (推荐)<span class="linkbtn" @click="handleRoute(row, 'clone')">克隆实例</span>
        </div>
        <div class="line">
          2.
          <span class="linkbtn" @click="handleConfirm(row, 'noGPU')">无卡模式开机</span>
        </div>
        <div class="line" style="margin-bottom: 12px">3. 等待GPU释放</div>
        <div class="line">
          提示：按量计费实例在关机后会释放GPU给其他用户租用，如果想一直占有
          GPU，可选择变更计费方式为包年包月
        </div>
      </div>

      <template #footer>
        <span>
          <el-button class="primarybtn" style="width: 104px; height: 32px" type="primary"
            @click="shortagegpuVisible = false">我知道了</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog class="DeletedDialog" v-model="DeletedVisible" :width="dialogWidth" :show-close="false"
      :style="{ width: dialogWidth }">
      <template #title>
        <i style="
            margin: 0px 12px 0 0;
            color: rgba(38, 150, 255, 1);
            font-size: 20px;
          " class="spacehpc_iconfont hpc_basic_icon_info_filled"></i> 无法删除
      </template>
      <div class="f14">包日包月未到期，无法删除。</div>
      <template #footer>


        <el-button type="primary" style="width:76px" class="primarybtn" @click="DeletedVisible = false">确认</el-button>

      </template>
    </el-dialog>
    <!-- 实名认证弹窗 -->
    <el-dialog title="" class="realNameDialog" v-model="realNameVisible" width="30%" style="width: 480px">
      <div class='content'>
        <p style="margin-bottom: 20px;">根据相关法律法规，创建实例前需要完成实名认证</p>
        <el-button type="primary" class="primarybtn" size="default" @click="goreal">前往认证中心</el-button>
      </div>
    </el-dialog>
    <!-- 端口映射 -->
    <el-dialog :title="generaltitle" 
      class="generalDialog" 
      v-model="generalVisible" 
      width="30%"
      :before-close="generalClose" 
      :style="`width: ${generalwidth}; `">
      <div class='content'>
        <div v-if="generaltype == 'ssh'" class="ssh">
          <!-- <div class="ssh_title"><i class="icon hpc_basic_icon_info_filled"></i>
            <div>我们仅为<span class="linkbtn" @click="">企业认证</span>用户提供直接端口转发。个人用户请按以下步骤进行SSH远程端口映射。</div>
          </div> -->
          <div class="ssh_list" v-if="netForwardlist && netForwardlist.length">
            <div class="sshlist_title">
              <span>已映射端口</span> 
              <div class="cf45"> 
                <a href="https://help.spacehpc.com/document/vm_operation/port_mapping/port_mapping.html" 
                  target="_blank" 
                  style="color: #2696FF;"
                  rel="添加端口">添加端口 </a>
                <!-- <span style="">添加端口</span> -->
                <span>（限企业认证）</span>
              </div>
            </div>
            <div class="sshlist_title2">
              <p style="width: 56px; margin-right: 12px; padding-right: 12px;border-right: 1px solid rgba(255,255,255,0.08); ">本地端口</p>
              <p>访问地址</p> 
            </div>
            <div class="netForwardlistsbox">
              <div class="netForwardlists" v-for="(item, index) in netForwardlist" :key="index">
                <div class="port">
                  <div class='portnumber'>{{ item.internalPort }}</div>
                  <div class="hr"></div>
                </div>
                <div 
                  v-if="item.protocol == 2" 
                  class="accessAddress" 
                  style="color: #2696FF; text-align: left;">tcp://{{ item.accessUrl }}</div>
                  <div class="accessAddress" v-else>
                    <el-link 
                      :underline="false"
                      type="primary"
                      :href="'https://' + item.accessUrl" 
                      target="_blank">https://{{ item.accessUrl }}
                    </el-link>
                  </div>
                
                <i class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon f22 linkbtn" 
                  @click="copyClick(item.accessUrl, item.protocol)">
                </i>
              </div>
            </div>
          </div>
          <div class="steps">
            <div class="steps_title">1.&nbsp; 请输入您要的映射端口</div>
            <el-input v-model="portNumber" placeholder="默认：7860 范围 1-65535" clearable @input="validatePort"></el-input>

          </div>
          <div class="steps">
            <div class="steps_title">2.&nbsp; 运行SSH命令</div>
            <div class="sshCommand">
              <div class="cf6">{{ generateSSHCommand() }}</div> <i
                class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon f22 linkbtn"
                @click="copyClick(generateSSHCommand())" style="margin-left: 10px;">
              </i>
            </div>
          </div>
          <div class="steps">
            <div class="steps_title">3.&nbsp; 操作说明</div>
            <li>Windows 用户请使用 Powershell 工具，Linux/Mac 打开终端</li>
            <div class="cf45" style="margin-bottom: 12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工具，粘贴命令后回车;</div>
            <li style="margin-bottom: 12px;">第一次会询问 yes/no，请输入 yes 后回车；</li>
            <li>输入密码（输入时不显示）&nbsp;**********<i class="spacehpc_iconfont hpc_gpu_icon_copy copy_icon f22 linkbtn"
                style="margin-left: 12px;position: absolute;" @click="copyClick(this.sshLoginPassword)"></i></li>
          </div>
          <div class="steps">
            <div class="steps_title" style="margin-bottom: 0">4.&nbsp; 本地浏览器打开： <el-link type="primary" :underline="false" :href="computedLink"
                target="_blank">
                {{ computedLink }}
              </el-link>
            </div>
          </div>
          <el-button type="primary" class="sshbtn" @click="generalClose">确定</el-button>

        </div>
      </div>
    </el-dialog>

  </div>
  <div class="noticeGlobal" v-show="shownotice">
    <div class="flex flex-1">
      <i style=" margin: 0px 12px 0 0;color: #FF9000;  font-size: 18px;"
        class="spacehpc_iconfont hpc_basic_icon_info_filled"></i>
      <div class="flex flex-1">平台升级通知：访问之前创建的实例,请登录&nbsp;&nbsp;<a href="https://gpu2.spacehpc.com/"
          Target="_blank">gpu2.spacehpc.com</a>。
        <div style="margin-left: auto;" class="linkbtn" @click="findOutMore">查看详情</div>
      </div>
    </div>
  </div>
  <!-- <GlobalDialog /> -->
</template>
<script>
import { nextTick, ref, computed, onMounted } from "vue";
import { useMineStore } from "@/store/mine";

const mineStore = useMineStore();


import {
  list,
  del,
  operate,
  status,
  hostName,
  zoneAllEnabled,
  zoneAll,
  noGpuStart,
  setShutdownAt,
  getUnitById,
  vmStoragePrice,
  vmDiskPrice,
  updateDisk,
  saveImage,
  canalShutdownAt,
  getNewPrice,
  expireUnit,
  changeChargeType,
  netForwardlist,
  vminfo,
  getexistOldVm
} from "@/api/hosts";
import { ElMessage } from "element-plus";
import { Search, ArrowRight, Right, DArrowLeft } from "@element-plus/icons-vue";
import { queryDictData } from "@/api/dictionary";
import clipboard3 from "vue-clipboard3";
import { Clock } from "@element-plus/icons-vue";
import { getAccount } from "@/api/recharge";
import { id } from "element-plus/es/locales.mjs";
import router from "@/routers/routes";
import { useRoute, useRouter } from 'vue-router';
import { ceil } from "lodash";
export default {
  name: "Hosts",
  data() {
    return {
      Clock,
      Search,
      ArrowRight,
      loading: false,
      isEmpty: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: "",
      },
      vmList: [],
      listData: {},
      expandTheScope: "",
      opearatPopVisible: false,
      polling: null,
      batchList: [],
      hostNameEditVisible: false,
      hostName: "",
      zoneList: [],
      disReboot: false,
      showID: "",
      generalVisible: false,
      confirmVisible: false,
      DeletedVisible: false,
      realNameVisible: false,
      generalwidth: '480px',
      generaltitle: '',
      generaltype: '',
      editID: "",
      editType: "",
      totalCount: 0,
      Pricelist: "",
      setFormData: {
        setDate: "",
        setime: "",
      },
      setRules: {
        setDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        setime: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
      prevSetime: "",
      expireAt: null,
      setVisible: false,
      accountInfo: {},
      setile: "",
      unitPrice: 0,
      constime: 0,
      expansionVisible: false,
      saveImageVisible: false,
      billingVisible: false,
      liftingVisible: false,
      expireAtVisible: false,
      toquantityVisible: false,
      shortagegpuVisible: false,
      imgname: '',
      imgid: "",
      expansionVol: "",
      storagePrice: {},
      currentDateFormatted: "",
      currentDate: new Date(),
      diffTime: "",
      diffDays: "",
      expireAtboot: "1",
      btnloading: false,
      row: {
        gpuNum: 1,
        freeGpuNum: 0
      },
      portNumber: '',
      remoteHost: "",
      sshLoginPassword: "",
      sshLoginPort: "",
      portError: '',
      netForwardlist: [],
      maxCapacity: 400,
      minCapacity: 0,
      shownotice: false,
      minTime: '',
      startTime: '00:00',
      shutdownDis: false,
      expandLoading: false,
      totalPrice: 0
    };
  },

  computed: {
    // minTime() {
    //   const today = new Date().toLocaleDateString()
    //   const selectedDate = new Date(this.setFormData.setDate).toLocaleDateString();
    //   console.log('selectedDate', this.setFormData.setDate)
    //   return selectedDate === today ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00';
    // },
    dialogWidth() {
      return this.editType === "destroy" || this.editType === "start" ? "424px" : "450px";
    },
    iconStyle() {
      return {
        margin: "0px 12px 0 0",
        color: this.editType === "destroy" ? "#DF444D" : "rgba(38, 150, 255, 1)",
        fontSize: "20px",
      };
    },
    computedLink() {
      const port = this.portNumber !== '' ? this.portNumber : 7860;
      return `http://localhost:${port}`;
    },
  },

  methods: {
    handleInput(event) {
      console.log('event======', event)
      // 只允许输入数字和小数点
      this.expansionVol = this.expansionVol.replace(/[^\d]/g, "");

      // 如果输入的值以 0 开头且不是 0 本身，设置为 ""
      if (this.expansionVol.length > 1 && this.expansionVol.startsWith("0")) {
        this.expansionVol = this.expansionVol.slice(1);
      }

      // 限制输入的值在 1 到 maxCapacity 之间
      if (this.expansionVol > this.maxCapacity) {
        this.expansionVol = Math.max(1, Math.min(this.maxCapacity, parseInt(this.storage, 10))) || "";
      }
      this.getDiskPrice(event)
    },
    // 获取磁盘对应价格
    async getDiskPrice(price) {
      const params = {
        storage: Number(price) || 0,
        id: this.row.id
      }
      const res = await vmDiskPrice(params);
      console.log('vmDiskPrice1111', res)
      if (res.code == 200) {
        this.totalPrice = res.data.totalPrice
        // this.storagePrice = res.data
        // this.storagePrice.dayPrice = res.data.diskPrice;
        // if (res.data.totalStorage <= 100 && res.data.totalStorage > res.data.defaultStorage) {
        //   this.storagePrice.defaultStorage = res.data.totalStorage
        //   this.storage = 0
        // } else {
        //   this.storagePrice.defaultStorage = res.data.defaultStorage
        //   this.storage = res.data.payStorage
        // }
        // this.pveCreateParam.storage = res.data.totalStorage
      }
    },
    // handleInput() {
    //   // 假设 row.storage 已经在组件的 data 中定义，并且是一个数字
    //   const maxExpansion = 500 - Number(this.row.storage); // 最大扩容量
    //   const regex = /^(?:[0-9]|[1-9][0-9]{1,2}|400)$/; // 正则表达式，匹配 0-400 的正整数
    //   if (!regex.test(this.expansionVol)) {
    //     // 输入不符合要求，可以给出错误提示或者修改输入框的值
    //     this.expansionVol =
    //       Math.max(
    //         0,
    //         Math.min(maxExpansion, parseInt(this.expansionVol, 10))
    //       ) || "";
    //   } else {
    //     // 如果输入符合要求，但加上当前存储后超过 500 GB，则限制在最大扩容量
    //     const inputVol = parseInt(this.expansionVol, 10);
    //     if (Number(this.row.storage) + inputVol > 500) {
    //       this.expansionVol = maxExpansion;
    //     }
    //   }
    // },
    async getStoragePrice() {
      const res = await vmStoragePrice({ project: "vm_storage" });
      if (res.code == 200) {
        this.storagePrice = res.data;
      }
    },
    getChargeTypeText(type) {
      switch (type) {
        case 0:
          return "按量计费";
        case 1:
          return "包日计费";
        case 2:
          return "包月计费";
        default:
          return "未知计费方式"; // 可以处理未知或错误的情况
      }
    },
    handleExpansion(row, type) {
      console.log('row====', row)
      this.row = row;
      let obj = {
        id: row.id
      }
      vminfo(obj).then((res) => {
        console.log('res-vminfo', res)
        this.maxCapacity = res.data.vmConfigUnit.configCapacities[0].storageAvailableMaxSizeGb
        // if (maxCapacity == 0) {
        //   this.maxCapacity = 924
        // } else {
        //   this.maxCapacity = maxCapacity
        // }
        if (!this.maxCapacity) {
          this.expandTheScope = `容量范围：${this.minCapacity} - ${this.maxCapacity}`
        } else {
          this.expandTheScope = `容量范围：${this.minCapacity} - ${this.maxCapacity}`
        }
      })
      this.editType = type;
      if (
        row &&
        row.chargeType !== 0 &&
        new Date(row.expireAt) < new Date() &&
        type == "expansion"
      ) {
        this.confirmVisible = true;
        return;
      }
      // 获取当前时间
      let now = new Date();
      // 获取当前时间的年月日，并设置时分秒为0
      let startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      // 获取expireAt的年月日，并设置时分秒为0
      let expireAtDate = new Date(row.expireAt);
      let startOfExpireAt = new Date(
        expireAtDate.getFullYear(),
        expireAtDate.getMonth(),
        expireAtDate.getDate()
      );

      this.diffTime = Math.abs(startOfExpireAt - startOfDay);

      this.diffDays = Math.ceil(this.diffTime / (1000 * 60 * 60 * 24));
      if (startOfExpireAt < startOfDay) {
        this.diffDays -= 1;
      }
      document.querySelector("#app").click();
      this.expansionVol = "";
      this.expansionVisible = true;
      this.row = row;
    },
    async setExpansion() {
      this.expandLoading = true
      const res = await updateDisk({
        id: this.row.id,
        diskSize: Number(this.expansionVol),
      });
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "扩容成功",
        });
        setTimeout(() => {
          this.expandLoading = false
        }, 3000);
      } else {
        ElMessage({
          type: "error",
          message: res.message,
        });
        this.expandLoading = false
      }
      this.expansionVisible = false;
    },
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
    getHelp() {
      window.open(
        "https://help.spacehpc.com/document/faststart.html",
        "_blank"
      );
    },
    async getAccountInfo() {
      const res = await getAccount();
      this.accountInfo = res.data;
    },
    formateIP(IP) {
      let ipAddress = IP;
      let maskedIpAddress = ipAddress.replace(/\.[^.]*$/, "....");
      return maskedIpAddress;
    },
    async goto(path) {
      await this.getAccountInfo(); // 等待 getAccountInfo 完成
      const verifyStatus = Number(this.accountInfo.verifyStatus);
      if (verifyStatus === 1) {
        this.$router.push(path);
      } else {
        this.realNameVisible = true;
        return;
      }
    },
    goreal() {
      this.realNameVisible = false
      this.$router.push("/mine/accountSecurity/realNameAuth");
    },
    handleRefresh() {
      this.vmList = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        searchValue: "",
      };
      this.filters.status = [];
      this.filters.statusEcho = "";
      this.filters.isAllStatus = false;
      this.filters.ChargeTypes = [];
      this.filters.isAllChargeTypes = false;
      this.filters.area = [];
      this.filters.allArea = false;
      this.filters.isAllArea = false;
      this.getList();
    },
    async getList() {
      this.loading = true;
      try {
        const res = await list(this.queryParams);
        if (res.code == 200) {
          this.listData = res.data;
          this.vmList = res.data.list;
          this.totalCount = res.data.total;
          this.loading = false;
          if (!this.vmList && this.queryParams.pageNum > 1) {
            this.queryParams.pageNum -= 1;
            await this.getList(); // 注意，这里我们用了await，确保递归调用完成
          }
          // this.shutdownStatus()
        }
      } catch (error) {
        this.loading = false;
        // 如果有错误，我们也要告诉控制台
        console.error("Oops, something went wrong:", error);
      }
    },
    // 处理页码变化
    handlePagination(page) {
      this.queryParams.pageNum = page;
      this.getList();
    },
    // 处理每页条目
    handleSizeChange(size) {
      this.queryParams.pageSize = size;
      this.getList();
    },
    // 判断关机按钮的显隐状态

    // 判断关机按钮状态
    shutdownStatus (item) {
      if (item.lastStartAt === null) {
        // 首次创建只有在ready状态才可以关机
          return item.status !== 'ready'
        } else {
          if (item.chargeType !== 0) {
            // 包日包月状态，只有ready状态才可以关机
            return item.status !== 'ready'
          } else {
            return item.status === 'stopping'
          }
        }
    },

    async handleDel(id, isBatch) {
      this.btnloading = true;
      try {
        const res = await del({ id });
        if (res.code == 200) {
          this.confirmVisible = false;
          this.btnloading = false;
          if (!isBatch) {
            ElMessage({
              type: "success",
              message: res.message,
            });

            this.getList();
          }
        } else {
          this.confirmVisible = false;
          this.btnloading = false;
          ElMessage({
            type: "warning",
            message: res.message,
          });
        }
      } catch {
        this.confirmVisible = false;
      }
    },
    handleConfirm(row, type) {
      // 关机提示
      // if (type == 'shutdown' && row.chargeType == 1) {

      // }
      document.querySelector("#app").click();
      this.row = row;
      this.shortagegpuVisible = false;
      this.editType = type;
      this.editID = row.id;
      if (row == null) {
        this.editType = type;
        this.confirmVisible = true;
      }
      //开机
      if (type == "start") {
        if (
          row &&
          row.chargeType !== 0 &&
          new Date(row.expireAt) < new Date()
        ) {
          this.row = row;
          this.expireAtVisible = true;
          return;
        }
        if (row.gpuNum > row.vmConfigUnit.configNum && row.chargeType == 0) {
          this.shortagegpuVisible = true;
          return;
        }
        // let obj = {
        //   id: row.id,
        // };
        // getNewPrice(obj).then((res) => {
        //   this.Pricelist = res.data;
        // });
      }
      //未过期的包日包月实例点删除

      if (
        row.chargeType !== 0 &&
        new Date(row.expireAt) > new Date() &&
        this.editType == "destroy" && 
        row.status != 'createdError'
      ) {
        this.DeletedVisible = true;
        return;
      }

      this.confirmVisible = true;
    },
    async handleReboot(id, isBatch) {
      document.querySelector("#app").click();
      try {
        const res = await operate({ id, status: "reboot" });
        if (res.code == 200) {
          this.confirmVisible = false;
          if (!isBatch) {
            ElMessage({
              type: "success",
              message: res.message,
            });
            this.getList();
          }
        } else {
          this.confirmVisible = false;
          ElMessage({
            type: "warning",
            message: res.message,
          });
        }
      } catch (err) {
        this.confirmVisible = false;
      }
    },
    //保存镜像方法
    handlesaveimage(row) {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}_${('0' + date.getHours()).slice(-2)}${('0' + date.getMinutes()).slice(-2)}`;
      this.imgname = row.osName + '_' + formattedDate;
      if (row.status == "stopped") {
        this.saveImageVisible = true;
        this.imgid = row.vmid;
      } else {
        ElMessage({
          type: "error",
          message: "The row status is not stopped.",
        });
      }
    },
    onDialogOpened() {
      this.$nextTick(() => {
        if (this.$refs.createInput) {
          this.$refs.createInput.focus();
          this.$refs.createInput.$el.querySelector('input').select();
        } else {
          console.error('createInput ref is not accessible');
        }
      });
    },
    closedialog() {
      this.saveImageVisible = false;
      this.expireAtVisible = false;
      this.toquantityVisible = false;
      this.expireAtboot = "1";
      this.imgname = "";
    },
    setImage() {
      if (!this.imgname) {
        ElMessage({
          type: "error",
          message: "镜像名不能为空！",
        });
        return
      } else {
        let obj = {
          vmId: this.imgid,
          imageName: this.imgname,
        };
        saveImage(obj).then((res) => {
          if (res.code == 200) {
            ElMessage({
              type: "success",
              message: res.message,
            });
          } else {
            ElMessage({
              type: "error",
              message: res.message,
            });
          }
        });
        this.saveImageVisible = false;
        this.imgname = "";
      }
    },
    handleRoute(row, type) {
      this.row = row;
      const routeData = {
        path: "create",
        query: { id: row.id, type },
      };

      switch (type) {
        case "todailymonthly":
          if (row.gpuNum > row.vmConfigUnit.configNum && row.status == "stopped") {
            console.log(row.status, 'row.status');
            this.shortagegpuVisible = true;
            return;
          }
          if (row.shutdownAt) {
            this.billingVisible = true;
            return;
          }
          break;
        case "edit":
          // if (!row.vmConfigUnit.configNum) {
          //   this.shortagegpuVisible = true;
          //   return;
          // }
          if (row.chargeType) {
            this.liftingVisible = true;
            return;
          }
          break;
        case "toquantity":
          break;
        case "clone":
          break;
      }

      this.$router.push(routeData);
    },
    // 开机/关机 确定按钮
    async handleOperate(id, status) {
      this.confirmVisible = false;
      try {
        const res = await operate({ id, status });
        if (res.code == 200) {
          this.confirmVisible = false;
          ElMessage({
            type: "success",
            message: res.message,
          });
          this.getList()
        } else {
          this.confirmVisible = false;
          this.loading = false
          ElMessage({
            type: "warning",
            message: res.message,
          });
        }
      } catch (err) {
        this.confirmVisible = false;
        console.log(err);
      }
    },
    async handleNoGpuStart(id) {
      console.log(this.editID, 'editID');
      try {
        const res = await noGpuStart({ id: this.editID });
        if (res.code == 200) {
          this.confirmVisible = false;
          ElMessage({
            type: "success",
            message: res.message,
          });
          this.getList();
        } else {
          this.confirmVisible = false;
          ElMessage({
            type: "warning",
            message: res.message,
          });
        }
      } catch (err) {
        this.confirmVisible = false;
        console.log(err);
      }
    },
    async getStatus() {
      try {
        const res = await list(this.queryParams);
        if (res.code == 200) {
          this.listData = res.data;
          this.vmList = res.data.list;
          this.totalCount = res.data.total;
        } else {
        }
      } catch (error) { }
      //   try {
      //     const res = await status(this.queryParams)
      //     if(res.code == 200 && res.data.length > 0) {
      //         this.getList()
      //     }
      //   } catch (error) {

      //   }
    },
    startPolling() {
      this.polling = setInterval(this.getStatus, 1000 * 5);
    },
    handleSelectionChange(list) {
      this.batchList = list;
    },
    clearSelection() {
      this.batchList = [];
      this.$refs.tableRef.clearSelection();
    },
    async handleBatchDel() {
      const promices = this.batchList.map((item) => {
        this.handleDel(item.id, true);
      });
      await Promise.all(promices);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      this.clearSelection();
      this.getList();
    },
    async handleBatchReboot() {
      if (this.batchList <= 0) {
        ElMessage({
          type: "warning",
          message: "您还未选中任何项，请选中操作",
        });
        return;
      }
      const promices = this.batchList.map((item) => {
        this.handleReboot(item.id, true);
      });
      await Promise.all(promices);
      this.clearSelection();
      this.getList();
    },
    handleEditHostname(e, id) {
      this.showID = id;
      this.$nextTick(() => {
        this.$refs.editInput.focus();
      });
    },
    editHostnameInput (value) {
      var reg = /[^\x00-\xff]/ig
      if (reg.test(value)) {
        if (value.length > 10) {
          // ElMessage.error('实例名称不可超过10个汉字')
          this.hostName = value.slice(0, 10)
        }
      }
    },
    async editHostname(id) {
      try {
        const res = await hostName({ id, name: this.hostName });
        if (res.code == 200) {
          this.showID = null;
          this.hostName = "";
          this.getList();
          ElMessage({
            type: "success",
            message: "修改成功",
          });

        } else {
          ElMessage({
            type: "warning",
            message: "修改失败",
          });
        }
      } catch (error) { }
    },
    inputBlur(id) {
      this.showID = null;
      this.hostName = "";
    },
    selectable(row) {
      if (row.status == "destroy") {
        return false;
      } else {
        return true;
      }
    },
    Shutdownbutton(row) {
      this.editType = "cancelShutdown";
      this.row = row;
      this.confirmVisible = true;
    },
    cancelShutdown(row) {
      let obj = {
        id: this.row.id,
        shutdownAt: "",
      };
      canalShutdownAt(obj).then((res) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: res.message,
          });
          this.confirmVisible = false;
        } else {
          ElMessage({
            type: "error",
            message: res.message,
          });
          this.confirmVisible = false;
        }
        this.getList();
      });
    },
    async handleSetVisible(row) {
      this.setVisible = true;
      this.row = row;
      this.constime = 0;
      const res = await getUnitById({ id: 7 });
      const data = res.data;
      if (row.shutdownAt) {
        const timeDiff = new Date(row.shutdownAt) - new Date();
        const hours = timeDiff / (60 * 60 * 1000);
        this.constime = hours;
      }
      if (res.code == 200 && !row.gpuStart) {
        this.unitPrice = data.unitPrice;
      } else {
        this.unitPrice = this.row.useUnitPrice
      }
      if (row.shutdownAt) {
        this.setile = "修改关机时间";
        const [date, time] = row.shutdownAt.split(" ");
        // console.log('date', date)
        // console.log('time', time)
        this.setFormData.setDate = date;
        const minutesTime = time.slice(0, -3)
        this.setFormData.setime = minutesTime;
        this.sumConst();
      } else {
        this.startTime = '00:00'
        this.setFormData.setDate = "";
        this.setFormData.setime = "";
        this.setile = "设置关机时间";
      }
    },
    selectBlur(e) {
      const regex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/;
      if (!regex.test(e.currentTarget.value)) {
        e.currentTarget.value = this.prevSetime;
        this.setFormData.setime = this.prevSetime;
        return;
      } else {
        this.setFormData.setime = e.currentTarget.value;
      }
    },
    sumConstDate() {
      this.minTime = ''
      console.log('this.setFormData.setDate', this.setFormData.setDate);
      const date = this.setFormData.setDate + " " + this.setFormData.setime;
      const timeDiff = new Date(date) - new Date();
      const today = new Date().toLocaleDateString()
      const selectedDate = new Date(this.setFormData.setDate).toLocaleDateString();
      this.minTime = 
     selectedDate === today ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00'
     console.log('this.minTime', this.minTime);
     if (selectedDate === today) {
      this.startTime = this.isAvailableTime()
     } else {
      this.startTime = this.minTime
     }
    //  this.isAvailableTime()
      // 转换为小时
      const hours = timeDiff / (60 * 60 * 1000);
      // 计算多出的小时部分
      const extraHours = Math.ceil(hours) - Math.floor(hours);
      console.log(hours);
      if (hours < 1) {
        this.constime = 0;
        return;
      }
    },
    sumConst(val) {
      if (!val) {
        // 如果 val 无效，则不执行后续操作
        this.prevSetime = this.setFormData.setime;
        return;
      }
      console.log(val, "setFormData");

      this.prevSetime = val;
      const ele = this.$refs.timeSelect.$el.querySelector("input");
      
      if (ele) {
        setTimeout(() => {
          ele.removeAttribute("readonly");
          ele.focus();
        }, 300);
      }
      const date = this.setFormData.setDate + " " + this.setFormData.setime;
      const timeDiff = new Date(date) - new Date();
      // 转换为小时
      const hours = timeDiff / (60 * 60 * 1000);
      // 计算多出的小时部分
      const extraHours = Math.ceil(hours) - Math.floor(hours);
      if (extraHours) {
        this.constime = hours;
      }
    },
    async handleSetFree(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.setFormData.setime) {
            ElMessage({
              type: "warning",
              message: "请选择时间",
            });
            return;
          }
          const date = this.setFormData.setDate + " " + this.setFormData.setime;

          const res = await setShutdownAt({
            id: this.row.id,
            shutdownAt: date,
          });
          if (res.code == 200) {
            this.setVisible = false;
            ElMessage({
              type: "success",
              message: res.message,
            });
            this.getList();
          } else {
            this.setVisible = false;
            ElMessage({
              type: "warning",
              message: res.message,
            });
          }
        }
      });
    },
    expireAtDialoggo() {
      if (this.expireAtboot == "1") {
        this.handleRoute(this.row, "renewal");
      } else {
        this.toquantityVisible = true;
      }
    },
    //转按量
    handlechangeChargeType(type) {
      this.btnloading = true;
      let obj = {
        chargeType: 0,
        id: this.row.id,
        payTimes: "",
      };
      changeChargeType(obj).then((res) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: res.message,
          });
          this.btnloading = false;
          this.closedialog();
        } else {
          ElMessage({
            type: "error",
            message: res.message,
          });
          this.btnloading = false;
        }
      });
    },
    isExpiringSoon(expireAt) {
      const expireTime = new Date(expireAt).getTime();
      const currentTime = new Date().getTime();
      const threeHoursInMs = 3 * 60 * 60 * 1000;
      return expireTime - currentTime <= threeHoursInMs;
    },
    getUrlWithHostname(url, hostname, appInfos) {
      const urlObj = new URL('https://' + url); // 使用 HTTPS 协议和当前主机
      if (appInfos.authType) {
        urlObj.searchParams.set('token', hostname);
        return urlObj.toString();
      } else {
        return urlObj.toString();
      }
    },
    transformSlotProps(props) {
      const formattedProps = {};
      Object.entries(props).forEach(([key, value]) => {
        if (key !== 'days') {
          formattedProps[key] = value < 10 ? `0${value}` : String(value);
        }
        if (key == 'days') {
          formattedProps[key] = value;
        }
      });

      return formattedProps;
    },
    expansionClose () {
      this.totalPrice = 0
    },
    //表格样式
    cellStyle(columnIndex) {

      if (columnIndex.columnIndex == 0) {

        return { padding: "0px 0px 0px 4px" };
      } else if (columnIndex.columnIndex == 2) {
        return { color: "rgba(225,225,225,0.6)" };

      }
      else {
        // return { padding: "0px 0px 0px 0px" };
      }
    },
    //端口映射方法
    portMapping(row) {
      console.log(row, 'rrr');
      // this.netForwardlist = row.appInfos
      let obj = {
        vmId: row.id
      }
      netForwardlist(obj).then((res) => {
        if (res.code == 200) {
          this.netForwardlist = res.data
        }
      })
      this.remoteHost = row.sshLoginHost;
      this.sshLoginPassword = row.sshLoginPassword;
      this.sshLoginPort = row.sshLoginPort;
      this.generalVisible = true;
      this.generalwidth = '560px';
      this.generaltitle = '端口映射向导';
      this.generaltype = 'ssh'
    },
    generateSSHCommand() {
      const port = this.portNumber ?? 7860;
      return `ssh -CNg -L ${port}:127.0.0.1:${port} root@${this.remoteHost} -p ${this.sshLoginPort}`;
    },
    generateSSHCommand2(port, sshLoginPort) {
      return `ssh -CNg -L ${port}:127.0.0.1:${port} root@${this.remoteHost} -p ${sshLoginPort}`;
    },

    generalClose() {
      this.portNumber = ''
      this.generalVisible = false
    },
    validatePort(value) {
      // 移除非数字字符
      let newValue = value.replace(/\D/g, '');
      // 确保值在范围内
      if (newValue !== '') {
        newValue = Math.min(Math.max(parseInt(newValue, 10), 1), 65535);
      }
      this.portNumber = newValue;
    },
    getexistOldVms() {
      getexistOldVm().then((res) => {
        // this.shownotice = res.data
      })
    },
    isAvailableTime () {
      const now = new Date();
  
      // 获取当前的小时和分钟
      const hours = now.getHours();
      const minutes = now.getMinutes();
      console.log('minutes', minutes)
      let nearestTime;

      if (minutes < 30) {
        // 如果分钟小于15，最近的时间是当前小时的整点
        nearestTime = new Date(now);
        nearestTime.setMinutes(30, 0, 0); // 设置为整点
      }  else {
        // 如果分钟在45及以上，最近的时间是下一个小时的整点
        nearestTime = new Date(now);
        nearestTime.setHours(hours + 1);
        nearestTime.setMinutes(0, 0, 0); // 设置为整点
      }
      return nearestTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       
    }
  },
  created() {
    // this.minTime = new Date(this.setFormData.setDate).toLocaleDateString() == 
    //                 new Date().toLocaleDateString() ? 
    //                 new Date().toLocaleTimeString()  : ''
    // console.log('this.minTime', this.minTime)
    this.getStoragePrice();
    // this.getexistOldVms()
    if (this.$route.query.status) {
      this.queryParams.status = this.$route.query.status;
      this.getList();
    } else {
      this.getList();
    }
    
  },
  mounted() {
    this.startPolling();
    this.getAccountInfo();
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const globalDialog = inject('globalDialog');
    const copyClick = async (text, type) => {
      const { toClipboard } = clipboard3()
      var copyText = ''
      if (type) {
        type == 1 ? copyText = 'https://' + text : copyText = 'tcp://' + text
      } else {
        copyText = text
      }
      try {
        await toClipboard(copyText);
        ElMessage({
          message: `复制成功`,
          type: "success",
        });
      } catch (error) {
        ElMessage({
          message: `复制失败`,
          type: "error",
        });
      }
    };
    let allStatus = ref([]);
    function formatDate(date) {
      let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }
    const currentDateFormatted = formatDate(new Date());
    // 筛选变量
    const filters = reactive({
      status: [],
      statusEcho: "",
      allStatus: false,
      isAllStatus: false,
      area: [],
      allArea: false,
      isAllArea: false,
      ChargeTypes: [],
      ChargeTypesEcho: "",
      allChargeTypes: false,
      isAllChargeTypes: false,
    });
    // 查询参数变量
    const queryParams = reactive({
      pageNum: 1,
      pageSize: 10,
    });
    const filterCheck = ref(false);

    // 全选方法
    function handleCheckAllChange(type, val) {
      switch (type) {
        case "status":
          const statuschecks = allStatus.value.map((item) => { return item.dictLabel });
          queryParams.status = val ? allStatus.value.map((item) => item.dictValue).join(",") : "";
          filters.status = val ? statuschecks : [];
          filters.statusEcho = val ? statuschecks.join(" + ") : "";
          filters.allStatus = val;
          filters.isAllStatus = false;
          break;
        case "area":
          const areachecks = areas.value.map((item) => {
            return item.name;
          });
          queryParams.area = val
            ? areas.value
              .map((item) => {
                return item.id;
              })
              .join(",")
            : "";
          filters.area = val ? areachecks : [];
          filters.allArea = val;
          filters.isAllArea = false;
          break;
        case "ChargeTypes":
          const ChargeTypechecks = ChargeTypes.value.map((item) => {
            return item.dictValue;
          });
          queryParams.chargeTypes = val
            ? ChargeTypes.value
              .map((item) => {
                return item.dictValue;
              })
              .join(",")
            : "";
          filters.ChargeTypes = val ? ChargeTypechecks : [];
          filters.allChargeTypes = val;
          filters.isAllChargeTypes = false;
          break;
      }
      proxy.queryParams.status = queryParams.status;
      proxy.queryParams.zoneId = queryParams.area;
      proxy.queryParams.chargeTypes = queryParams.chargeTypes;
      proxy.getStatus();
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
        case "status":
          queryParams.status = value.map(v => {
            const item = allStatus.value.find(item => item.dictLabel == v);
            return item ? item.dictValue : '';
          }).join(",");
          filters.statusEcho = value.join(" + ");
          console.log(checkedCount, 'checkedCount');
          filters.allStatus = checkedCount == allStatus.value.length;
          filters.isAllStatus = checkedCount > 0 && checkedCount < allStatus.value.length;
          break;
        case "ChargeTypes":
          queryParams.chargeTypes = value
            .map((v) => {
              let check = "";
              ChargeTypes.value.map((item) => {
                // console.log(item, "item");
                if (item.dictValue == v) {
                  check = item.dictValue;
                }
              });
              return check;
            })
            .join(",");

          filters.allChargeTypes = checkedCount == ChargeTypes.value.length;
          filters.isAllChargeTypes =
            checkedCount > 0 && checkedCount < ChargeTypes.value.length;
          break;
        case "area":
          queryParams.area = value
            .map((v) => {
              let check = "";
              console.log(v);
              areas.value.map((item) => {
                if (item.name == v) {
                  check = item.id;
                }
              });
              return check;
            })
            .join(",");
          filters.allArea = checkedCount == areas.value.length;
          filters.isAllArea =
            checkedCount > 0 && checkedCount < areas.value.length;
          break;
      }
      proxy.queryParams.status = queryParams.status;
      proxy.queryParams.zoneId = queryParams.area;
      proxy.queryParams.chargeTypes = queryParams.chargeTypes;
      proxy.getStatus();
    }

    onMounted(async () => {
      await getDictData();
      if (route.query.status) {
        const statusArray = route.query.status.split(',');
        console.log(statusArray, '111');
        const rawStatus = toRaw(filters.status); // 确保是普通数组
        rawStatus.length = 0; // 清空数组
        filters.status = statusArray.map(status => {
          const item = allStatus.value.find(item => item.dictValue == status);
          return item ? item.dictLabel : '';
        }).filter(label => label !== '');
        console.log(filters.status, 'fff');
        handleCheckboxGrop('status', filters.status);
      }
      else {
        proxy.getStatus();
      }
    });
    function automaticConversion(row) {
      console.log(row);
      let obj = {
        id: row.id,
        isTrue: row.expireUnit,
      };
      expireUnit(obj).then((res) => { });
    }

    // 匹配任务状态展示对应dot
    function matchBg(val) {
      let bgc = "";
      switch (val) {
        case "created":
          bgc = "bgblue";
          break;
        case "ready":
          bgc = "bggreen";
          break;
        case "running":
          bgc = "bgblue";
          break;
        case "starting":
          bgc = "bggreen";
          break;
        case "stopping":
          bgc = "bggray";
          break;
        case "stopped":
          bgc = "bgyellow";
          break;
        case "unknown":
          bgc = "bggray";
          break;
        case "clocking":
          bgc = "bgyellow";
          break;
        case "paused":
          bgc = "bgred";
          break;
        case "error":
          bgc = "bgred";
          break;
        case "deleting":
          bgc = "bgred";
          break;
        case "nostock":
          bgc = "bgred";
          break;
        case "deleted":
          bgc = "bgred";
          break;
        case "createdError":
          bgc = "bgred";
          break;
        default:
          bgc = "bgyellow";
          break;
      }
      return bgc;
    }
    // 获取主机状态字典
    const taskStates = ref([]);
    const StatusReason = ref([])
    async function getDictData() {
      try {
        const res = await queryDictData({ type: "orbitVmStatus" });
        const res2 = await queryDictData({ type: "vmChargeType" });
        const res3 = await queryDictData({ type: "vmStatusReason" });
        if (res.code == 200) {
          // allStatus.value = res.data;
          taskStates.value = res.data;
          const arr = res.data
          arr.forEach(item => {
            if (item.dictValue === "starting") {
              item.dictLabel = "准备中";
            } else if (item.dictValue === "running") {
              item.dictLabel = "启动中";
            }
          })
          const filteredItems = arr.filter(item => item.remark !== null)
          console.log('filteredItems', filteredItems)
          allStatus.value = filteredItems
        } else {
          console.log(res.message);
        }
        if (res2.code == 200) {
          ChargeTypes.value = res2.data;
        } else {
          console.log(res2.message);
        }
        if (res3.code == 200) {
          StatusReason.value = res3.data;
        } else {
          console.log(res3.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getDictData();
    const areas = ref([]);
    const ChargeTypes = ref([]);
    async function getZone() {
      try {
        const res = await zoneAll();
        if (res.code == 200) {
          areas.value = res.data;
        }
      } catch (error) { }
    }
    getZone();
    // 匹配任务状态
    function match(val) {
      let text = "";

      taskStates.value.map((item) => {
        if (item.dictValue == val) {
          text = item.dictLabel;
        }
      });
      return text;
    }
    // 匹配锁定中描述文案
    function matchReason(val) {
      let text = "";

      StatusReason.value.map((item) => {
        if (item.dictValue == val) {
          text = item.dictLabel;
        }
      });
      return text;
    }
    function matchArea(zoneId) {
      let text = "";
      areas.value.map((item) => {
        if (item.id == zoneId) {
          text = item.description;
        }
      });
      return text;
    }
    function findOutMore() {
      window.open("https://help.spacehpc.com/document/platform_upgrade_documentation.html", "_blank");
    }

    const openGlobalDialog = () => {
      mineStore.dialogytype = 1
      globalDialog.openDialog();
    };

    return {
      allStatus,
      ChargeTypes,
      filters,
      filterCheck,
      currentDateFormatted,
      handleCheckAllChange,
      handleCheckboxGrop,
      automaticConversion,
      formatDate,
      matchBg,
      match,
      matchReason,
      copyClick,
      areas,
      matchArea,
      findOutMore,
      openGlobalDialog
    };
  },
};
</script>
<style lang="less" scoped>
@import '../../assets/css/host.less';
</style>
<style>
.el-select-dropdown__wrap {
  padding: 10px 0;
  background: #1d222a;
  border-radius: 6px 6px 6px 6px;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.45);
}

.ascending .sort-caret.ascending {
  border-bottom-color: #69b7ff !important;
}

.el-table .descending .sort-caret.descending {
  border-top-color: #69b7ff !important;
}

:deep(.input-bg .el-input__inner::-webkit-input-placeholder) {
  color: rgba(0, 0, 0, 0.3) !important;
}
.el-link.is-disabled.item {
  color: rgba(0, 0, 0, 0.45);
}
</style>
<style lang="less">
.el-popover.el-popper {
  border: none !important;
  background: #e9ebee !important;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.48),
    0px 6px 16px 0px rgba(0, 0, 0, 0.32), 0px 9px 28px 0px rgba(0, 0, 0, 0.2) !important;
}

.el-popper.is-light .el-popper__arrow::before {
  border: 1px solid #0b1320;
  background: #e9ebee;
  right: 0;
}

.notice_pop {
  padding: 0 !important;

  .title {
    padding: 5px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .notice_content {
    font-size: 14px;
    padding: 8px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>

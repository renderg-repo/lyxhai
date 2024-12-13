<template>
  <div class="container recharge flex-column flex-1">
    <div class="title">充值中心</div>
    <div class="account">
      <div class="img_div">
        <img class="img" src="@/assets/images/recharge/balance.svg" alt="" />
      </div>
      <div class="balance">
        <div style="line-height: 17px; margin-bottom: 10px;margin-top: 40px;height: 18px" class="lh22">账户余额：</div>
        <div class="num_div">
          <div style="color: #2696ff">￥ </div>
          <div class="num"> {{ accountInfo.balance }} </div>
        </div>
        <div class="flex space-between lh22" style="margin-top: 6px;">
          <div>
            支付券：
            <span style="color: #2696ff">
              <span>￥</span>
              {{ accountInfo.currentCouponsAmount }}
            </span>
          </div>
          <div class="flex">
            <div style="margin-right: 20px">
              邀请码: {{ accountInfo.inviteCode }}
            </div>
            <div class="linkbtn" @click="share()">邀请链接</div>
          </div>
        </div>
        <div class="linkbtn" style="
            text-align: right;
            position: relative;
            right: 0px;
            top: 63px;
            height: 19px;
            z-index: 1;
          ">
          <span class="linkbtn" v-show="activeName == 'inviterecord'" @click="godocumentation()">帮助文档</span>
        </div>
      </div>
    </div>
    <!-- tab-pane -->
    <el-tabs 
      v-model="activeName" 
      class="tabs flex-1 flex-column" 
      @tab-change="tabChange"
      @tab-click="handleClick">
      <!-- 线上充值 -->
      <el-tab-pane label="线上充值" name="online">
        <div class="online">
          <el-form label-width="90px" ref="rechargeForm" :model="rechargeFormData">
            <el-form-item label="充值金额：" class="amount">
              <el-radio-group v-model="radio1" @change="radio1change">
                <el-radio :label="100" size="large" border>
                  ￥<span class="num">100</span>
                </el-radio>
                <el-radio :label="200" size="large" border>
                  ￥<span class="num">200</span>
                </el-radio>
                <el-radio :label="500" size="large" border>
                  ￥<span class="num">500</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-col :span="6" class="other">
              <el-form-item label="其他金额：" prop="amount" style="margin-top: 50px;">
                <el-input 
                  v-model="otheramount" type="text" 
                  placeholder="请输入充值金额" 
                  clearable
                  class="amountinput"
                  :class="showtip ? 'is-error' : ''" 
                  autocomplete="off"
                  @input="amountChange"
                   />
              </el-form-item>
              <div class="tip"><span v-if="showtip">最低至少充值1.0元</span></div>
            </el-col>
            <el-form-item label="支付方式：" class="payway">
              <el-radio-group v-model="rechargeFormData.rechargetype">
                <el-radio :label="1" size="large">
                  <img class="img" src="@/assets/images/recharge/alipay.svg" alt="" />
                </el-radio>
                <el-radio :label="2" size="large">
                  <img class="img" src="@/assets/images/recharge/wxpay.svg" alt="" />
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-col :span="5">
                <el-button 
                  class="primarybtn" 
                  type="primary" 
                  :loading="loadingBtn"
                  @click="submitRecharge">立即充值</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 线下汇款 -->
      <el-tab-pane label="线下汇款" class="flex-1 flex-column" name="offline">
        <el-row class="offline" :gutter="30">
          <el-col :span="11">
            <div class="title">请向以下账户转账</div>
            <div v-if="bankInfo" class="card info">
              <el-button class="ghostbtn" 
                style="position: absolute; right: 40px;height: 40px; color: RGBA(255, 255, 255, 0.85)"  
                @click="copyText">复制转账信息</el-button>
              <div ref="copyEle">
                <div class="lh26">{{ bankInfo[0] }}</div>
                <div class="lh26">{{ bankInfo[1] }}</div>
                <div class="lh26">{{ bankInfo[2] }}</div>
                <div class="lh26">{{ bankInfo[3] }}</div>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="11" :offset="1">
            <div class="title">将转账信息发送至手机</div>
            <div class="card phone_card">
              <div v-if="sended" class="sended">
                <img src="@/assets/images/recharge/success.png" alt="" />
                信息已发送至手机，3分钟后可重新发送
              </div>
              <div v-else class="validInput">
                <el-input
                  v-model.trim="phone"
                  placeholder="请输入手机号"
                  class="input input-bd"
                  style="width: 320px; height: 40px"
                  ref="phoneInput"
                />
                <el-button class="btn ghostbtn" @click="handleSendRemitBank"
                  >发送</el-button
                >
              </div>
            </div>
          </el-col> -->
        </el-row>
        <div class="descript" style="margin-top: auto">
          <p>
            1.
            在进行汇款操作时，请务必在备注栏填写您的注册手机号，以帮助我们迅速核实和匹配您的支付款项。
          </p>
          <p>
            2.
            我们的财务团队将在1-3个工作日内对您的付款进行审核和确认，一旦款项到账，我们将立即将金额充值至您的账户。请注意，由于银行处理时间存在不确定性，您的付款到账可能存在一定的延误。
          </p>
          <p>
            3.
            汇款完成后，请及时联系我们的客户服务团队，以便我们更高效地处理您的充值和
            <el-link :underline="false" href="https://help.spacehpc.com/document/invoice.html"  target="_blank">
              <span style="color: RGBA(38, 150, 255, 1)">开票请求</span>。
            </el-link>
          </p>
        </div>
      </el-tab-pane>
      <!-- 支付券 -->
      <el-tab-pane label="支付券" class="flex-1 flex-column voucher" name="voucher">
        <div class="Coupontop">
          <el-input class="input-bg" placeholder="请输入兑换码" v-model="code" clearable
            style="min-width: 300px; width: 300px"></el-input>
          <el-button class="primarybtn" style="margin-left: 10px;height: 36px; width: 100px;" type="primary"
            @click="activate">立即激活</el-button>
        </div>
        <div class="Couponlistbox" :style="couponListBoxStyle">
          <div class="Couponlist">
            <div v-for="item in Couponlistdata.list" :key="item.id" class="Coupons"
              :class="{ cf35: item.status == 2, Couponsoverdue: item.status }">
              <div class="Couponstop">
                <img src="@/assets/images/recharge/couponicon.png" alt="" width="32px" height="32px" />
                <div style="width: 100%">
                  <div class="topname">
                    <div class="f16" :class="{ cf35: item.status }">
                      {{ item.name }}
                    </div>
                    <!-- <div v-if="item.status == 1" class="righttag">过期</div> -->
                  </div>
                  <div class="topamount" :class="{ cf35: item.status == 2 || item.status == 1 }">
                    <p>面值：{{ item.amount }}元</p>
                    <p>{{ item.startTime }}-{{ item.endTime }}</p>
                  </div>
                </div>
              </div>
              <div class="Couponsbottom">
                <div class="remainAmount" :class="{ cf35: item.status == 2 || item.status == 1 }">
                  <span>余额：</span><span :class="{
                    sp3: item.status == 2 || item.status == 1,
                    sp: item.status !== 2,
                  }">￥</span><span :class="{
                    sp3: item.status,
                    sp: item.status !== 2,
                  }" class="sp2">{{
                    formatRemainAmount(item.remainAmount).integerPart
                  }}</span>
                  <span>{{}}</span>
                  <span :class="{
                    sp3: item.status,
                    sp: item.status !== 2,
                    sp4: !item.remainAmount,
                  }">{{
                    formatRemainAmount(item.remainAmount).decimalPart
                  }}</span>
                  <div class="flex f12 cf45" style="
                      justify-content: center;
                    
                      margin-top: 10px;
                    " :class="{ cf35: item.status == 2 }">
                    <img src="@/assets/images/recharge/warning_circle_normal.png" alt="" width="18px" height="18px"
                      style="margin-right: 6px" />
                    <p style="height: 16px;line-height: 12px;">
                      {{
                        item.scope
                          ? JSON.parse(item.scope).desc
                          : "无使用限制。"
                      }}
                    </p>
                  </div>
                </div>
                <div class="imgbox">
                  <img v-if="item.status == 1" src="../../assets/images/recharge/expired.svg" width="86px" height="86px"
                    alt="" />
                  <img v-if="item.status == 2" src="../../assets/images/recharge/exhaust.png" width="86px" height="86px"
                    alt="" />
                </div>
              </div>
            </div>
            <div v-if="Couponlistdata.list.length == 0" class="prompt cf30">
              暂无支付券
            </div>
          </div>
        </div>
        <div class="pagination pagination-bar">
          <el-pagination 
            class="input-bg" small 
            popper-class="pagination-bar"
            :current-page="vouchersQueryParam.pageNum" 
            @current-change="Couponschange" 
            :total="totalCount"
            :page-size="vouchersQueryParam.pageSize" 
            layout="total,prev,pager,next,jumper">
          </el-pagination>
        </div>
      </el-tab-pane>
      <!-- 充值记录 -->
      <el-tab-pane label="收支记录" class="rechargeList flex-1 flex-column" name="rechargeList">
        <el-table style="width: 100%" class="table-container rechargeTable flex-1" empty-text=" " height="50vh"
          :data="rechargeListData.list" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
          <el-table-column label="交易单号" prop="rechargeNo" sortable width="280"></el-table-column>
          <el-table-column label="交易类型" prop="type" width="220">
            <template #header="{}">
              <div class="filter">
                <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                  <template #reference>
                    <span>
                      <span :class="payType.length > 0 ? 'check' : ''" class="filterLable">交易类型</span>
                      <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter"
                        :class="payType.length > 0 ? 'check' : ''"></i>
                    </span>
                  </template>
                  <el-checkbox-group class="checkGroup" v-model="Transactiontype" @change="getRechargeList">
                    <el-checkbox v-for="(val, index) in Transactiontypemap" :value="val.value">
                      {{ val.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-popover>
              </div>
            </template>
            <template #default="scope">{{ TypeComponentsMap(scope.row.type) }}</template>
          </el-table-column>
          <el-table-column label="交易金额" prop="amount" sortable width="220">
            <template #default="scope"> {{ scope.row.statementType ? '-' : '+' }} ￥{{ (scope.row.amount).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="交易方式" prop="payType" width="200">
            <template #header="{ column }">
              <div class="filter">
                <el-popover :show-arrow="false" popper-class="filterPop" trigger="click" placement="bottom">
                  <template #reference>
                    <span>
                      <span :class="payType.length > 0 ? 'check' : ''" class="filterLable">交易方式</span>
                      <i style="font-size: 12px" class="spacehpc_iconfont hpc_basic_icon_filter"
                        :class="payType.length > 0 ? 'check' : ''"></i>
                    </span>
                  </template>
                  <el-checkbox-group class="checkGroup" v-model="payType" @change="getRechargeList">
                    <el-checkbox v-for="(label, key) in payTypeMap" :key="key" :label="parseInt(key)">
                      {{ label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-popover>
              </div>
            </template>
            <template #default="scope"> {{ payTypeMap[scope.row.payType] || "未知支付类型" }}</template>
          </el-table-column>
          <el-table-column label="交易时间" prop="createdAt" width="360" sortable>
            <template #default="scope">{{ scope.row.createdAt }}</template>
          </el-table-column>
          <el-table-column label="账户余额" prop="afterBalance" width="200">
            <template #default="scope">￥{{ (scope.row.afterBalance).toFixed(2) }}</template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <el-button type="primary" text disabled>下载收据</el-button>
            <el-button type="primary" text disabled>开具发票</el-button>
          </el-table-column> -->
          <template #append v-if="(rechargeListData.totalPage == 0 ||
            rechargeListDatalength < queryParams.pageSize) &&
            !loading
            ">
            <div class="noMoreData flex-1">暂无更多</div>
          </template>
        </el-table>
        <div class="pagination pagination-bar">
          <el-pagination 
            class="input-bg" small 
            popper-class="pagination-bar" 
            :current-page="queryParams.pageNum"
            @size-change="handleSizeChange" 
            @current-change="handlePageChange" 
            :total="rechargeListTotal"
            :page-size="queryParams.pageSize" 
            :page-sizes="[10, 20, 30, 50]"
            layout="total,prev,pager,next,sizes,jumper">
          </el-pagination>
        </div>
      </el-tab-pane>
      <!-- 优惠券 -->
      <el-tab-pane label="优惠券" class="flex-1 flex-column coupons" name="coupons">
        <div class="Couponlistbox">
          <DictComponent :requiredDictTypes="requiredDictTypes" class=" flex-1">
            <template #default="{ dicts, dictMate }">
              <div class="Couponlist">
                <div v-for="item in Couponlist.list" :key="item.id" class="Coupons" :class="{
                  cf35: item.useStatus == 2,
                  Couponsbk: item.useStatus,
                }">
                  <div class="Couponstop">
                    <div style="width: 100%">
                      <div class="topamount" :class="{
                        cf35: item.useStatus == 2 || item.useStatus == 1,
                      }">
                        <p class="amounts">
                          <span class="f14" v-if="!item.discountType">￥</span>
                          {{ item.discountType == 1 ? formattedAmount(item.amount) : item.amount }}
                          <span class="f14" v-if="item.discountType">折</span>
                        </p>
                        <p class="pt26 cf60">
                          满{{ item.minSpend }}可用
                        </p>
                        <p class="pt26 flex-1 cf45" :class="{
                          cf35: item.useStatus == 2 || item.useStatus == 1,
                        }" style="text-align: right">
                          有效期至 {{ item.validTo }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="Couponsbottom">
                    <div>{{ item.ruleDesc }}</div>
                    <i class="icon hpc_basic_icon_question_circle f16"></i>
                    <div class="tag">
                      {{ dictMate("discountType", item.discountType) }}
                    </div>
                  </div>
                  <div class="maskLayer" v-if="item.useStatus">
                    <div class="imgbox">
                      <img v-if="item.useStatus == 1" src="@/assets/images/recharge/expired.svg" width="86px"
                        height="86px" alt="" />
                      <img v-if="item.useStatus == 2" src="@/assets/images/recharge/used.svg" width="86px" height="86px"
                        alt="" />
                    </div>
                  </div>
                </div>

                <div v-if="Couponlist.list.length == 0" class="prompt cf30">
                  暂无优惠券
                </div>
              </div>
            </template>
          </DictComponent>
          <div class="pagination pagination-bar" style="margin-top: 20px;margin-bottom: 0px;">
            <el-pagination 
              class="input-bg" small 
              popper-class="pagination-bar" 
              :current-page="CouponsQueryParam.page"
              @current-change="CouponsQueryParamchange" 
              :total="Couponlist.total" 
              :page-size="CouponsQueryParam.size"
              layout="total,prev,pager,next,jumper">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!-- 邀请记录 -->
      <el-tab-pane label="邀请记录" class="rechargeList flex-1 flex-column" name="inviterecord">
        <el-table style="width: 100%" class="table-container rechargeTable flex-1" empty-text=" " height="50vh"
          :data="inviterecordate.list" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
          <el-table-column label="邀请用户" prop="inviteePhone">
            <template #default="scope"><span class="cf45">{{ scope.row.inviteePhone }}</span></template>
          </el-table-column>
          <el-table-column label="注册时间" prop="inviteAt" width="">
            <template #default="scope"><span class="cf45">{{ scope.row.inviteAt }}</span></template>
          </el-table-column>
          <el-table-column label="奖励事件" prop="awardEvent" width="">
            <template #default="scope">
              <span class="cf85">
                {{ scope.row.awardEvent == 0 ? '注册' : scope.row.awardEvent == 1 ? '首次充值' :'' }}
                <!-- {{ dictMate("awardEventType", scope.row.awardEvent)}} -->
              </span>
            </template>
          </el-table-column>

          <el-table-column label="奖励支付券" prop="awardAmount" width="">
            <template #default="scope"><span class="cf85">￥{{ scope.row.awardAmount }}</span></template>
          </el-table-column>

          <template #append v-if="(inviterecordate.totalPage == 0 ||
            inviterecordatelistlength < queryParams.pageSize) &&
            !loading
            ">
            <div class="noMoreData flex-1">暂无更多</div>
          </template>
        </el-table>
        <div class="pagination pagination-bar">
          <el-pagination 
            class="input-bg" small 
            popper-class="pagination-bar" 
            :current-page="inviteParams.pageNum"
            @size-change="inviteSizeChange" 
            @current-change="invitePageChange" 
            :total="inviterecordateTotal"
            :page-size="inviteParams.pageSize" 
            :page-sizes="[10, 20, 30, 50]"
            layout="total,prev,pager,next,sizes,jumper">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- tab-pane end -->

    <el-dialog class="dialog" v-model="payDialog" title="微信支付" width="450"
      style="width: 450px; height: 309px; background: #1d222a" :close-on-click-modal="false"
      :close-on-press-escape="false" @close="stopPolling">
      <!-- <div v-if="rechargeFormData.rechargetype == 1" class="info">
        <p class="pay">请您在新打开的页面上完成付款</p>
        <div>
          <p>付款完成前请不要关闭此窗口</p>
          <p>完成付款后请点击下面的按钮</p>
        </div>
      </div> -->

      <div v-if="!paySuccess">
        <div class="wxpay">
          <div class="qr">
            <div class="code">
              <QRCodeVue3 :width="150" :height="150" v-if="orderData?.url" :value="orderData?.url"
                :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' }"
                :imageOptions="{ hideBackgroundDots: true, imageSize: 0.5, margin: 5 }" margin="0"
                image="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzE5MzY0NjU5ODc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1MjQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTIzNi4yNCAzMjMuNzY5YzAgMjQuMDA1IDE5LjMyIDQzLjMyNSA0My4zMjUgNDMuMzI1czQzLjMyNi0xOS4zMiA0My4zMjYtNDMuMzI1YzAtMjQuMDA1LTE5LjMyMS00My4zMjUtNDMuMzI2LTQzLjMyNS0yNC4wMDQgMC00My4zMjUgMTkuMzItNDMuMzI1IDQzLjMyNXogbTMzNi4wNjQgMjIzLjA2N2MwIDE4LjczNSAxNS4yMjMgMzMuOTU4IDMzLjk1OCAzMy45NThzMzMuOTU4LTE1LjIyMyAzMy45NTgtMzMuOTU4LTE1LjIyMy0zMy45NTgtMzMuOTU4LTMzLjk1OC0zMy45NTggMTUuMjIzLTMzLjk1OCAzMy45NTh6TTQ1Ni4zOCAzMjMuNzY5YzAgMjQuMDA1IDE5LjMyIDQzLjMyNSA0My4zMjUgNDMuMzI1IDI0LjAwNSAwIDQzLjMyNS0xOS4zMiA0My4zMjUtNDMuMzI1IDAtMjQuMDA1LTE5LjMyLTQzLjMyNS00My4zMjUtNDMuMzI1LTI0LjAwNSAwLTQzLjMyNSAxOS4zMi00My4zMjUgNDMuMzI1eiIgcC1pZD0iMTUyNSIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Ik04NTguMDE3IDBIMTY1Ljk4M0M3NC42NDggMCAwLjI5MyA3NC4zNTYgMC4yOTMgMTY2LjI3NnY2OTAuODYzYzAgOTEuOTIgNzQuMzU1IDE2Ni4yNzYgMTY1LjY5IDE2Ni4yNzZoNjkyLjAzNGM5MS4zMzUgMCAxNjUuNjktNzQuMzU2IDE2NS42OS0xNjYuMjc2VjE2Ni4yNzZDMTAyMy43MDcgNzQuOTQgOTQ5LjM1MiAwIDg1OC4wMTcgMHpNMzg0LjM2NiA2ODYuMThjLTM4LjY0MiAwLTY5LjY3Mi04LjE5Ny0xMDguODk5LTE1LjgwOEwxNjcuMTU0IDcyNC44MmwzMS4wMy05My4wOUMxMjAuMzE2IDU3Ny4yOCA3NC4wNjMgNTA3LjAyMiA3NC4wNjMgNDIyLjEyOGMwLTE0Ny41NCAxMzkuOTI5LTI2NC4wNSAzMTAuMzAzLTI2NC4wNSAxNTIuODEgMCAyODYuMjk4IDkzLjA5IDMxMy4yMyAyMTcuNzk4YTI1NS4zNDEgMjU1LjM0MSAwIDAgMC0yOS44NTktMS43NTdjLTE0Ny41NCAwLTI2NC4wNSAxMTAuMDctMjY0LjA1IDI0NS4zMTUgMCAyMi44MzQgMy41MTMgNDQuNDk2IDkuMzY3IDY0Ljk4OC05LjM2NyAxLjE3MS0xOC43MzUgMS43NTctMjguNjg4IDEuNzU3eiBtNDU3Ljg0MyAxMDguMzEzbDIzLjQyIDc3LjI4My04NC44OTUtNDYuODM4Yy0zMS4wMyA3LjYxLTYyLjA2IDE1LjgwOC05My4wOSAxNS44MDgtMTQ3LjU0MSAwLTI2NC4wNTEtMTAwLjcwMy0yNjQuMDUxLTIyNS40MSAwLTEyNC4xMiAxMTYuNTEtMjI1LjQwOCAyNjQuMDUtMjI1LjQwOCAxMzkuMzQ0IDAgMjYzLjQ2NSAxMDEuMjg4IDI2My40NjUgMjI1LjQwOS0wLjU4NSA3MC44NDMtNDYuODM4IDEzMi45MDMtMTA4Ljg5OSAxNzkuMTU2eiIgcC1pZD0iMTUyNiIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Ik03NDEuNTA3IDU0Ni44MzZjMCAxOC43MzUgMTUuMjIzIDMzLjk1OCAzMy45NTggMzMuOTU4czMzLjk1OC0xNS4yMjMgMzMuOTU4LTMzLjk1OC0xNS4yMjMtMzMuOTU4LTMzLjk1OC0zMy45NThjLTE5LjMyIDAtMzMuOTU4IDE1LjIyMy0zMy45NTggMzMuOTU4eiIgcC1pZD0iMTUyNyIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPjwvc3ZnPg=="
                :dotsOptions="{
                  type: 'none',
                  color: '#000',
                  gradient: {
                    type: 'linear',
                    rotation: 0,
                    colorStops: [
                      { offset: 0, color: '#000' },
                      { offset: 1, color: '#000' },
                    ],
                  },
                }" :cornersSquareOptions="{ type: 'square', color: '#000', }"
                :cornersDotOptions="{ type: 'square', color: '#000', }" />
              <!-- <qrcode-vue v-if="orderData?.url" :value="orderData?.url" :size="150" level="H">
              </qrcode-vue> -->.
              <!-- <Vue3NextQrcode text="hello vue3 next qrcode" /> -->
            </div>
          </div>
          <p>请使用微信支付扫码付款</p>
        </div>
      </div>

      <div class="paySuccess" v-else>
        <el-icon class="icon">
          <SuccessFilled />
        </el-icon>
        <!-- <img src="@/assets/images/recharge/pay_success.png" alt=""> -->
        <p class="text">支付成功！</p>
      </div>
    </el-dialog>
  </div>
</template>


<script setup>
import { queryDictData } from "@/api/dictionary";
import {
  getAccount,
  recharge,
  aliPayNotify,
  rechargeList,
  rechargeStatus,
  remitBank,
  sendRemitBank,
  activateCoupon,
  listByUser,
  listRecord,
  couponslist,
} from "@/api/recharge";
import {
  ref,
  reactive,
  onMounted,
  watch,
  onBeforeUnmount,
  onDeactivated,
} from "vue";
import QrcodeVue from "qrcode.vue";
import QRCodeVue3 from "qrcode-vue3"
import { validatePhoneNumber } from "@/utils/checkUtil";
import DictComponent from "@/components/DictComponent.vue";
import { useMineStore } from "@/store/mine";
import { storeToRefs } from 'pinia'

// 支付宝支付后重定向处理逻辑
const route = useRoute();
const fullPath = route.fullPath; // 获取完整路由路径，例如："/payment-callback?orderId=123&status=success"
// 提取参数信息
const params = new URLSearchParams(fullPath.split("?")[1]);
const rechargeNo = params.get("rechargeNo");
// 执行查询操作，处理支付结果
if (rechargeNo) {
  getStatus(rechargeNo);
}

// 获取交易方式字典
const payways = ref([]);
const awardEventType = ref([]);
const Couponlistdata = ref({ list: [] });
const requiredDictTypes = ["payType", "awardEventType", "discountType"];
const vouchersQueryParam = reactive({
  beginTime: "",
  endTime: "",
  isAsc: true,
  pageNum: 1,
  pageSize: 8,
  sortColumn: "",
});
const logoImg = ref("");
const payType = ref([]);
const showtip = ref(false);
const payTypeMap = reactive({
  1: "支付宝",
  2: "微信",
  3: "线下汇款",
  4: "其他情况",
  5: "余额",
});
const Transactiontype = ref([])
const Transactiontypemap = ref([
  {
    label: "充值",
    value: 'recharge'
  },
  {
    label: "消费",
    value: 'charge'
  },
  {
    label: "退款",
    value: 'refund'
  },

]);
const CouponsQueryParam = reactive({
  page: 1,
  size: 12,
  type: ''
});
const Couponlist = ref({
  pageNum: 1,
  pageSize: 10,
  totalPage: 1,
  total: 6,
  list: [],
});
const inviteParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
const otheramount = ref(null);
async function getDictData() {
  // 以后可以增加更多类型
  const results = {};

  try {
    const promises = requiredDictTypes.map((type) => queryDictData({ type }));
    const responses = await Promise.all(promises);
    responses.forEach((res, index) => {
      if (res.code === 200) {
        results[requiredDictTypes[index]] = res.data;
      } else {
        console.log(`Error fetching ${requiredDictTypes[index]}: ${res.message}`);
      }
    });

    // 将结果赋值给相应的变量
    if (results.payType) payways.value = results.payType;
    if (results.awardEventType) awardEventType.value = results.awardEventType;
    if (results.discountType) discountType.value = results.discountType;
  } catch (error) {
    console.log(error);
  }
}
const isFullScreen = ref(false);

const checkFullScreen = () => {
  isFullScreen.value = window.innerHeight == screen.height;
};

onMounted(() => {
  window.addEventListener('resize', checkFullScreen);
  // 初始调用以设置初始值
  checkFullScreen();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkFullScreen);
});

const couponListBoxStyle = computed(() => {
  return {
    marginTop: isFullScreen.value ? '60px' : '20px'
  };
});

function TypeComponentsMap(type) {
  return Transactiontypemap.value.find((item) => item.value == type).label;
}
function formattedAmount(amount) {
  return (amount * 10);
}

function getcouponslist() {
  couponslist(CouponsQueryParam).then((res) => {
    console.log('Couponlist', res)
    Couponlist.value = res;
    // CouponlistTotal.value = res.total
  });
}
getcouponslist();

//分页查询优惠券
function CouponsQueryParamchange(CouponsPage) {
  CouponsQueryParam.page = CouponsPage;
  getcouponslist();
}
function findDictLabel(dictArray, val) {
  console.log('dictArray', dictArray)
  console.log('val', val)
  const match = dictArray.find((item) => item.dictValue == val);
  return match ? match.dictLabel : "";
}

function dictMate(type, val) {
  switch (type) {
    case "awardEventType":
      return findDictLabel(awardEventType.value, val);
    default:
      return "";
  }
}
// 变量声明
const radio1 = ref(0);

// online
// 充值逻辑
let payDialog = ref(false);
let orderData = ref({});
const code = ref("");
const loadingBtn = ref(false)
const rechargeFormData = reactive({
  amount: "",
  rechargetype: 1,
});
async function submitRecharge() {

  if (rechargeFormData.amount == "") {
    ElMessage({
      message: "请填写充值金额",
      type: "error",
    });
    return;
  }
  if (rechargeFormData.amount < 1) {
    ElMessage({
      message: "最低至少充值1.0元",
      type: "error",
    });
    return
  }
  if (accountInfo.value.verifyStatus == 1) {
    loadingBtn.value = true
    try {
      const res = await recharge(rechargeFormData);
      if (res.code == 200) {
        loadingBtn.value = false
        orderData = res.data;
        nextTick().then(() => {
          logoImg.value = '../../assets/images/recharge/success.png';
        });
        if (rechargeFormData.rechargetype == 1) {
          // window.location.href = res.data.url;
          window.open(res.data.url);
        } else {
          paySuccess.value = false;
          payDialog.value = true;
          startPolling();
        }
      } else {
        loadingBtn.value = false
        ElMessage({
          message: res.message,
          type: "warning",
        });
      }
    } catch (err) {
      ElMessage({
        message: err.message,
        type: "error",
      });
    }
  }
  else {
    ElMessage({
      message: "请先进行实名认证",
      type: "error",
    });
  }
}
// 轮询微信支付后状态逻辑
let intervalWxpay;
function startPolling() {
  intervalWxpay = setInterval(() => {
    getStatus(orderData.rechargeNo);
  }, 5000);
}
function stopPolling() {
  console.log(intervalWxpay);
  clearInterval(intervalWxpay);
}
// 获取充值后信息
const paySuccess = ref(false);
function getStatus(rechargeNo) {
  rechargeStatus({ rechargeNo }).then((res) => {
    console.log(res);
    if (res.code == 200) {
      if (res.data.status == 1) {
        // ElMessage({
        //   message: "充值成功",
        //   type: "success",
        // });
        setTimeout(() => {
          payDialog.value = false;
        }, 3000);
        paySuccess.value = true;
        getAccountInfo();
        stopPolling();
      } else {
        if (intervalWxpay) {
          return;
        }
        ElMessage({
          message: "充值失败",
          type: "error",
        });
      }
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
  });
}
function radio1change() {
  rechargeFormData.amount = radio1
  showtip.value = false;
  otheramount.value = null
}
function amountblur(val) {
  if (rechargeFormData.amount >= 1) {
    showtip.value = false;
  }
}
function amountclick() {
  radio1.value = 0;
}
function amountChange(value) {
  console.log('value', value)
  // 先将输入的值进行处理
  let sanitizedValue = value.replace(/\D/g, '');
  
  if ( sanitizedValue.length > 0 && sanitizedValue.length <= 6) {
    if (sanitizedValue.length === 1 && sanitizedValue === '0') {
      // 如果输入的是单个0，清空输入，显示最低充值提醒
      otheramount.value = ''
      showtip.value = true
    } else if (sanitizedValue.length > 1 && sanitizedValue.startsWith('0')) {
       // 如果首位为0，去掉首位
       showtip.value = false
       otheramount.value = sanitizedValue.slice(1)
    } else {
      otheramount.value = sanitizedValue
      showtip.value = false
    }
  } else if (sanitizedValue.length > 6){
    otheramount.value = sanitizedValue.slice(0, 6)
  } else {
    otheramount.value = sanitizedValue
  }
  rechargeFormData.amount = otheramount.value
}


const totalCount = ref(0)
const rechargeListTotal = ref(0)
const CouponlistTotal = ref(0)

// 查询支付券列表
async function getlistByUser() {
  await listByUser(vouchersQueryParam).then((res) => {
    if (res.code == 200) {
      Couponlistdata.value = res.data;
      totalCount.value = res.data.total
    } else {
      Couponlistdata.value.list = [];
    }
  });
}
//分页查询支付券
function Couponschange(CouponsPage) {
  vouchersQueryParam.pageNum = CouponsPage;
  getlistByUser();
}
const inviterecordate = ref([]);
const inviterecordateTotal = ref(0)
//分页查询邀请奖励
function getlistRecord() {
  listRecord(inviteParams).then((res) => {
    if (res.code == 200) {
      inviterecordate.value = res.data;
      inviterecordateTotal.value = res.data.total
      inviterecordatelistlength.value = res.data.list.length;
    } else {
      inviterecordate.value.list = [];
    }
  });
}
getlistRecord();
function invitePageChange(CouponsPage) {
  inviteParams.pageNum = CouponsPage;
  getlistRecord();
}
function inviteSizeChange(size) {
  inviteParams.pageSize = size;
  getlistRecord();
}
getlistByUser();
// 已完成付款
function payed() {
  payDialog.value = false;
  getStatus(orderData.rechargeNo);
}
// 线下汇款
const bankInfo = ref([]);
async function getRemitBank() {
  await remitBank().then((res) => {
    if (res.code == 200) {
      // bankInfo.value =  res.data;
      bankInfo.value = res.message.split("\n");
    } else {
      ElMessage({
        message: res.message,
        type: "error",
      });
    }
  });
}
getRemitBank();

// 发送转账信息只手机
const sended = ref(false);
function handleSended() {
  sended.value = true;
  setTimeout(() => {
    sended.value = false;
  }, 180000);
}
const phone = ref("");
async function handleSendRemitBank() {
  const valid = validatePhoneNumber(phone.value);
  if (!valid) {
    ElMessage({
      message: "请输入正确的手机号码！",
      type: "warning",
    });
    return;
  }
  try {
    const res = await sendRemitBank(phone);
    if (res.code == 200) {
      handleSended();
      ElMessage({
        message: res.message,
        type: "success",
      });
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
  } catch (err) {
    ElMessage({
      message: err.message,
      type: "error",
    });
  }
}
//
function formatRemainAmount(amount) {
  let formattedAmount = parseFloat(amount).toFixed(2);
  let [integerPart, decimalPart] = formattedAmount.split(".");
  decimalPart = "." + decimalPart; // 重新加上小数点
  return { integerPart, decimalPart };
}
// 复制文本信息
import clipboard3 from "vue-clipboard3";
import { functions, get } from "lodash";
const copyEle = ref(null);
const copyText = async () => {
  const { toClipboard } = clipboard3();
  // const text = bankInfo.value.join(',');
  const text = copyEle._value.innerText;
  console.log(text);
  try {
    await toClipboard(text);
    ElMessage({
      message: `转账信息复制成功`,
      type: "success",
    });
  } catch (error) {
    ElMessage({
      message: `复制失败`,
      type: "error",
    });
  }
};

// 获取账户信息
const accountInfo = ref({
  balance: 0,
  inviteCode: 0,
  currentCouponsAmount: 0,
});
function getAccountInfo() {
  getAccount().then((acinfo) => {
    accountInfo.value = acinfo.data;
  });
}
getAccountInfo();

// tabs切换
const mineStore = useMineStore()
const activeName = ref('online')
// const { activeName } = storeToRefs(mineStore)

const names = route.query.activeName;
if (names) {
  activeName.value = names;
}
const handleClick = (tab) => {
  mineStore.handleTabClick(tab)
  // console.log('activeName', activeName.value)
  code.value = "";
  queryParams.pageNum = 1;
  inviteParams.pageNum = 1;
  vouchersQueryParam.pageNum = 1;
  rechargeFormData.amount = "";
  rechargeFormData.rechargetype = 1;
  otheramount.value = null;
  getRechargeList();
  getlistByUser();
  getlistRecord();
}

const tabChange = (tab) => {
  activeName.value = tab
}

// 充值记录查询

const queryParams = reactive({
  payType: "",
  pageNum: 1,
  pageSize: 10,
  type: '',
});

const showFilter = ref(false);
const rechargeListData = ref({});
const loading = ref(false);
const rechargeListDatalength = ref();
const inviterecordatelistlength = ref(0);
//获取充值记录
async function getRechargeList() {
  loading.value = true;
  queryParams.type = Transactiontype.value.join(",");
  try {
    if (payType.value.length > 0) {
      queryParams.payType = payType.value.join(",");
    } else {
      queryParams.payType = "";
    }
    const res = await rechargeList(queryParams);
    if (res.code == 200) {
      loading.value = false;
      rechargeListData.value = res.data;
      rechargeListTotal.value = res.data.total
      rechargeListDatalength.value = res.data.list.length;
    } else {
      loading.value = false;
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
  } catch (err) {
    loading.value = false;
    ElMessage({
      message: err.message,
      type: "error",
    });
  }
}
getRechargeList();

// 激活支付券
async function activate() {
  await activateCoupon({ code: code.value }).then((res) => {
    if (res.code == 200) {
      // bankInfo.value =  res.data;
      ElMessage({
        message: res.message,
        type: "success",
      });
      code.value = "";
      getAccountInfo()
      getlistByUser();
    } else {
      ElMessage({
        message: res.message,
        type: "error",
      });
    }
  });
}

// 分页查询
function handlePageChange(currentPage) {
  queryParams.pageNum = currentPage;
  getRechargeList();
}
// 处理每页条目
function handleSizeChange(size) {
  queryParams.pageSize = size;
  getRechargeList();
}
//复制分享链接
function share() {
  // 获取基础 URL
  const baseUrl = window.location.origin;
  const inviteCode = encodeURIComponent(accountInfo.value.inviteCode); // 编码 osName 以确保 URL 的正确性
  const shareLink = `${baseUrl}/user/register?inviteCode=${inviteCode}`;

  // 检查浏览器是否支持 navigator.clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // 将链接复制到剪贴板
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        // 提供用户反馈，告知链接已复制
        ElMessage({
          message: "邀请链接已复制到剪贴板",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("复制失败:", err);
        this.$message.error("复制邀请链接失败");
      });
  } else {
    copyFallback(shareLink);
  }
}
// 创建一个临时文本框并将文本复制到其中
function copyFallback(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  // 提示用户链接已复制
  ElMessage({
    message: "邀请链接已复制到剪贴板",
    type: "success",
  });
}
function godocumentation() {
  window.open(
    "https://help.spacehpc.com/document/activities/invitation_rewards_program/invitation_rewards_program.html"
  );
}
// beforeUnmount清楚定时器
onBeforeUnmount(() => {
  clearInterval(intervalWxpay);
});
onDeactivated(() => {
  clearInterval(intervalWxpay);
});

// 监测router 变化
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.activeName) {
      activeName.value = newQuery.activeName
    } else {
      activeName.value = 'online'
    }
    console.log('newQuery', newQuery.activeName)
  },
  { immediate: true }
)

</script>

<style lang="less" scoped>
.recharge {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  padding: 20px 30px 20px 30px;
  margin: 0px 20px 20px 20px;
  height: calc(100% - 20px);
  box-sizing: border-box;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);

  .title {
    font-size: 18px;
    height: 28px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.6);
    line-height: 26px;
  }

  .account {
    display: flex;
    align-items: center;

    .balance {
      width: 100%;
      display: flex;
      flex-flow: column;

      height: 100%;
    }

    .img_div {
      width: 110px;
      height: 110px;
      margin: 30px 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
    }

    .img {
      margin: 24px;
      width: 64px;
      height: 64px;
    }

    .num_div {
      display: flex;
      align-items: end;

      .num {
        margin-right: 10px;
        font-size: 30px;
        line-height: 34px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #2696ff;
      }
    }
  }

  :deep(.tabs) {
    margin-left: 30px;

    .el-tabs__content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    // 线上充值样式
    .online {
      .amount {
        .el-radio__label {
          color: #ffffff;
          font-size: 24px;
          padding-left: 18px;
          margin-top: 10px
        }

        .num {
          font-size: 36px;
          line-height: 35px;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .other {
        .el-input__wrapper {
          background-color: #d7dbe2;
          width: 320px;
        }

        .amountinput {
          --el-component-size: 36px;
          width: 320px;
        }

        .is-error {
          --el-input-border-color: red;
          --el-border-color-hover: red;
          --el-input-focus-border: red;
          --el-input-focus-border-color: red
        }
      }

      .tip {
        height: 18px;
        margin-left: 90px;
        font-size: 12px;
        color: #FF4A4A;
        margin-top: 4px;
        margin-bottom: 25px;
      }

      .payway {
        .img {
          margin-top: 12px;
          margin-left: 10px;
        }

        .el-radio {
          margin-right: 60px;
        }
      }

      .primarybtn {
        width: 319px;
        height: 40px;
        line-height: 40px;
        border-color: #2156b3;
        background: #2156b3;
        border-radius: 8px 8px 8px 8px;
        font-size: 16px;
        font-family: Source Han Sans CN-Bold, Source Han Sans CN;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        margin-top: 40px;
      }
    }

    // 线上充值样式 end
    // 线下pane样式
    .offline {
      .title {
        margin: 30px 0 20px;
        font-size: 18px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.6);
      }

      .card {
        width: 720px;
        height: 240px;
        box-sizing: border-box;
        padding: 41px 70px 42px 40px;
        background: #151b24;
        border-radius: 8px 8px 8px 8px;
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.32);
        font-size: 18px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.85);

        .eopy {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
      }

      .info {
        position: relative;

        .lh26 {margin-bottom: 15px}
      }

      .copy_btn {
        position: absolute;
        top: 41px;
        right: 70px;
      }

      .phone_card {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .primarybtn {
        width: 80px;
        height: 40px;
        margin-left: 20px;
      }

      .sended {
        display: flex;
        align-items: center;
        line-height: 26px;
        font-size: 18px;
        font-weight: 400;

        img {
          margin-right: 12px;
        }
      }
    }

    // 线下pane样式 end
    .rechargeList {
      .rechargeTable {
        margin-top: 15px;

        .el-table th.el-table__cell {
          background: #0b1320;

          .cell {
            color: rgba(255, 255, 255, 0.45);
          }
        }

        .filter {
          .filterLable {
            margin-right: 10px;
          }

          .check {
            color: rgba(38, 150, 255, 1);
            font-weight: 500;
          }
        }
      }

      .el-pagination__goto {
        display: none;
      }

      .pagination {
        margin-top: 20px;
        // margin-bottom: 20px;
        display: flex;
        align-items: center;

        .el-input__wrapper {
          background: #d7dbe2;
          box-shadow: none;
        }
      }
    }

    .voucher {
      overflow-y: auto;

      .Couponlistbox {
        display: flex;
        flex-flow: column;
        margin-top: 20px;
        flex: 1;
        overflow: hidden;

        /* 防止溢出 */
        .Couponlist {
          overflow-y: auto;
          display: flex;
          flex-wrap: wrap;
          // flex: 1;
          grid-gap: 40px 30px;


          /* 设置固定的行高 */
          .Coupons {
            padding: 20px 20px 16px 20px;
            height: 185px;

            .Couponstop {
              display: flex;
              border-bottom: 1px solid #26303e;
              padding-bottom: 10px;

              img {
                margin-right: 8px;
                margin-top: 5px;
              }

              .topamount {
                line-height: 17px;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
              }
            }
          }

          .Couponsbottom {
            width: 100%;
            display: flex;

            .remainAmount {
              margin-top: 6px;
              text-align: center;
              width: 100%;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              position: relative;
              left: 50%;
              transform: translate(-50%, 0%);
              .sp {
                color: #2696ff;
              }

              .sp3 {
                color: rgba(38, 150, 255, 0.65);
              }

              .sp4 {
                margin-right: 20px;
              }

              .sp2 {
                font-size: 30px;
                display: inline-block;
                line-height: 33px;
                margin-top: 20px;
              }
            }

            .imgbox {
              width: 86px;
              margin-left: 10px;
              height: 86px;
            }
          }
        }

        .pagination {
          // margin-bottom: 20px;
        }

        .prompt {
          position: absolute;
          left: 49%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .coupons {
      .Couponlistbox {
        display: flex;
        flex-flow: column;
        margin-top: 60px;
        flex: 1;
        overflow: hidden;

        /* 防止溢出 */
        .Couponlist {
          overflow-y: auto;
          /* 允许垂直滚动 */
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          grid-gap: 40px 30px;
          grid-auto-rows: 155px;

          /* 设置固定的行高 */
          .Coupons {
            height: 155px;
            position: relative;
            padding: 20px;

            .Couponstop {
              display: flex;
              border-bottom: 1px solid #26303e;
              padding-bottom: 8px;

              .topamount {
                line-height: 20px;
                display: flex;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);

                .pt26 {
                  padding-top: 26px;
                }

                .amounts {
                  height: 52px;
                  color: #2696ff;
                  line-height: 52px;
                  font-size: 36px;
                  margin-right: 4px;
                  display: inline-block;
                }
              }
            }
          }

          .Couponsbk {
            background: rgba(0, 0, 0, 0.35);
          }

          .maskLayer {
            position: absolute;
            /* 设置绝对定位 */
            width: 340px;
            height: 155px;
            top: 0;
            left: 0;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.35);

            .imgbox {
              display: flex;
              height: 100%;
              justify-content: center;
              place-items: center;
            }
          }

          .Couponsbottom {
            margin-top: 17px;
            display: flex;
            height: 22px;
            line-height: 22px;
            place-items: center;

            i {
              margin-left: 4px;
            }

            .tag {
              margin-left: auto;
              width: 44px;
              height: 100%;
              border-radius: 4px 4px 4px 4px;
              text-align: center;
              background: #2156b3;
            }
          }
        }

        .pagination {
          margin-bottom: 20px;
        }
      }

      .prompt {
        position: absolute;
        left: 49%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .descript {
      p {
        line-height: 26px;
      }
    }

    .Coupontop {
      margin-top: 20px;
      display: flex;
      height: 36px;
    }

    .Couponlist {
      grid-template-columns: repeat(auto-fill, minmax(340px, 1px));

      .Coupons {
        width: 340px;
        display: flex;
        flex-flow: column;
        background: #0b1320;
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.45);
        border-radius: 10px 10px 10px 10px;
        box-sizing: border-box;
      }

      .Couponsoverdue {
        background-color: rgba(0, 0, 0, 0.35);
      }
    }
  }
}

:deep(.dialog) {
 padding: 15px 20px;

  .info {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: 450px;
    text-align: center;

    .pay {
      font-size: 24px;
      margin-bottom: 20px;
    }
  }

  .wxpay {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    padding-top: 4px;
    color: rgba(255, 255, 255, 0.6);
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;

    .img {
      width: 150px;
      margin-bottom: 50px;
    }

    .qr {
      margin-bottom: 20px;
      padding: 15px;
      height: 180px;
      width: 180px;
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, 0.15);

      .code {
        height: 150px;
        width: 150px;
        background-color: #fff;
      }
    }
  }

  .paySuccess {
    // display: flex;
    // justify-content: center;
    text-align: center;

    .icon {
      font-size: 60px;
      color: RGBA(73, 170, 25, 1);
      margin-right: 24px;
    }

    .text {
      margin: 30px 0 50px;
      font-size: 24px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
    }
  }
}
</style>
<style lang="less" scoped>
// element 样式修改
:deep(.tabs) {

  // tabs切换栏样式修改
  .el-tabs__header {
    margin-bottom: 0;
  }

  .el-tabs__item {
    margin-right: 30px;
  }

  .el-tabs__active-bar {
    width: 86px !important;
    height: 1px;
    background: rgba(38, 150, 255, 1);
  }

  .el-tabs__nav-wrap::after {
    height: 1px;
    background: #26303e;
  }

  .el-tabs__item {
    padding: 0;
    width: 86px;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
  }

  .is-active {
    color: rgba(38, 150, 255, 1);
  }

  // tabs切换栏样式修改 end
  // 线上充值样式修改
  .online {
    margin: 50px 0;

    .el-form-item {
      align-items: center;
      margin-bottom: 0px
    }

    .el-form-item__label {
      color: rgba(0, 0, 0, 0.6);
      justify-content: flex-start;
    }

    .amount {
      .el-radio-group .el-radio {
        display: flex;
        position: relative;
        width: 240px;
        height: 80px;
        margin-right: 10px;

        .el-radio__input {
          position: absolute;
          top: 21px;
          right: 19px;
        }
      }
    }

    // 单选框样式
    .el-radio__input {
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 40px 40px 40px 40px;
    }

    .el-radio__input.is-checked {
      border: 2px solid #2696ff !important;
      border-radius: 50%;
    }

    .el-radio__inner::after {
      width: 8px;
      height: 8px;
      background-color: #2696ff;
    }

    .el-radio.is-bordered.el-radio--large {
      border-color: rgba(11, 19, 32, 1);
      background-color: #D7DBE2;
    }

    .el-radio.is-bordered.is-checked {
      border: 1px solid #2696ff !important;
      border-radius: 8px 8px 8px 8px;
    }

    .el-radio__input.is-checked .el-radio__inner {
      border-color: #0b1320;
      background: #0b1320;
    }

    // 单选框样式 end
  }

  // 线上充值样式修改 end
}

// element 样式修改 end
:deep(.el-dialog__body) {
  padding: 0px;
}
</style>

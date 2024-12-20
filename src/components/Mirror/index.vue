<template>
  <div>
    <div class="mirror" v-if="screenWidth > 750">
      <div class="mirror-header"></div>
      <div class="mirror-box flex-center">
        <!-- 768以上展示 -->
        <!-- <div class="mirror-tab-box show-up-sm">
          <ul class="flex-align-end flex-center flex-column-direction mirror-tabs-title">
            <li v-for="(item, index) in tabList" :key="item.id" @click="handleChangeTab(index)" :class="index == activeIndex ? 'mirror-tab-active-right' : ''" class="flex-align-center flex-end">
              <span v-if="item.id == 3 && mirrorCount > 0" class="mirror-count">+{{ mirrorCount }}</span>
              <span>{{item.title}}</span>
            </li>
          </ul>
        </div> -->
        <!-- 768及以下展示 -->
        <template>
          <div class="mirror-tab-box show-down-and-sm">
            <ul class=" flex-center flex-column-direction mirror-tabs-title">
              <li v-for="(item, index) in tabListTwo" :key="item.id" @click="handleChangeTab(index)" :class="index == activeIndex ? 'mirror-tab-active' : ''" class="flex-align-center flex-end">
                <span>{{item.title}}</span>
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
          </div>
        </template>
        <div class="mirror-content-box">
          <div class="mirror-tab-box show-up-sm">
            <ul class="flex-align-center mirror-tabs-title">
              <li 
                v-for="(item, index) in tabList" 
                :key="item.id" @click="handleChangeTab(index)" 
                :class="index == activeIndex ? 'mirror-tab-active' : ''" 
                class="flex-align-center ">
                <span>{{item.title}}</span>
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
            <div class="mirror-tag-box flex-align-start flex-between" v-if="activeIndex != 2">
              <div class="mirror-tag-list">
                <div 
                  v-for=" (value, key, index) in mirrorTags" 
                  :key="index" 
                  class="mirror-tag-item"
                  :class="index == mirrorIndex ? 'mirror-tag-active' : ''" 
                   @click="handleSelectTag(key, index)">
                  {{ key }}
                  <!-- <i v-if="isShowTagIcon(key, index)" class="el-icon-check"></i> -->
                </div>
              </div>
              <!-- <div class="mirror-tag-selected">
                已选：{{ selectedTags }}
              </div> -->
            </div>
          </div>
          
          <el-skeleton :loading="loading" animated class="mirror-el-skeleton">
            <template slot="template">
              <div class="flex-align-center flex-wrap flex-between">
                <el-skeleton-item v-for="(item, index) in 4" :key="index"  variant="rect" class="mirror-item" />
              </div>
            </template>
            <template>
              <div class="mirror-list-box flex-align-center flex-wrap">
                <div class="mirror-item flex-align-center flex-center" v-for="item in mirrorList" :key="item.id" @click="handleClickItem(item)">
                  <img :src="item.imgIcon" alt="" class="mirror-item-icon-img">
                  <div class="mirror-item-info flex-between flex-column-direction ml10">
                    <div class="mirror-item-top flex-algin-center flex-between">
                      <div class="mirror-item-title">{{ item.imgName }}</div>
                      <div class="mirror-item-recommend flex-align-center" v-if="activeIndex != 2">
                        <div class="icon-box flex-center flex-align-center" v-if="item.star">
                          <img class="icon" :src="iconUrl" />
                        </div>
                        <div class="tag-icon" v-if="item.recommend">{{item.recommend}}</div>
                      </div>
                    </div>
                    <div class="mirror-item-author">
                      <!-- 镜像市场 展示镜像作者 -->
                      <span v-if="item.imgType == 1">@{{ item.authorName }}</span>
                      <!-- 基础镜像 展示驱动版本和cuda版本-->
                      <span v-else>
                        <!-- <span>{{ item.driverVersion }}</span>
                        <span v-if="item.driverVersion"> | </span> -->
                        <span>{{ item.osVersion }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>
    <div class="mini-mirror flex-center flex-align-start" v-if="screenWidth <= 750">
      <div class="mini-mirror-box flex-column-direction flex-align-center semibold-text">
        <!-- 搜索框 -->
        <div class="mirror-search-box mini-mirror-search-box">
          <el-input placeholder="输入关键词搜索镜像" suffix-icon="el-icon-search" type="text" class="mirror-search-input" v-model="imgName" @keyup.enter.native="handleSearch" clearable @clear="publicQueryMethod()">
          </el-input>
        </div>
        <!-- tabbar -->
        <div class="mini-mirror-tab-box">
          <ul class="flex-align-center flex-center flex-between mini-mirror-tabs-title">
            <li v-for="(item, index) in tabListTwo" :key="item.id" @click="handleChangeTab(index)" :class="index == activeIndex ? 'mirror-tab-active-bottom' : ''" class="flex-align-center flex-center">
              <span>{{item.title}}</span>
            </li>
          </ul>
        </div>
        <!-- 标签 -->
        <div class="mirror-tag-box mini-mirror-tag-box flex-align-start flex-between" v-if="activeIndex != 2">
          <div class="mirror-tag-list">
            <div v-for=" (value, key, index) in mirrorTags" :key="index" class="mirror-tag-item mr10" style="margin-left: 0;" :style="moreStyle(value, index)" @click="handleSelectTag(key, index)">
              {{ key }}
              <i v-if="isShowTagIcon(key, index)" class="el-icon-check"></i>
            </div>
          </div>
        </div>
        <div class="mirror-tag-selected mb20 mini-mirror-tag-selected">
            已选：{{ selectedTags }}
          </div>
        <!-- 镜像内容 -->
        <el-skeleton :loading="loading" animated class="mirror-el-skeleton">
          <template slot="template">
            <div class="flex-align-center flex-wrap flex-between">
              <el-skeleton-item v-for="(item, index) in 4" :key="index"  variant="rect" class="mirror-item" />
            </div>
          </template>
          <template>
            <div class="mirror-list-box flex-align-center flex-wrap">
              <div class="mirror-item flex-align-center flex-center" v-for="item in mirrorList" :key="item.id" @click="handleClickItem(item)">
                <img :src="item.imgIcon" alt="" class="mirror-item-icon-img">
                <div class="mirror-item-info flex-between flex-column-direction ml10">
                  <div class="mirror-item-top flex-algin-center flex-between">
                    <div class="mirror-item-title">{{ item.imgName }}</div>
                    <div class="mirror-item-recommend flex-align-center" v-if="activeIndex != 2">
                      <!-- <div class="icon-box flex-center flex-align-center" v-if="item.star">
                        <img class="icon" :src="iconUrl" />
                      </div>
                      <div class="tag-icon" v-if="item.recommend">{{item.recommend}}</div> -->
                    </div>
                  </div>
                  <div class="mirror-item-author">
                    <!-- 镜像市场 展示镜像作者 -->
                    <span v-if="item.imgType == 1">@{{ item.authorName }}</span>
                    <!-- 基础镜像 展示驱动版本和cuda版本-->
                    <span v-else>
                      <!-- <span>{{ item.driverVersion }}</span>
                      <span v-if="item.driverVersion"> | </span> -->
                      <span>{{ item.osVersion }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
    <el-dialog
      custom-class="mirror-dialog"
      :visible.sync="dialogVisible"
      append-to-body
      :show-close="false"
      width="465px">
      <div>
        <div class="dialog-item flex-align-center flex-center" >
          <img :src="dialogData.imgIcon" alt=""  class="dialog-item-icon-img" >
          <div class="dialog-item-info flex-between flex-column-direction ml10">
            <div class="dialog-item-top flex-algin-center flex-between">
              <div class="dialog-item-title">{{ dialogData.imgName }}</div>
              <div class="dialog-item-recommend flex-align-center" @click="handleHelpment()" v-if="dialogData.docUrl">
                <div class="icon-box flex-center flex-align-center">
                  <img class="icon" :src="shareIcon" />
                </div>
              </div>
            </div>
            <div class="dialog-item-author">
              <!-- 镜像市场 展示镜像作者 -->
              <span v-if="dialogData.imgType == 1">@{{ dialogData.authorName }}</span>
              <!-- 基础镜像 展示驱动版本和cuda版本-->
              <span v-else>
                <!-- <span>{{ dialogData.driverVersion }}</span>
                <span v-if="dialogData.driverVersion"> | </span> -->
                <span>{{ dialogData.osVersion }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="dialog-item-detail">
          <div class="flex-center flex-between">
            <span v-if="dialogData.imgSize">镜像大小：{{ dialogData.imgSize }} GB</span>
            <span v-if="dialogData.updatedAt">更新时间：{{ dialogData.updatedAt }}</span>
          </div>
          <p class="desc-text" v-if="dialogData.description">{{ dialogData.description }}</p>
        </div>
        <div class="dialog-item-footer flex-align-center flex-center mt10" @click="handleDeployment()">
          立即部署
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../assets/js/api'
import utils from '../../assets/js/util';
import { mapGetters } from 'vuex';
export default {
  name: "Mirror",
  data() {
    return {
      activeIndex: 0,
      mirrorCount: 0, // 新增镜像数量
      mirrorIndex: 0, // 新增镜像数量
      tabList: [
        {
          id: 2,
          title: '基础镜像',
          imgType: 0,
          isShow: true
        },
        {
          id: 3,
          title: '镜像市场',
          imgType: 1,
          isShow: true
        },
        {
          id: 1,
          title: '我的镜像',
          imgType: 2,
          isShow: true
        },
        {
          id: 4,
          title: '最近使用',
          isShow: true
        },
      ],
      tabListTwo: [
        {
          id: 2,
          title: '基础',
          imgType: 0,
          isShow: true
        },
        {
          id: 3,
          title: '市场',
          imgType: 1,
          isShow: true
        },
        {
          id: 1,
          title: '我的',
          imgType: 2,
          isShow: true
        },
        {
          id: 4,
          title: '最近',
          isShow: true
        },
      ],
      loading: false,
      queryParams: {
        imgLabels: []
      },
      imgLabels: [], // 标签查询参数
      imgName: "", // 镜像名称参数
      iconUrl: require('../../assets/image/index/price_detail/recommend.png'),
      shareIcon: require('../../assets/image/public/export_hover.svg'),
      mirrorList: [], // 镜像列表
      mirrorTags: [], // 镜像标签
      dialogVisible: false,
      dialogData: {}, //弹窗数据
    }
  },
  computed: {
    ...mapGetters(['screenWidth']),
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
    selectedTags() {
      if (this.imgLabels && this.imgLabels.length > 0) {
        return this.imgLabels.join('、');
      } else {
        return '所有镜像';
      }
    }
  },
  mounted() {
    this.getMirrorCount();
    this.handleChangeTab(this.activeIndex);
  },
  methods: {
    //切换tab
    handleChangeTab(index) {
      this.imgLabels = [];
      this.imgName = "";
      this.activeIndex = index;
      this.publicQueryMethod(1);
    },
    // 查询镜像
    handleSearch() {
      this.publicQueryMethod();
    },
    // 选择tag标签
    handleSelectTag(key, index) {
      // 所有镜像
      this.mirrorIndex = index
      if (index === 0) {
        this.imgLabels = [];
      } else {
        // 基础镜像单选
        if (this.tabList[this.activeIndex].imgType == 0) {
          this.imgLabels = [key];
        } else {
          if (this.imgLabels) {
            let _index = this.imgLabels.indexOf(key);
            if (_index > -1) {
              this.imgLabels.splice(_index, 1);
            } else {
              this.imgLabels.push(key);
            }
          }
        }
      }
      this.publicQueryMethod();
    },
    // 公共查询方法
    publicQueryMethod(all) {
      // 切换tab
      try {
        switch (this.activeIndex) {
          case 0:
            // 基础镜像
            this.getMirrorList();
            if (all) { // 查全部
              this.getMirrorTagList();
            }
            break;
          case 1:
            // 镜像市场
            this.getMirrorList();
            if (all) { // 查全部
              this.getMirrorTagList();
            }
            break;
          case 2:
            // 我的镜像
            this.getMyMirrorList();
            if (all) { // 查全部
              this.getMyMirrorTagList();
            }
            break;
          case 3:
            // 最近使用
            this.getRecentUseMirrorList();
            if (all) { // 查全部
              this.getRecentUseMirrorTagList();
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取我的镜像列表
    getMyMirrorList() {
      this.loading = true
      let params = "";
      params += `imgType=${this.tabList[this.activeIndex].imgType}`
      if (this.imgLabels && this.imgLabels.length) {
        params += `&imgLabels=${this.imgLabels}`;
      }
      if (this.imgName) {
        params += `&imgName=${this.imgName}`;
      }
      // console.log('params', params)
      api.getMyMirrorList(params)
        .then((res) => {
          if (res) {
            res.forEach(item => {
              item.imgType = 2
              if (item.updatedAt) {
                item.updatedAt = utils.formatDate(item.updatedAt, 'yyyy-mm-dd');
              }
            })
            this.mirrorList = res
          }
          this.loading = false
        }).catch(err => {
          this.mirrorList = [];
          this.loading = false;
          this.$message.error(err);
        })
    },
    // 获取我的镜像标签
    getMyMirrorTagList() {
      api.getMyMirrorTagList()
        .then((res) => {
          const newObj = Object.assign({
            "所有镜像": "#15395B"
          }, res);
          this.mirrorTags = newObj;
        }).catch(err => {
          this.mirrorTags = {};
        })
    },
    // 获取镜像列表 基础/镜像市场
    getMirrorList() {
      this.loading = true;
      let params = `imgType=${this.tabList[this.activeIndex].imgType}`;
      if (this.imgLabels && this.imgLabels.length) {
        params += `&imgLabels=${this.imgLabels}`;
      }
      if (this.imgName) {
        params += `&imgName=${this.imgName}`;
      }
      api.getMirrorList(params).then(res => {
        if (res) {
          res.forEach(item => {
            if (item.updatedAt) {
              item.updatedAt = utils.formatDate(item.updatedAt, 'yyyy-mm-dd');
            }
          })
          this.mirrorList = res
        }
        this.loading = false
      }).catch(err => {
        this.mirrorList = [];
        this.loading = false;
        this.$message.error(err);
      })
    },
    // 获取镜像标签
    getMirrorTagList() {
      let params = `imgType=${this.tabList[this.activeIndex].imgType}`;
      api.getMirrorTags(params).then((res) => {
        const newObj = Object.assign({
          "所有镜像": "#15395B"
        }, res);
        this.mirrorTags = newObj;
      }).catch(err => {
        this.mirrorTags = {};
      })
    },
    // 获取最近使用镜像列表
    getRecentUseMirrorList() {
      this.loading = true
      let params = "";
      if (this.imgLabels && this.imgLabels.length) {
        params += `&imgLabels=${this.imgLabels}`;
      }
      if (this.imgName) {
        params += `&imgName=${this.imgName}`;
      }
      api.getRecentUseMirrorList(params)
        .then((res) => {
          if (res) {
            res.forEach(item => {
              if (item.updatedAt) {
                item.updatedAt = utils.formatDate(item.updatedAt, 'yyyy-mm-dd');
              }
            })
            this.mirrorList = res
          }
          this.loading = false
        }).catch(err => {
          this.mirrorList = [];
          this.loading = false;
          this.$message.error(err);
        })
    },
    // 获取最近使用镜像标签
    getRecentUseMirrorTagList() {
      api.getRecentUseMirrorTagList()
        .then((res) => {
          const newObj = Object.assign({
            "所有镜像": "#15395B"
          }, res);
          this.mirrorTags = newObj
        }).catch(err => {
          this.mirrorTags = {};
        })
    },
    // 获取最近15天上线镜像数量
    getMirrorCount() {
      try {
        api.getMirrorCount().then(res => {
          this.mirrorCount = res;
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 点击镜像 弹窗
    handleClickItem(item) {
      this.dialogVisible = !this.dialogVisible;
      this.dialogData = item;
      console.log('this.dialogData', item)
    },
    // 跳转至帮助文档
    handleHelpment () {
      let url = `${this.dialogData.docUrl}`
      window.open(url, '_blank')
    },
    // 跳转部署
    handleDeployment() {
      var url
      if (this.dialogData.imgType == 2) {
        url = `${this.$config.pageUrlPro}/create?imgType=${this.dialogData.imgType}&myImgId=${this.dialogData.id}`
      } else {
        url = `${this.$config.pageUrlPro}/create?imgType=${this.dialogData.imgType}&osName=${this.dialogData.imgName}`;
      }
      
      window.open(url, '_blank');
    }
  },
}
</script>

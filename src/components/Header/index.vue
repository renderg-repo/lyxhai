<template>
  <div class="" >
    <div class="show-up-sm flex-align-center" :style="headerStyle" :class="{color: color}">
      <div class=" header-box flex-align-center flex-between">
        <div class="logo-box">
          <router-link to="/">
            <template v-if="screenWidth >= 900">
              <img class="logo" src="../../assets/images/public/logo.png" alt="">
            </template>
            <template v-else>
              <img class="logo-mini" src="../../assets/images/public/logo.png" alt="">
            </template>
          </router-link>
        </div>
        <div class="menu-box flex-align-center">
          <ul class="flex-align-center">
            <li v-for="(item, index) in tabList" :key="index" :class="{active:active == index}">
              <a target="_blank" v-if="index == tabList.length - 1" :href="item.path">{{item.title}}</a>
              <router-link v-else :to="item.path">{{item.title}}</router-link>
            </li>
          </ul>
        </div>
        <div class="header-right flex-align-center flex-end">
          <template v-if="isAuthenticated">
            <div class="right-item flex-align-center flex-center mr10">
              <a href="" target="_blank" @click.prevent="handleToPath('/dashboard')">控制台</a>
            </div>
            <el-popover
              placement="bottom"
              popper-class="uesr-info"
              width="300"
              trigger="click">
              <div slot="reference" class="primary-btn user-btn flex-align-center flex-center">
                <p style="width: 12px; height: 12px; line-height: 12px; color: #fff;">{{ capitalizeFirstLetter(getUserName) }}</p>
              </div>
              <div class="uesr-info-box">
                <div class="info-top flex-align-center flex-around">
                  <div class="user-btn">
                    {{ capitalizeFirstLetter(getUserName) }}
                  </div>
                  <div class="info ">
                    <div class="title flex-align-center">
                      <span class="uesr-info-username">
                        {{ userInfo.username }}
                      </span>
                      <div class="usertype flex-align-center">
                        <div class="typeitem " style="margin-right: 5px;">
                          <span v-if="
                            Account.verifyStatus == 0 ||
                            Account.verifyStatus == 1
                          ">
                          
                          {{ dictMate("verifyType", Account.verifyType) }}
                          </span>
                          <span v-else>未认证</span>
                        </div>
                        <div class="typeitem">
                          
                          {{ dictMate("accountType", Account.accountType) }}
                        </div>
                      </div>
                    </div>
                    <div class="uesr-info-phone">{{ userInfo.phone }}</div>
                  </div>
                </div>
                <div class="info-content flex-align-center flex-between">
                  <div class="balance left ">
                    <div class="balance-top flex-align-center flex-between">
                      <p class="balance-title">余额</p>
                      <a href="" target="_blank" @click.prevent="handleToPath('/mine/recharge?activeName=online')">
                        <p class="balance-link">充值</p>
                      </a>
                    </div>
                    <a href="" target="_blank" @click.prevent="handleToPath('/mine/recharge?activeName=online')">
                      <div class="balance-num">
                        <span class="balance-symbol">￥</span>
                        {{ Account.balance }}
                      </div>
                    </a>
                  </div>
                  <div class="balance">
                    <div class="balance-top flex-align-center flex-between">
                      <p class="balance-title">支付券</p>
                      <a href="" target="_blank" @click.prevent="handleToPath('/mine/recharge?activeName=voucher')">
                        <p class="balance-link">{{ Account.currentCoupons }}张</p>
                      </a>
                    </div>
                    <a href="" target="_blank" @click.prevent="handleToPath('/mine/recharge?activeName=voucher')">
                      <div class="balance-num">
                        <span class="balance-symbol">￥</span>
                        {{ Account.currentCouponsAmount }}
                      </div>
                    </a>
                  </div>
                </div>
                <div class="info-bottom flex-align-center" @click="handleExit">
                  <div class="exit-icon"><img src="../../assets/image/public/exit_normal.svg" alt=""></div>
                  <p class="exit">退出登录</p>
                </div>
              </div>
            </el-popover>
          </template>
          <template v-else>
            <div class="right-item flex-align-center flex-center mr10">
              <a href="" target="_blank" @click.prevent="handleToPath('/user/login')">
                <img src="../../assets/images/public/login-button.png" alt="登录">
              </a>
            </div>
            <a href="" target="_blank" @click.prevent="handleToPath('/user/register')">
              <div class="primary-btn register-btn">
                <img src="../../assets/images/public/signin-button.png" alt="注册">
              </div>
            </a>
          </template>
        </div>
      </div>
    </div>
    
    <div class="show-down-and-sm">
      <div class="header-box">
        <div class="flex-align-center flex-between">
          <div class="logo-box">
            <router-link to="/">
              <img class="logo-mini" src="../../assets/image/public/logo_mini.svg" alt="">
            </router-link>
          </div>
          <!-- > 390 && < 768-展示 -->
          <div class="show-up-xs menu-box flex-align-center" v-if="screenWidth >= 560">
          <ul class="flex-align-center">
            <li v-for="(item, index) in tabList" :key="index" :class="{active:active == index}">
              <a target="_blank" v-if="index == tabList.length - 1" :href="item.path">{{item.title}}</a>
              <router-link v-else :to="item.path">{{item.title}}</router-link>
            </li>
          </ul>
          </div>
          <div class="show-up-xs header-right" v-if="screenWidth >= 560">
            <div class="flex-align-center flex-end">
              <template v-if="isAuthenticated">
                <div class="right-item flex-align-center flex-center mr10">
                  <a href="" target="_blank" @click.prevent="handleToPath('/dashboard')">控制台</a>
                </div>
                <a href="" target="_blank" @click.prevent="handleToPath('/dashboard')">
                  <div class="primary-btn user-btn">{{ getUserName }}</div>
                </a>
              </template>
              <template v-else>
                <div class="right-item flex-align-center flex-center mr10">
                  <a href="" target="_blank" @click.prevent="handleToPath('/user/login')">登录</a>
                </div>
                <a href="" target="_blank" @click.prevent="handleToPath('/user/register')">
                  <div class="primary-btn register-btn">注册</div>
                </a>
              </template>
            </div>
          </div>
          <!-- 390及以下展示 -->
          <div v-if="screenWidth < 560">
            <div class="nav-icon flex-align-center flex-center" 
              @mouseenter="!navActive" 
              @mouseleave="navActive" 
              @click="minDrawer = true">
              <!-- <img v-if="navActive" src="../../assets/image/public/nav-icon.svg" alt="">
              <img v-else src="../../assets/image/public/nav-icon-active.svg" alt=""> -->
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <el-drawer
      class="hidden-sm-and-up"
      custom-class="drawer-box"
      size="37.5%"
      :visible.sync="minDrawer"
      :direction="direction"
      :modal-append-to-body='false'
      :show-close='false'>
      <div class="drawer-box">
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="$route.path"
          router>
          <!-- <template v-if="isAuthenticated">
            <el-menu-item class="flex-align-center flex-center" >
              <a href="" target="_blank" @click.prevent="handleToPath('/dashboard')">
                <div class="primary-btn user-btn">{{ getUserName }}</div>
              </a>
            </el-menu-item>
            <el-menu-item class="flex-align-center flex-center" >
              <span slot="title" @click="handleToPath('/dashboard')">控制台</span>
            </el-menu-item>
            <el-menu-item class="flex-align-center flex-center" >
              <span slot="title" @click="handleExit()">退出</span>
            </el-menu-item>
          </template> -->
          <template >
            <el-menu-item class="flex-align-center flex-center" >
              <div class="primary-btn register-btn" @click="handleToPath('/user/register')">注册</div>
            </el-menu-item>
            <el-menu-item class="flex-align-center flex-center" >
              <span slot="title" @click="handleToPath('/user/login')">登录</span>
            </el-menu-item>
          </template>
          <el-menu-item index="/" class="flex-align-center flex-center" >
            <span slot="title">主页</span>
          </el-menu-item>
          <el-menu-item index="/mirror" class="flex-align-center flex-center">
            <span slot="title">镜像中心</span>
          </el-menu-item>
          <el-menu-item index="/computing" class="flex-align-center flex-center">
            <span slot="title">算力服务器</span>
          </el-menu-item>
          <el-menu-item index="/news" class="flex-align-center flex-center">
            <span slot="title">新闻</span>
          </el-menu-item>
          <el-menu-item class="flex-align-center flex-center">
            <span slot="title" @click="handleToHelp()">帮助文件</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'js-cookie';
import api from "../../assets/js/api";
export default {
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tabList: [{
          path: "/",
          title: "主页"
        },
        {
          path: "/mirror",
          title: "镜像中心"
        },
        {
          path: "/computing",
          title: "算力服务器"
        },
        {
          path: "/news",
          title: "新闻"
        },
        {
          path: "https://help.spacehpc.com/",
          title: "帮助文档"
        }
      ],
      drawer: false,
      minDrawer: false,
      direction: 'rtl',
      style: {
        backgroundColor: '',
        marginTop: '',
      },
      scrollY: 0,
      color: false,
      navActive: true,
      requiredDictTypes: ["accountType", "verifyType", "verifyStatus"],
      allDicts: {},
      getUserName: '',
      userInfo: {},
      Account: {
        verifyStatus: 0,
        balance: 88888,
        currentCoupons: 100,
        currentCouponsAmount: 1056.58
      },
      isAuthenticated: Boolean(sessionStorage.getItem('isAuthenticated'))
    }
  },
  computed: {
    // ...mapGetters(['isAuthenticated', 'tokenInfo', 'registerPhone', 'screenWidth']),
    ...mapGetters(['registerPhone', 'screenWidth']),
    
    // getUserName() {
    //   if (Cookies.get('name')) {
    //     let name = Cookies.get('name')
    //     if (name.length) {
    //       return name[0].toUpperCase();
    //     }
    //   }
    //   return "";
    // },
    headerStyle() {
      const opacity = Math.min(0.15 + (this.scrollY / 300), 0.6);
      return {
        backgroundColor: `rgba(255, 255, 255, ${opacity})`, 
        transition: 'background-color 0.3s',
      };
    }
  },
  created () {
    // 获取用户信息
    try {
      if (this.isAuthenticated) {
        api.getUserInfo().then(res => {
          this.getUserName = res.username
          this.userInfo = res
        })
        api.getAccount().then(acc => {
          this.Account = acc
        })
      }
    } catch (error) {
      console.log(error);
    }
    

    this.fetchDicts()
  },
  mounted () {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    ...mapActions(["removeToken"]),
    // 获取状态
    async fetchDicts () {
      try {
        const promises = this.requiredDictTypes.map(async (dictType) => {
          const result = await api.queryDictData( dictType);
          return { dictType, result };
        });
        const results = await Promise.all(promises)
        results.forEach((item) => {
        if (item.result) {
          this.allDicts[item.dictType] = item.result;
        } else {
          console.error(`No data found for dictType: ${item.dictType}`);
        }
      });
      } catch (error) {
        
      }
    },

    // 类型显示
    dictMate (type, val) {
      const dict = this.allDicts[type] || [];
      const match = dict.find((item) => item.dictValue == val);
      return match ? match.dictLabel : "";
    },
    
    // 用户名称显示大写首字母
    capitalizeFirstLetter (str) {
      if (str.length === 0) {
        return "";
      }
      var firstLetter = str.charAt(0).toUpperCase();
      return firstLetter;
    },

    // 向下滚动 头部背景色变化
    handleScroll () {
      this.scrollY = window.scrollY
      // let scrollTop =
      //   window.pageYOffset ||
      //   document.documentElement.scrollTop ||
      //   document.body.scrollTop;
      // //设置背景颜色的透明度
      // if (scrollTop) {
      //   console.log('scrollTop', scrollTop)
      //   this.style.marginTop = 0
      //   this.style.backgroundColor = `rgba(0, 0, 0,${scrollTop / (scrollTop + 80)})`;
      //   console.log('backgroundColor', this.style.backgroundColor);
        
      //   this.color = true;
      // } else if (scrollTop == 0) {
      //   this.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
      //   this.style.marginTop = "";
      //   this.color = false;
      // }
    },
    // 跳转
    handleToPath(url) {
      try {
        let to_path = this.$config.pageUrlPro + url;
        if (url === '/user/register') {
          if (this.registerPhone) {
            to_path += `?phone=${this.registerPhone}`
          }
        }
        let open_window = window.open(to_path, '_blank');
        open_window.onload = function() {
          login_html.postMessage('官网发出的消息', url);
        };
      } catch (error) {
        console.log(error)
      }
    },
    // 跳转帮助
    handleToHelp() {
      window.open("https://spacehpc.feishu.cn/wiki/VB20w8aD6iwY4MkXG50cH6wnnqg", "_blank");
    },
    // 退出
    handleExit() {
      this.removeToken();
      Cookies.remove("token", { domain: '.lyxhai.com', path: '/' })
      Cookies.remove("name", { domain: '.lyxhai.com', path: '/' })
      Cookies.remove("tokenHead", { domain: '.lyxhai.com', path: '/' })
      Cookies.remove('tokenInfo', { domain: '.lyxhai.com', path: '/' })
      sessionStorage.clear()
      location.reload(true);
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  watch:{
    screenWidth(val) {
      // this.screenWidth = val
      // if (this.screenWidth > 768) {
      //   this.minDrawer = false
      // }
    }
  }
}
</script>
<style lang="scss">
.el-popover.uesr-info {
  background: #1D222A;
  border-radius: 10px;
  border: none;
  padding: 25px 15px;
  box-shadow: 0px 3px 6px -1px rgba(0,0,0,0.48), 0px 6px 16px 2px rgba(0,0,0,0.32), 0px 9px 28px 8px rgba(0,0,0,0.2);
  .popper__arrow {
    display: none;
  }
}
.uesr-info-box {
  .info-top {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #26303E;
  }
  .user-btn {
    overflow: hidden;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
  .uesr-info-username {
    display: inline-block;
    width: 117px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    font-weight: 700;
    font-family: Source Han Sans-Bold;
    margin-right: 10px;
  }
  .info {
    font-size: 12px;
    line-height: 18px;
    margin-left: 15px;
  }
  .usertype {
    .typeitem {
      padding: 0 6px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
      font-family: Source Han Sans-Medium;
      // background-color: #26303E;
      border-radius: 8px;
    }
  }
  .uesr-info-phone {
    font-weight: 700;
    font-size: 12px;
    color: rgba(255,255,255,0.45);
    line-height: 18px;
  }
  .info-content {
    padding: 10px;
    background: #0B1320;
    box-shadow: 0px 1px 2px -1px rgba(0,0,0,0.64), 0px 3px 6px 0px rgba(0,0,0,0.48), 0px 5px 12px 1px rgba(0,0,0,0.36);
    border-radius: 8px;
    margin-bottom: 16px;
  }
  .balance {
    flex: 1;
    box-sizing: border-box;
    &.left {
      border-right: 1px solid #26303E;
      padding-right: 10px;
      margin-right: 10px;
    }
    .balance-top {
      font-weight: 400;
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      line-height: 17px;
      .balance-link {
        color: #2696FF;
        &:hover {
          color: #56b7ed;
        }
      }
    }
    
    .balance-num {
      font-size: 18px;
      color: #FFFFFF;
      line-height: 26px;
      &:hover {
        color: #56b7ed;
      }
    }
    .balance-symbol {
      font-size: 12px; 
      padding-left: 2px; 
      color: rgba(255,255,255,0.6);
      &:hover {
        color: #56b7ed;
      }
    }
  }
  .info-bottom {
    padding: 5px 14px;
    font-size: 14px;
    font-weight: 700;
    font-family: Source Han Sans-Bold;
    color: rgba(255,255,255,0.85);
    line-height: 20px;
    &:hover {
      background-color: #3070e1;
      border-radius: 8px;
    }
    .exit-icon {
      width: 14px;
      height: 14px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
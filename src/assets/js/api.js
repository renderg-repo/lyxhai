import axios from 'axios'
import store from '../../store/index'
import config from "../js/config";
import Cookies from 'js-cookie';
// 服务器
var url = config.basicUrl + '/api/console';
// axios 配置
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = url
if (Cookies.get('tokenInfo')) {
  const tokenInfo = JSON.parse(Cookies.get('tokenInfo'))
  console.log('tokenInfo', tokenInfo)
  var token = tokenInfo.token
  var tokenHead = tokenInfo.tokenHead
  // var refreshToken = tokenInfo.refreshToken
  var isAuthenticated = true
  sessionStorage.setItem('isAuthenticated', isAuthenticated)
  sessionStorage.setItem('token', token);
}


export function Query (method, url, params) {
  // 携带token
  if (token && tokenHead) {
    axios.defaults.headers.common['Authorization'] = tokenHead + token
  } 
  // else {
  //   let isAuthenticated = store.getters.isAuthenticated;
  //   if (isAuthenticated) {
  //     axios.defaults.headers.common['Authorization'] = store.getters.tokenInfo.tokenHead + store.getters.tokenInfo.token
  //   }
  // }
  return new Promise((resolve, reject) => {
    axios[method](url, params)
      .then(response => {
        // response.data.code = 401;
        // console.log(response);
        if (response.status === 200) {
          if (response.data.code === 200) {
            resolve(response.data.data);
          } else if (response.data.code === 401) {
            // 移除token
            Cookies.remove("token", { domain: '.spacehpc.com', path: '/' })
            Cookies.remove("name", { domain: '.spacehpc.com', path: '/' })
            Cookies.remove("tokenHead", { domain: '.spacehpc.com', path: '/' })
            Cookies.remove('tokenInfo', { domain: '.spacehpc.com', path: '/' })
            store.dispatch("removeToken");
            sessionStorage.clear()
            reject("请登录后查看")
          } else {
            reject(response.data.message);
          }
        } else {
          reject("服务器异常");
        }
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error);
      })
  })
}

export default {

  // 获取user信息
  getUserInfo () {
    return Query('get', `/user/basicInfo`)
  },
  // 获取状态
  queryDictData(params) {
    return Query('get', `/sysDictData/queryDictData?type=${params}`)
  },
  // 获取账户信息
  getAccount () {
    return Query('get', `/account/getAccount`)
  },
  /**
   * 首页-获取GPU配置
   * @returns
   */
  getGpuConfig () {
    return Query('get', `/v2/VmGPU/listVmConfigUnit`)
  },

  /**
   * 新闻-查询新闻类型
   * @returns
   */
  getNewsType() {
    return Query('get', '/v2/news/listNewsType')
  },

  /**
   * 新闻-查询新闻列表
   * @param { pageNum, pageSize, title, type } params
   *  pageNum 页码
   *  pageSize 数量
   *  title 新闻标题
   *  type 类型 ""全部；0 星海动态；1 行业资讯 2作品赏析
   * @returns
   */
  getNewsList (params) {
    return Query('post', '/v2/news/listPage', params);
  },

  /**
   * 获取我的镜像列表
   * @param {imgLabels, imgName} params
   * imgLabels array[string]镜像标签
   * imgName sting 镜像名称
   * @returns
   */
  getMyMirrorList (params) {
    return Query('get', `/v2/image/listMyImage?${params}`)
  },
  /**
   * 获取我的镜像标签
   * @returns
   */
  getMyMirrorTagList () {
    return Query('get', `/v2/image/getMyImgLabels`)
  },

  /**
   * 获取镜像列表
   * @param {imgType} params
   * imgType 镜像类型(0:基础镜像, 1:镜像市场)
   * imgLabels array[string]镜像标签
   * imgName sting 镜像名称
   * @returns
   */
  getMirrorList (params) {
    return Query('get', `/v2/image/listByImgLabels?${params}`)
  },
  /**
   * 获取全部镜像标签
   * @param {imgType} params
   * imgType 镜像类型(0:基础镜像, 1:镜像市场)
   * @returns
   */
  getMirrorTags (params) {
    return Query('get', `/v2/image/getImgLabels?${params}`)
  },

  /**
   * 最近15天上线镜像数量
   * @returns
   */
  getMirrorCount () {
    return Query('get', `/v2/image/getNewImgCount`)
  },

  /**
   * 获取最近使用镜像列表
   * @param {imgLabels, imgName} params
   * imgLabels array[string]镜像标签
   * imgName sting 镜像名称
   * @returns
   */
  getRecentUseMirrorList (params) {
    return Query('get', `/v2/image/listImgRecord?${params}`)
  },
  /**
   * 获取最近使用镜像便签
   * @returns
   */
  getRecentUseMirrorTagList () {
    return Query('get', `/v2/image/listLabelsRecord`)
  },
}

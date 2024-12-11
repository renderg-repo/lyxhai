import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tokenInfo: null,
    registerPhone: null,
    screenWidth: 0,
  },
  mutations: {
    SET_TOKEN_INFO(state, tokenInfo) {
      state.tokenInfo = tokenInfo;
    },
    REMOVE_TOKEN_INFO(state) {
      state.tokenInfo = null;
    },
    SET_REGISTER_PHONE(state, phone) {
      state.registerPhone = phone;
    },
    SET_SCREEN_WIDTH(state, screenWidth) {
      state.screenWidth = screenWidth;
    },
  },
  actions: {
    setTokenInfo({ commit }, tokenInfo) {
      commit('SET_TOKEN_INFO', tokenInfo);
      localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
    },
    removeToken({ commit }) {
      commit('REMOVE_TOKEN_INFO');
      localStorage.removeItem('tokenInfo');
    },
    setRegisterPhone({ commit }, phone) {
      commit('SET_REGISTER_PHONE', phone);
    },
    setScreenWidth({ commit }, screenWidth) {
      commit('SET_SCREEN_WIDTH', screenWidth);
    }
  },
  getters: {
    isAuthenticated(state) {
      // TODO 登录状态需完善 token过期后处理逻辑
      if (state.tokenInfo || localStorage.getItem('tokenInfo')) {
        return true;
      } else {
        return false;
      }
    },
    tokenInfo(state) {
      return state.tokenInfo || JSON.parse(localStorage.getItem('tokenInfo'));
    },
    registerPhone(state) {
      return state.registerPhone;
    },
    screenWidth(state) {
      return state.screenWidth;
    }
  },
  modules: {
  }
})

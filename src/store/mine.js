import { dialogEmits } from "element-plus";
import { defineStore } from "pinia";

export const useMineStore = defineStore({
  id: "mine",
  state: () => {
    return {
      token: "",
      tokenInfo: {},
      userInfo: {},
      guideFlag: true,
      zoneName: '',
      downloadProgress: {},
      downloadSeed: {},
      activeName: "online", // 新增的 activeName 状态
      userAccount: { creditAmount: 0, currentCouponsAmount: 0 },
      verifyType: "",
      accountType: "",
      dialogytype: "",
    };
  },
  // 进行缓存
  persist: {
    key: "mine",
    storage: window.localStorage,
    paths: ["token", "tokenInfo", "userInfo", "guideFlag"],
  },
  getters: {},
  actions: {
    updateDownloadProgress(filePath, progress) {
      this.downloadProgress[filePath] = progress;
    },
    updateDownloadSeed(filePath, seed) {
      this.downloadSeed[filePath] = seed;
    },
    setActiveName(name) {
      // console.log('name', name)
      this.activeName = name;
      // console.log("Store activeName updated:", this.activeName);
    },

    handleTabClick(tab) {
      // console.log(tab, "22");
      this.setActiveName(tab.paneName || tab.name);
    },
  },
});

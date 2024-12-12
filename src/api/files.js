import request from "@/utils/request/request";
let zoneName = "";
// 定义 NetdiskApi 的默认值
let NetdiskApi = {
  get baseURL() {
    if (!zoneName) {
      throw new Error("11111zoneName is not initialized");
    }
    return `https://pan.${zoneName}.spacehpc.com:6002/file/`;
  },
  get storage() {
    return `${this.baseURL}info`;
  },
  get resources() {
    return `${this.baseURL}resources`;
  },
  get preview() {
    return `${this.baseURL}image`;
  },
  get download() {
    return `${this.baseURL}download`;
  },
  get delResources() {
    return `${this.baseURL}delResources`;
  },
  listStorage: "console/v2/storage/listStorage", // 查询网盘用户可见区域
  initStorageAccount: "console/v2/storage/initStorageAccount",
};

export async function setZone(name) {
  console.log('name', name)
  zoneName = await name;
  updateNetdiskApi();
}

function updateNetdiskApi() {
  NetdiskApi = {
    get baseURL() {
      if (!zoneName) {
        throw new Error("22222zoneName is not initialized");
      }
      return `https://pan.${zoneName}.spacehpc.com:6002/file/`; // 根据 zoneCode 动态生成 baseURL
    },
    get storage() {
      return `${this.baseURL}info`;
    },
    get resources() {
      return `${this.baseURL}resources`;
    },
    get preview() {
      return `${this.baseURL}image`;
    },
    get download() {
      return `${this.baseURL}download`;
    },
    get delResources() {
      return `${this.baseURL}delResources`;
    },
    listStorage: "console/v2/storage/listStorage",
    initStorageAccount:'console/v2/storage/initStorageAccount',
  };
}




// 获取zone
export function Zone(params) {
  return request.get({
    url: NetdiskApi.zone,
    params,
  });
}
export function listStorage(params) {
  return request.get({
    url: NetdiskApi.listStorage,
    params,
  });
}

// 获取 storage
export function storage(params) {
  return request.get({
    url: NetdiskApi.storage,
    params,
  });
}
// 获取文件目录
export function getResource(params) {
  return request.get({
    url: NetdiskApi.resources,
    params,
  });
}
// 创建文件
export function postResource(params) {
  return request.post({
    url: NetdiskApi.resources,
    params,
  });
}
// 重命名, 复制，移动
export function patchResource(params) {
  return request.patch({
    url: NetdiskApi.resources,
    params,
  });
}
// 删除
export function deleteResource(params) {
  return request.delete({
    url: NetdiskApi.delResources,
    params,
  });
}
// 批量删除
export function batchDel(data) {
  return request.delete({
    url: NetdiskApi.delResources,
    data,
  });
}
// 编辑文件
export function putResource(params, data) {
  return request.put({
    url: NetdiskApi.resources,
    params,
    data,
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}
// 图片预览
export function getPreview(params) {
  return request.get({
    url: NetdiskApi.preview,
    params,
  });
}
// 下载
export function download(params) {
  return request.get({
    url: NetdiskApi.download,
    params,
    responseType: "arraybuffer",
  });
}
// 初始化存储账号
export function initStorageAccount(data) {
  return request.post({
    url: NetdiskApi.initStorageAccount,
    data,
  });
}
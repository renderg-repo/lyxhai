import request from "@/utils/request/request";

const hostsApi = {
  getConfigs: `console/v2/vm/getVmConfigUnit`,
  getImages: `console/v2/image/getImages`,
  getList: `console/v2/vm/list`,
  createVm: `console/v2/vm/vmCreate`,
  del: `console/v2/vm/destroy`,
  clone: `console/v2/vm/clone`,
  change: `console/vm/change`,
  operate: `console/v2/vm/changeStatus`,
  status: `console/vm/status`,
  hostName: `console/v2/vm/editVmName`,
  zoneAll: `console/v2/zone/listAll`,
  zoneAllEnabled: `/console/zone/listName`, // 查询所有区域名称
  zones: `console/v2/zone/list`, // 查询用户可见区域
  noGpuStart: `console/v2/vm/noGpuStart`,
  setShutdownAt: `console/v2/vm/setShutdownAt`,
  getUnitById: `console/v2/vm/getUnitById`,
  vminfo: `console/v2/vm/getVm`,
  vmStoragePrice: `console/productUnitPrice/listByProject`,
  vmDiskPrice: `/console/v2/vm/getDiskConfig`,
  updateDisk: `console/v2/vm/updateDisk`,
  imageMarket: "console/v2/image/imageMarket",
  saveImage: "console/v2/uImage/export",
  imageUser: "console/v2/uImage/list",
  canalShutdownAt: "console/v2/vm/canalShutdownAt",
  getRefundInfo: "console/v2/charge/getRefundInfo",
  getNewPrice: "console/vm/getNewPrice",
  changeChargeType: "console/v2/vm/changeChargeType",
  vmConfigChange: "console/v2/vm/vmConfigChange",
  expireUnit: "console/v2/vm/expireUnit",
  renew: "console/v2/vm/renew",
  match: "console/discountCoupon/match",
  calculate: "console/discountCoupon/calculate",
  vmChargeCreateView: "console/v2/charge/vmChargeCreateView",
  netForwardlist: "/console/v2/vm/portForwardList",
  getgpulist: "console/v2/vm/getConfigs",
  getexistOldVm: "console/vm/existOldVm",
  getImgLabels: "/console/v2/image/getImgLabels",
};

export function configs(params) {
  return request.getv2({
    url: hostsApi.getgpulist,
    params,
  });
}

export function images(params) {
  return request.get({
    url: hostsApi.getImages,
    params,
  });
}

export function list(params) {
  return request.get({
    url: hostsApi.getList,
    params,
  });
}

export function create(data) {
  return request.postv2({
    url: hostsApi.createVm,
    data,
  });
}
export function renew(data) {
  return request.post({
    url: hostsApi.renew,
    data,
  });
}

export function del(data) {
  return request.deletev2({
    url: hostsApi.del,
    data,
  });
}

export function clone(data) {
  return request.post({
    url: hostsApi.clone,
    data,
  });
}

export function change(data) {
  return request.post({
    url: hostsApi.change,
    data,
  });
}

export function operate(data) {
  return request.postv2({
    url: hostsApi.operate,
    data,
  });
}

export function status(params) {
  return request.get({
    url: hostsApi.status,
    params,
  });
}

export function hostName(data) {
  return request.postv2({
    url: hostsApi.hostName,
    data,
  });
}
export function zoneAll(params) {
  return request.get({
    url: hostsApi.zoneAll,
    params,
  });
}
export function zoneAllEnabled(params) {
  return request.get({
    url: hostsApi.zoneAllEnabled,
    params,
  });
}
export function zones(params) {
  return request.get({
    url: hostsApi.zones,
    params,
  });
}
export function noGpuStart(data) {
  return request.post({
    url: hostsApi.noGpuStart,
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
export function setShutdownAt(data) {
  return request.post({
    url: hostsApi.setShutdownAt,
    data,
  });
}
export function getUnitById(params) {
  return request.get({
    url: hostsApi.getUnitById,
    params,
  });
}
export function vminfo(params) {
  return request.getv2({
    url: hostsApi.vminfo,
    params,
  });
}
export function vmStoragePrice(params) {
  return request.get({
    url: hostsApi.vmStoragePrice,
    params,
  });
}
export function vmDiskPrice(params) {
  return request.get({
    url: hostsApi.vmDiskPrice,
    params,
  });
}
export function updateDisk(data) {
  return request.postv2({
    url: hostsApi.updateDisk,
    data,
  });
}
export function imageMarket(params) {
  return request.get({
    url: hostsApi.imageMarket,
    params,
  });
}
export function saveImage(data) {
  return request.post({
    url: hostsApi.saveImage,
    data,
  });
}
export function imageUser(params) {
  return request.get({
    url: hostsApi.imageUser,
    params,
  });
}
export function canalShutdownAt(data) {
  return request.post({
    url: hostsApi.canalShutdownAt,
    data,
  });
}

export function getRefundInfo(params) {
  return request.get({
    url: hostsApi.getRefundInfo,
    params,
  });
}
export function getNewPrice(params) {
  return request.get({
    url: hostsApi.getNewPrice,
    params,
  });
}
export function changeChargeType(data) {
  return request.post({
    url: hostsApi.changeChargeType,
    data,
  });
}
export function vmConfigChange(data) {
  return request.post({
    url: hostsApi.vmConfigChange,
    data,
  });
}
export function expireUnit(data) {
  return request.post({
    url: hostsApi.expireUnit,
    data,
  });
}
export function matchcouponslist(data) {
  return request.post({
    url: hostsApi.match,
    data,
  });
}
export function calculate(data) {
  return request.post({
    url: hostsApi.calculate,
    data,
  });
}
export function vmChargeCreateView(data) {
  return request.post({
    url: hostsApi.vmChargeCreateView,
    data,
  });
}
//端口转发列表
export function netForwardlist(params) {
  return request.get({
    url: hostsApi.netForwardlist,
    params,
  });
}

export function getexistOldVm(params) {
  return request.get({
    url: hostsApi.getexistOldVm,
    params,
  });
}
export function getImgLabels(params) {
  return request.get({
    url: hostsApi.getImgLabels,
    params,
  });
}
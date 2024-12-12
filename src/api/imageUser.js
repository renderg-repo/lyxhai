import request from "@/utils/request/request";
const imageApi = {
  getList: "/console/v2/uImage/myImages",
  changeImgName: "/console/v2/uImage/updateImageName",
  delImage: "/console/v2/uImage",
  imgStorageInfo: "/console/v2/uImage/getImgStorageInfo",
  getPanSize: "/console/storage/getPanSize",
  postShare: "/console/v2/uImage/batchShare", // 批量镜像分享
  getShareList: "/console/v2/uImage/sharedList", // 镜像已分享列表
  deleteShare: "/console/v2/uImage/unShare", // 取消分享
  removeShare: "/console/v2/uImage/removeShared", // 移除已分享人
  acceptShare: "/console/v2/uImage/acceptSharing", // 接收分享
  shareSwitch: "/console/v2/uImage/shareSwitch", // 分享开关
  syncingInfos: "/console/v2/uImage/syncingInfos", // 跨区同步列表
  postSync: "/console/v2/uImage/sync", // 跨区同步
  delImageForZone: "/console/v2/uImage/delImageForZone", // 跨区同步
};
export function list(params) {
  return request.get({
    url: imageApi.getList,
    params,
  });
}
export function changeImgName(data) {
  return request.put({
    url: imageApi.changeImgName,
    data,
  });
}
export function delImage(params) {
  return request.delete({
    url: imageApi.delImage,
    params,
  });
}
export function imgStorageInfo(params) {
  return request.get({
    url: imageApi.imgStorageInfo,
    params,
  });
}
export function getPanSize(params) {
  return request.get({
    url: imageApi.getPanSize,
    params,
  });
}
export function postShare(data) {
  return request.post({
    url: imageApi.postShare,
    data,
  });
}
export function getShareList(params) {
  return request.get({
    url: imageApi.getShareList,
    params,
  });
}
export function deleteShare(params) {
  return request.delete({
    url: imageApi.deleteShare,
    params,
  });
}
export function removeShare(params) {
  return request.delete({
    url: imageApi.removeShare,
    params,
  });
}
export function acceptShare(data) {
  return request.put({
    url: imageApi.acceptShare,
    data,
  });
}
export function SwitchShare(params) {
  return request.put({
    url: imageApi.shareSwitch,
    params,
  });
}
export function SyncingInfos(params) {
  return request.get({
    url: imageApi.syncingInfos,
    params,
  });
}
export function postSync(data) {
  return request.post({
    url: imageApi.postSync,
    data,
  });
}
export function delImageForZone(params) {
  return request.delete({
    url: imageApi.delImageForZone,
    params
  });
}
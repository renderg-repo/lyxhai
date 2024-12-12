import request from "@/utils/request/request";

const dashboardApi = {
  setAutoDeleteNotify: "/console/consolePanel/setAutoDeleteNotify",
  setBalanceAlarmSw: "/console/consolePanel/setBalanceAlarmSw",
  getNotifyConfig: "/console/consolePanel/getNotifyConfig",
  setAlarmAmount: "/console/consolePanel/setAlarmAmount",
  getVmCount: "/console/v2/consolePanel/getVmCount",
  storageInfo: "/console/v2/consolePanel/storageInfo",
  msgRecord: "/console/msgRecord/list",
  getPartakeCouponInfo: "/console/consolePanel/getPartakeCouponInfo",
};
//到期删除通知开关
export function setAutoDeleteNotify(params) {
  return request.get({
    url: dashboardApi.setAutoDeleteNotify,
    params,
  });
}
//余额预警通知开关
export function setBalanceAlarmSw(params) {
  return request.get({
    url: dashboardApi.setBalanceAlarmSw,
    params,
  });
}
//获取用户通知配置信息
export function getNotifyConfig(params) {
  return request.get({
    url: dashboardApi.getNotifyConfig,
    params,
  });
}
//设置预警额度
export function setAlarmAmount(params) {
  return request.get({
    url: dashboardApi.setAlarmAmount,
    params,
  });
}
//获取实例数量信息
export function getVmCount(params) {
  return request.get({
    url: dashboardApi.getVmCount,
    params,
  });
}
//获取存储信息
export function storageInfo(params) {
  return request.get({
    url: dashboardApi.storageInfo,
    params,
  });
}
export function msgRecord(params) {
  return request.get({
    url: dashboardApi.msgRecord,
    params,
  });
}

export function getPartakeCouponInfo(params) {
  return request.get({
    url: dashboardApi.getPartakeCouponInfo,
    params,
  });
}

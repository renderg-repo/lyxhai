import request from "@/utils/request/request";

const RechargeApi = {
  getAccount: `console/account/getAccount`,
  recharge: `console/account/createRecharge`,
  aliPayNotify: `console/account/aliPayNotify`,
  rechargeList: `console/account/rechargeList`,
  rechargeStatus: `console/account/rechargeStatus`,
  remitBank: `console/remitBank/remitBank`,
  sendRemitBank: `console/remitBank/sendRemitBank`,
  orders: `console/orders/list`,
  export: `console/bills/export`,
  tasks: `console/jobs/list`,
  activateCoupon: "console/coupons/activateCoupon",
  listByUser: "console/coupons/listByUser",
  orderList: "console/orders/list",
  billList: "console/bills/billList",
  getOrderInfo: `console/orders/getOrderInfo`,
  listRecord: "console/userInvite/listRecord",
  couponslist: `console/discountCoupon/list`,  // 优惠券列表
 
};

export function getAccount(params) {
  return request.get({
    url: RechargeApi.getAccount,
    params,
  });
}
export function getOrderInfo(params) {
  return request.get({
    url: RechargeApi.getOrderInfo,
    params,
  });
}
export function recharge(data) {
  return request.post({
    url: RechargeApi.recharge,
    data,
  });
}
export function aliPayNotify(data) {
  return request.post({
    url: RechargeApi.aliPayNotify,
    data,
  });
}
export function rechargeList(data) {
  return request.post({
    url: RechargeApi.rechargeList,
    data,
  });
}
export function rechargeStatus(params) {
  return request.get({
    url: RechargeApi.rechargeStatus,
    params,
  });
}
export function remitBank(params) {
  return request.get({
    url: RechargeApi.remitBank,
    params,
  });
}
export function sendRemitBank(data) {
  return request.post({
    url: RechargeApi.sendRemitBank,
    data,
  });
}
export function orders(data) {
  return request.post({
    url: RechargeApi.orders,
    data,
  });
}
export function exportOrders(params) {
  return request.get({
    url: RechargeApi.export,
    responseType: "blob",
    params,
  });
}
export function tasks(data) {
  return request.post({
    url: RechargeApi.tasks,
    data,
  });
}
export function activateCoupon(data) {
  return request.post({
    url: RechargeApi.activateCoupon,
    data,
  });
}
export function listByUser(data) {
  return request.post({
    url: RechargeApi.listByUser,
    data,
  });
}

export function getorderList(data) {
  return request.post({
    url: RechargeApi.orderList,
    data,
  });
}

export function getbillList(data) {
  return request.post({
    url: RechargeApi.billList,
    data,
  });
}
export function listRecord(params) {
  return request.get({
    url: RechargeApi.listRecord,
    params,
  });
}

export function couponslist(params) {
  return request.get({
    url: RechargeApi.couponslist,
    params,
  });
}
import request from "@/utils/request/request";

const LoginApi = {
  queryPhone: `console/login/queryPhone`,
  queryUsername: `console/login/queryUsername`,
  sendCode: `console/login/sendCode`,
  register: `console/login/register`,
  initPassword: `console/login/initPassword`,
  token: `console/login/token`,
  refresh_token: `console/login/refresh_token`,
  basicInfo: `console/user/basicInfo`,
  phone: `console/login/phone`,
  checkCode: `console/login/checkCode`,
  forgetPassword: `console/login/forgetPassword`,
  bind: `console/user/bind`,
  getQrCode: `console/weixin/getQrCode`,
  checkQrCode: `console/weixin/checkQrCode`,
  wechatLogin: `console/login/wechatLogin`,
  getVerifyInfo: `console/userVerify/getVerifyInfo`, // 获取认证信息
  personal: `console/userVerify/personal`, // 个人认证
  personalVerify: `console/userVerify/personalVerify`, // 个人认证新
  personalEnd: "console/userVerify/personalEnd",
  reVerify: `console/userVerify/reVerify`, // 重新认证
  withdraw: `console/userVerify/withdrawV2`, // 提现
  checkInviteCode: "/console/userInvite/checkInviteCode", //检查邀请码
  enterprise: `console/userVerify/enterprise`, // 企业认证
  enterpriseReVerify: `console/userVerify/enterpriseReVerify`, // 企业重新认证
  getAuthLetterPath: `console/userVerify/getAuthLetterPath`, // 获取认证函路径
  PersonalReVerify: "console/userVerify/PersonalReVerify", //新重新个人认证
};

export function queryPhone(params) {
  return request.get({
    url: LoginApi.queryPhone,
    params,
  });
}
export function queryUsername(params) {
  return request.get({
    url: LoginApi.queryUsername,
    params,
  });
}
export function sendCode(data) {
  return request.post({
    url: LoginApi.sendCode,
    data,
  });
}
export function register(data, config = {}) {
  return request.post({
    url: LoginApi.register,
    data,
    ...config,
  });
}

export function initPassword(data) {
  return request.post({
    url: LoginApi.initPassword,
    data,
  });
}
export function token(data) {
  return request.post({
    url: LoginApi.token,
    data,
  });
}
export function refresh_token(data) {
  return request.post({
    url: LoginApi.refresh_token,
    data,
  });
}
export function basicInfo(params) {
  return request.get({
    url: LoginApi.basicInfo,
    params,
  });
}
export function phone(data) {
  return request.post({
    url: LoginApi.phone,
    data,
  });
}
export function checkCode(data) {
  return request.post({
    url: LoginApi.checkCode,
    data,
  });
}
export function forgetPassword(data) {
  return request.post({
    url: LoginApi.forgetPassword,
    data,
  });
}
export function bind(data) {
  return request.post({
    url: LoginApi.bind,
    data,
  });
}
export function getQrCode(params) {
  return request.get({
    url: LoginApi.getQrCode,
    params,
  });
}
export function checkQrCode(data) {
  return request.post({
    url: LoginApi.checkQrCode,
    data,
  });
}
export function wechatLogin(data) {
  return request.post({
    url: LoginApi.wechatLogin,
    data,
  });
}
export function getVerifyInfo(params) {
  return request.get({
    url: LoginApi.getVerifyInfo,
    params,
  });
}
export function personal(data) {
  return request.post({
    url: LoginApi.personal,
    data,
  });
}
export function personalVerify(data) {
  return request.post({
    url: LoginApi.personalVerify,
    data,
  });
}
export function personalEnd(params, isEnd) {
  return request.post({
    url: LoginApi.personalEnd + "?certifyNo=" + params + "&isEnd=" + isEnd,
  });
}
export function reVerify(data) {
  return request.post({
    url: LoginApi.reVerify,
    data,
  });
}
export function PersonalReVerify(data) {
  return request.post({
    url: LoginApi.PersonalReVerify,
    data,
  });
}
export function withdraw(data) {
  return request.post({
    url: LoginApi.withdraw,
    data,
  });
}
export function checkInviteCode(params) {
  return request.get({
    url: LoginApi.checkInviteCode,
    params,
  });
}
export function enterprise(data) {
  return request.post({
    url: LoginApi.enterprise,
    data,
  });
}
export function enterpriseReVerify(data) {
  return request.post({
    url: LoginApi.enterpriseReVerify,
    data,
  });
}
export function getAuthLetterPath(params) {
  return request.get({
    url: LoginApi.getAuthLetterPath,
    params,
  });
}

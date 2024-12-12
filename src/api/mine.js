import request from "@/utils/request/request";

const UserApi = {
  updateUserName: `console/user/updateUserName`,
  updateBasicInfo: `console/user/updateBasicInfo`,
  updatePassword: `console/user/updatePassword`,
  bindPhone: `console/user/bindPhone`,
  changePhone: `console/user/changePhone`,
  sendEmailCode: `console/login/sendEmailCode`,
  bindEmail: `console/user/bindEmail`,
  unbindEmail: `console/user/unbindEmail`,
  getQrCode: `console/user/getQrCode`,
  unbindWeChat: `console/user/unbindWeChat`,
  sendCode: `console/login/sendCode`,
  sendCheckCode: `console/check/checkCode`,
  checkCode: `console/check/checkCode`,
  checkSendCode: `console/check/sendCode`,
  setPassword: "console/user/setPassword",
};

export function updateUserName(data) {
  return request.post({
    url: UserApi.updateUserName,
    data,
  });
}
export function updateBasicInfo(data) {
  return request.post({
    url: UserApi.updateBasicInfo,
    data,
  });
}
export function updatePassword(data) {
  return request.post({
    url: UserApi.updatePassword,
    data,
  });
}
export function bindPhone(data) {
  return request.post({
    url: UserApi.bindPhone,
    data,
  });
}
export function changePhone(data) {
  return request.post({
    url: UserApi.changePhone,
    data,
  });
}
export function sendEmailCode(data) {
  return request.post({
    url: UserApi.sendEmailCode,
    data,
  });
}
export function bindEmail(data) {
  return request.post({
    url: UserApi.bindEmail,
    data,
  });
}
export function unbindEmail(data) {
  return request.post({
    url: UserApi.unbindEmail,
    data,
  });
}
export function getQrCode(params) {
  return request.get({
    url: UserApi.getQrCode,
    params,
  });
}
export function unbindWeChat(data) {
  return request.post({
    url: UserApi.unbindWeChat,
    data,
  });
}

export function sendCode(data) {
  return request.post({
    url: UserApi.sendCode,
    data,
  });
}

export function sendCheckCode(data) {
  return request.post({
    url: UserApi.sendCheckCode,
    data,
  });
}
export function checkCode(data) {
  return request.post({
    url: UserApi.checkCode,
    data,
  });
}
export function checkSendCode(data) {
  return request.post({
    url: UserApi.checkSendCode,
    data,
  });
}
export function setPassword(data) {
  return request.post({
    url: UserApi.setPassword,
    data,
  });
}

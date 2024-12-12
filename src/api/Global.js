import request from "@/utils/request/request";
const dialogAPI = {
  dialogget: "/console/dialog/get",
};

export function getdialog(params) {
  return request.get({
    url: dialogAPI.dialogget,
    params,
  });
}

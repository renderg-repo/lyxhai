import request from "@/utils/request/request";

const SshApi = {
    getSshKey: `console/sshKey/user`,
    sshFile: `console/sshKey/sshFile`,
    sshSave: `console/sshKey/save`,
    sshList: `console/sshKey/list`,
    sshDel: `console/sshKey/del`,
    resetSshPassword: `console/sshKey/resetSshPassword`,
    enabled: `console/sshKey/enabled`,
};

export function getSshKey(params) {
    return request.get({
        url: SshApi.getSshKey,
        params,
    });
}
export function sshFile(params) {
    return request.get({
        url: SshApi.sshFile,
        params,
    });
}
export function sshSave(data) {
    return request.post({
        url: SshApi.sshSave,
        data,
    });
}
export function sshList(params) {
    return request.get({
        url: SshApi.sshList,
        params,
    });
}
export function sshDel(data) {
    return request.delete({
        url: SshApi.sshDel,
        data,
    });
}
export function resetSshPassword(data) {
    return request.post({
        url: SshApi.resetSshPassword,
        data,
    });
}
export function enabled(data) {
    return request.post({
        url: SshApi.enabled,
        data,
    });
}
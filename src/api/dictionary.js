import request from "@/utils/request/request";

const DicApi = {
    queryDictType: '/console/sysDictData/queryDictType',
    queryDictData: '/console/sysDictData/queryDictData',
}

export function queryDictType(params) {
    return request.get({
        url: DicApi.queryDictType,
        params,
    });
}
export function queryDictData(params) {
    return request.get({
        url: DicApi.queryDictData,
        params,
    });
}
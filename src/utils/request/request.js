import axios from "axios";
import { BASE_URL, TIME_OUT, BASE_URL2 } from "./config";
import { ElMessage } from "element-plus";
import { useMineStore } from "@/store/mine";
import router from "@/routers/routes";
import Cookies from "js-cookie";

const createService = (baseURL) => {
  const service = axios.create({
    baseURL, // 使用传入的 baseURL
    timeout: TIME_OUT,
  });
  const mineStore = useMineStore();
  service.interceptors.request.use(
    (config) => {
      if (mineStore.tokenInfo.token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${mineStore.tokenInfo.token}`,
        };
      }
      if (config.zoneURL) {
        config.baseURL = config.zoneURL;
      }
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
  // 变量isRefreshing
  let isRefreshing = false;
  // 后续的请求队列
  let requestList = [];

  service.interceptors.response.use(
    async (response) => {
      let res = response.data;
      if (
        res.code == "401" &&
        !response.config.url.includes("console/login/refresh_token") &&
        !response.config.url.includes("console/login/token")
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          let obj = {
            refreshToken: mineStore.tokenInfo.refreshToken,
          };
          axios({
            url: "/console/login/refresh_token",
            method: "post",
            data: obj,
            baseURL: BASE_URL,
            timeout: TIME_OUT,
          }).then((result) => {
            if (result && result.data) {
              if (!result.data.data) {
                localStorage.clear();
                isRefreshing = false;
                router.replace("/user/login");
              }

              let newToken = result.data.data.token;
              mineStore.tokenInfo = result.data.data;
              console.log('mineStore', mineStore.tokenInfo)
              // .spacehpc.com
              Cookies.set("tokenInfo", JSON.stringify(result.data.data), { domain: '.lyxhai.com', path: '/' })
              // Cookies.set("tokenHead", result.data.data.tokenHead, { domain: '.spacehpc.com', path: '/' });
              // Cookies.set("token", result.data.data.token, {
              //   expires: result.data.data.expiresIn * 1000,
              //   domain: '.spacehpc.com',
              //   path: '/'
              // });
              response.config.headers.Authorization = `Bearer ${mineStore.tokenInfo.token}`;

              requestList.forEach((cb) => cb(newToken));
              requestList = [];

              const resp = service.request(response.config);
              isRefreshing = false;
              return resp;
            } else {
              localStorage.clear();
              isRefreshing = false;
              router.replace("/user/login");
            }
          });
        } else {
          return new Promise((resolve) => {
            requestList.push((newToken) => {
              response.config.headers.token = newToken;
              resolve(service(response.config));
            });
          });
        }
      }
      if (
        res.code == "401" &&
        response.config.url.includes("console/login/refresh_token")
      ) {
        localStorage.clear();
        isRefreshing = false;
        router.replace("/user/login");
      }
      return res;
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );

  return service;
};

const service = createService(BASE_URL);
const service2 = createService(BASE_URL2); // 使用 BASE_URL2 创建新的 Axios 实例

export default {
  get: (options) => service({ ...options, method: "get" }),
  post: (options) => service({ ...options, method: "post" }),
  delete: (options) => service({ ...options, method: "delete" }),
  patch: (options) => service({ ...options, method: "patch" }),
  put: (options) => service({ ...options, method: "put" }),
  head: (options) => service({ ...options, method: "head" }),
  getv2: (options) => service2({ ...options, method: "get" }), // 使用 service2
  postv2: (options) => service2({ ...options, method: "post" }), // 使用 service2
  deletev2: (options) => service2({ ...options, method: "delete" }), // 使用 service2
};

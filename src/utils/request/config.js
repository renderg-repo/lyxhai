// Api地址
// const API_BASE_URL = "https://api.spacehpc.com/";
// 郭阔本地
// const API_BASE_URL = "http://192.168.30.166:8201/";
// const API_BASE_URL2 = "http://192.168.30.166:8201/";
//任金旺本地
// const API_BASE_URL = "http://192.168.30.116:8201/";
//正式环境
// const API_BASE_URL = " https://v.spacehpc.com/api/";
// const API_BASE_URL = "https://gpu.spacehpc.com/api/";
// const API_BASE_URL2 = "https://gpu.spacehpc.com/api/";
const API_BASE_URL = "http://api.test.sfbp.net/";
const API_BASE_URL2 = "http://api.test.sfbp.net/";

// http://192.168.30.166:8201/

// 超时时间
const TIME_OUT = 1 * 1000 * 60 * 5;

let BASE_URL = "";
let BASE_URL2 = "";

if (process.env.NODE_ENV === "production") {
  BASE_URL = API_BASE_URL + "";
  BASE_URL2 = API_BASE_URL2 + "";
} else if (process.env.NODE_ENV === "development") {
  BASE_URL = API_BASE_URL + "";
  BASE_URL2 = API_BASE_URL2 + "";
} else {
  BASE_URL = API_BASE_URL + "";
  BASE_URL2 = API_BASE_URL2 + "";
}

export { BASE_URL, TIME_OUT, BASE_URL2 };

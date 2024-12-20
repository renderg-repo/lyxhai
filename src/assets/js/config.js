let config = {
  env: "Pro",
  basicUrlDev: "http://192.168.30.180:3002",
  basicUrlTest: "https://gpu2.spacehpc.com",
  basicUrlPro: "https://gpu.spacehpc.com",
  pageUrlPro: "http://gpu.lyxhai.com"
}
config.basicUrl = config['basicUrl' + config.env]

export default config;

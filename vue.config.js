// const PrerenderSPAPlugin = require('prerender-spa-plugin');
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path');
module.exports = {
  lintOnSave: false,
  // baseUrl : './',
  publicPath: process.env.NODE_ENV === 'production' ? "././" : "./",
  chainWebpack:config => {
    config
    .module
    .rule("images")
    .test(/\.(jpg|png|gif)$/)
    .use("url-loader")
    .loader("url-loader")
    .options({
      limit:10,
      publicPath: process.env.NODE_ENV === 'production' ? 'https://cdn.spacehpc.com/img/' : "img/" ,
      outputPath: 'img',
      name: '[name].[ext]',
    })
    .end();
  },
//   build: {
//     env: require('./prod.env'),
//     index: path.resolve(__dirname, '../dist/index.html'),
//     assetsRoot: path.resolve(__dirname, '../dist'),
//     assetsSubDirectory: 'static',
//     assetsPublicPath: '/',     // hash 模式会默认的在此处 添加为 assetsPublicPath: './'
//     productionSourceMap: true,
//   },
 configureWebpack: config => {
  if (process.env.NODE_ENV !== 'production') return;
  return {
   plugins: [
    // new PrerenderSPAPlugin({
    // //staticDir: path.join(__dirname, process.env.VUE_APP_OUTPUT_DIR),如果直接用path 可能会报错 不要问为什么我要特意备注一下
    //  staticDir: path.join(__dirname,'dist'),
    // //  routes: ['/First', '/Abutton','/last','/tahoe','/home','/NewsDetail'],
    //  renderer: new Renderer({
    //   // inject: {
    //   //  foo: 'bar'
    //   // },
    //   headless: false,
    //   // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
    //   renderAfterDocumentEvent: 'render-event'
    //  })
    // }),
   ],
  };
 }
}
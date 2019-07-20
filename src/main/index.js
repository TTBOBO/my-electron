import Base from './Base'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}
let base = new Base({
  baseUrl: getUrl(),
  musicUrl: getUrl('lyric')
})
base.initApp(() => {
  // 初始化成功回调
})


function getUrl (path) {
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:9080#/` + (path || '')
    : `file://${__dirname}/index.html/` + (path || '')
}

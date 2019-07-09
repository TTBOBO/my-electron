import Base from './Base';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}
const winURL =
  process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`
let downloadItems = {};
let mainWindow;
let base = new Base({
  baseUrl: winURL
});
base.initApp(() => {
  mainWindow = base.mainWindow;
});
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import {
  ajaxGet,
  ajaxPost
} from './api/axios'
import 'element-ui/lib/theme-chalk/index.css'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$ajaxGet = ajaxGet;
Vue.prototype.$ajaxPost = ajaxPost;
Vue.prototype.$Loading = ElementUI.Loading;
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
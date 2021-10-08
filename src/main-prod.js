import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/index.js'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// import treeTable from 'vue-table-with-tree-grid'
//markdown解析
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import marked from 'marked'

import lodash from 'lodash'

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1/'
/* axios.defaults.baseURL = 'http://127.0.0.1:8080/' */
/* axios.defaults.baseURL = 'https://1.116.138.153:8888/api/private/v1/' */

Vue.prototype.$http = axios
//使用
Vue.use(mavonEditor)

Vue.use(lodash)
//禁止提示
Vue.config.productionTip = false


// 全局格式化时间过滤器
Vue.filter('dateFormat', function (originDate) {
  var dt = new Date(originDate)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  /* const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0') */

  return `${y}-${m}-${d}`
  //${hh}:${mm}:${ss}
})

new Vue({
  router,
  store,
  marked,
  lodash,
  render: h => h(App)
}).$mount('#app')

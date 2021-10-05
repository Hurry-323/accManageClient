import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/index.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import treeTable from 'vue-table-with-tree-grid'

// 导入富文本 编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入 Nprogress 包对应的js和css
import NProgress from 'nprogress'

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:80/'
/* axios.defaults.baseURL = 'http://127.0.0.1:8080/' */
/* axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/' */
// 请求拦截 在 request 拦截器中， 展示进度条  Nprogress.down()
axios.interceptors.request.use(config => {
  // loading进度条开始
  NProgress.start()
  // 为请求头对象, 添加token 验证 Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

// 请求响应 在 response 拦截器中， 隐藏进度条  Nprogress.down()
axios.interceptors.response.use(config => {
  // lading进度条结束
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', treeTable)
// 将富文本编辑器，注册为全局可用组件
Vue.use(VueQuillEditor)

// 全局格式化时间过滤器
Vue.filter('dateFormat', function (originDate) {
  var dt = new Date(originDate)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

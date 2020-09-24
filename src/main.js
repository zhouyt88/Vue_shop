import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入NProgress
import nprogress from 'nprogress'
import '../node_modules/nprogress/nprogress.css'
Vue.use(VueQuillEditor)

// 定义一个时间过滤器
Vue.filter('dataTime', function (t) {
  const date = new Date(t)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const datee = date.getDate()
  var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const time = year + '-' + month + '-' + datee + '  ' + hour + ':' + minute + ':' + second
  return time
})
Vue.component('tree-Table', TreeTable)
// 配置公共的请求头
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在请求头中挂在token令牌
// axios设置请求拦截器
axios.interceptors.request.use(config => {
  // nprogress进度条,开始请求
  nprogress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}, err => {
  console.log(err)
  return Promise.reject(err)
})
// axios设置响应拦截器
axios.interceptors.response.use(response => {
  // nprogress进度条,请求结束
  nprogress.done()
  // 拦截处理响应结果，直接返回需要的数据
  return response
}, err => {
  console.log(err)
})

Vue.config.productionTip = false

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

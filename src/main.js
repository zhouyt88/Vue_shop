import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
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
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}, err => {
  console.log(err)
  return Promise.reject(err)
})
Vue.config.productionTip = false

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/global.css'
import axios from 'axios'

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

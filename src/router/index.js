import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import login from '../components/login.vue'
// 配置公共的请求头
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.use(VueRouter)
Vue.prototype.$http = axios
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login }
]

const router = new VueRouter({
  routes
})

export default router

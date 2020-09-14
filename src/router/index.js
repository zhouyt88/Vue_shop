import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import login from '../components/login.vue'
import home from '../components/home.vue'
// 配置公共的请求头
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.use(VueRouter)
Vue.prototype.$http = axios
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: home }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to.path等于/login直接放行
  if (to.path === '/login') {
    next()
  } else {
    // 否则判断是否存在token,无,则跳转/login登录页面,有则放行
    const token = sessionStorage.getItem('token')
    if (!token) {
      return next('/login')
    } else {
      next()
    }
  }
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next()
})

export default router

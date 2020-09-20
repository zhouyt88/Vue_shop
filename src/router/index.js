import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcom from '../components/welcom.vue'
import users from '../components/users.vue'
import rights from '../components/rights/rights.vue'
import roles from '../components/rights/roles.vue'
import categories from '../components/goods/categories.vue'
import params from '../components/goods/params.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home', component: home, redirect: '/welcom', children: [{ path: '/welcom', component: welcom }, { path: '/rights', component: rights }, { path: '/users', component: users }, { path: '/roles', component: roles }, { path: '/categories', component: categories }, { path: '/params', component: params }]
  }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

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
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
// 这个 @ 符号，是 vue 给提供的一个路径简写方式，代表的是 src 目录
// 注意：@ 后面有一个斜线的
// 登录
// import login from '@/views/login.vue'
// 主页面
// import home from '@/views/home.vue'
// 欢迎页面
// import welcom from '@/views/welcom.vue'
const login = () => import(/* webpackChunkName:"login_home_welcom" */ '@/views/login.vue')
const home = () => import(/* webpackChunkName:"login_home_welcom" */ '@/views/home.vue')
const welcom = () => import(/* webpackChunkName:"login_home_welcom" */ '@/views/welcom.vue')

// 用户管理
// import users from '@/views/users.vue'
const users = () => import(/* webpackChunkName: "users" */ '@/views/users.vue')

// 权限管理
// import rights from '@/views/rights/rights.vue'
// import roles from '@/views/rights/roles.vue'
const rights = () => import(/* webpackChunkName: "rights_roles" */ '@/views/rights/rights.vue')
const roles = () => import(/* webpackChunkName: "rights_roles" */ '@/views/rights/roles.vue')

// 商品管理
// import categories from '@/views/goods/categories.vue'
// import params from '@/views/goods/params.vue'
// import goods from '@/views/goods/goods.vue'
// import add from '@/views/goods/add.vue'
const categories = () => import(/* webpackChunkName: "goods" */ '@/views/goods/categories.vue')
const params = () => import(/* webpackChunkName: "goods" */ '@/views/goods/params.vue')
const goods = () => import(/* webpackChunkName: "goods" */ '@/views/goods/goods.vue')
const add = () => import(/* webpackChunkName: "goods" */ '@/views/goods/add.vue')

// 角色列表
// import orders from '@/views/orders.vue'
const orders = () => import(/* webpackChunkName: "order" */ '@/views/orders.vue')

// 数据列表
// import reports from '@/views/reports.vue'
const reports = () => import(/* webpackChunkName: "reports" */ '@/views/reports.vue')

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home', component: home, redirect: '/welcom', children: [{ path: '/welcom', component: welcom }, { path: '/rights', component: rights }, { path: '/users', component: users }, { path: '/roles', component: roles }, { path: '/categories', component: categories }, { path: '/params', component: params }, { path: '/goods', component: goods }, { path: '/goods/add', component: add }, { path: '/orders', component: orders }, { path: '/reports', component: reports }]
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

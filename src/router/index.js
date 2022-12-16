/*
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:24:17
 * @LastEditTime: 2022-12-16 11:02:00
 * @Description : 路由
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/train-normal' // 路由重定向至普通测试页
  },

  /* 普通模式 */
  {
    path: '/train-normal',
    name: 'train-normal',
    component: () => import('@/views/train-normal/index.vue')
  },

  /* 组次模式 */
  {
    path: '/train-number',
    name: 'train-number',
    component: () => import('@/views/train-number/index.vue')
  },

  /* 配置页 */
  {
    path: '/configure',
    name: 'configure',
    component: () => import('@/views/configure/index.vue')
  },

  /* 数据记录页 */
  {
    path: '/data-record',
    name: 'data-record',
    component: () => import('@/views/data-record/index.vue')
  },

  // 数据迁移
  {
    path: '/data-migration',
    name: 'data-migration',
    component: () => import('@/views/data-migration/index.vue')
  },

  {
    path: '*',
    redirect: '/train-normal' // 匹配不到路由时，路由重定向至普通测试页
  }
]

const router = new VueRouter({
  routes,
  /* 自定义路由切换时页面如何滚动 */
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 } // 回到顶部
  }
})

export default router

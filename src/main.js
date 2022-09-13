/*
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:24:17
 * @LastEditTime: 2020-09-15 10:26:04
 * @Description : 渲染进程入口
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* 引入element-ui库 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/* 引入Echarts */
import Echarts from 'echarts'
/* 引入moment时间日期库 */
import moment from 'moment'
/* 引入初始化数据库 */
import { initDB } from '@/db/index.js'
/* 引入全局css（注意引入顺序，放到element-ui下面即可覆盖element-ui的css样式） */
import '@/style/index.scss'

Vue.use(ElementUI)
Vue.prototype.$echarts = Echarts
Vue.prototype.$moment = moment
initDB()
  .open()
  .catch(() => {
    alert('打开数据库失败，请重启软件')
  })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

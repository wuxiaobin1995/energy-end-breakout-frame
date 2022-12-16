<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:24:17
 * @LastEditTime: 2022-12-16 11:03:10
 * @Description : 根组件
-->
<template>
  <div id="app">
    <!-- 顶部栏 -->
    <div class="header">
      <el-menu
        class="el-menu-demo"
        :default-active="this.$route.path ? this.$route.path : '/train-normal'"
        background-color="#545c64"
        text-color="#ffffff"
        active-text-color="#ffd04b"
        mode="horizontal"
        router
      >
        <el-menu-item index="/train-normal">
          <i class="el-icon-s-home"></i>
          <span>普 通 模 式</span>
        </el-menu-item>
        <!-- <el-menu-item index="/train-number">
          <i class="el-icon-s-data"></i>
          <span>组 次 模 式</span>
        </el-menu-item> -->
        <el-menu-item index="/configure">
          <i class="el-icon-edit"></i>
          <span>配 置 页</span>
        </el-menu-item>
        <el-menu-item index="/data-record">
          <i class="el-icon-date"></i>
          <span>数 据 查 看 页</span>
        </el-menu-item>
        <el-menu-item index="/data-migration">
          <i class="el-icon-s-data"></i>
          <span>数 据 迁 移</span>
        </el-menu-item>
        <el-menu-item>
          <el-button icon="el-icon-refresh" @click="handleRefresh" plain round
            >刷 新 页 面
          </el-button>
        </el-menu-item>
        <el-menu-item>
          <span class="project-name">爆发力与速度反馈系统-训练架 v1.0.0</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 内容区 -->
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',

  created() {
    this.initLocalStorage() // 初始化localStorage的数据
  },

  methods: {
    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      window.location.reload()
    },

    /**
     * @description: 初始化localStorage的数据
     */
    initLocalStorage() {
      /* 初始化localStorage中的波特率 */
      if (!window.localStorage.getItem('scmBaudRate')) {
        window.localStorage.setItem('scmBaudRate', '115200')
      }
      /* 初始化localStorage中的摩擦阻力值 */
      if (!window.localStorage.getItem('resistanceTrainWeight')) {
        window.localStorage.setItem('resistanceTrainWeight', '8')
      }
      /* 初始化localStorage中的后端配重值 */
      if (!window.localStorage.getItem('balanceWeight')) {
        window.localStorage.setItem('balanceWeight', '135')
      }
      /* 初始化localStorage中的前端配重值 */
      if (!window.localStorage.getItem('heavyWeight')) {
        window.localStorage.setItem('heavyWeight', '0')
      }
      // 初始化localStorage中的人员设定的峰值功率百分比
      if (!window.localStorage.getItem('maxPowerPercent')) {
        window.localStorage.setItem('maxPowerPercent', '90')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 8vh;
  .project-name {
    margin-left: 100px;
    color: #ffffff;
    font-size: 22px;
  }
}

.main {
  margin: 0 2px 0px 2px;
  height: 90vh;
}
</style>

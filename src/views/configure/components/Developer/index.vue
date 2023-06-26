<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2023-06-26 11:31:59
 * @Description : 开发者页面
-->
<template>
  <div class="developer-container">
    <!-- 打开控制台按钮 -->
    <el-divider>控制台</el-divider>
    <el-row>
      <el-button type="primary" @click="handleOpenDev">打开控制台</el-button>
    </el-row>

    <!-- 摩擦阻力值 -->
    <el-divider>摩擦阻力值</el-divider>
    <el-input-number
      v-model="resistanceTrainWeight"
      :min="0"
      :max="10000"
      @change="handleCheckResistanceTrainWeight"
    ></el-input-number>

    <!-- 波特率值 -->
    <el-divider>波特率值</el-divider>
    <el-input-number
      v-model="scmBaudRate"
      :min="0"
      :max="999999"
      @change="handleCheckScmBaudRate"
    ></el-input-number>

    <!-- 免责声明 -->
    <el-divider>免责声明</el-divider>
    <div class="disclaimer">
      <el-input class="item" placeholder="请输入终端用户名称" v-model="name">
        <template slot="prepend">终端用户名称：</template>
      </el-input>
      <el-input class="item" placeholder="请输入设备编号" v-model="deviceId">
        <template slot="prepend">设备编号：</template>
      </el-input>
      <el-button class="item" type="primary" @click="handleSetDisclaimer"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

export default {
  name: 'Developer',

  data() {
    return {
      resistanceTrainWeight: 8, // 摩擦阻力值
      scmBaudRate: 115200, // 波特率值

      name: '',
      deviceId: ''
    }
  },

  created() {
    /* 从localStorage获取波特率 */
    this.scmBaudRate = parseFloat(window.localStorage.getItem('scmBaudRate'))
    /* 从localStorage获取摩擦阻力值 */
    this.resistanceTrainWeight = parseFloat(
      window.localStorage.getItem('resistanceTrainWeight')
    )

    this.name = window.localStorage.getItem('disclaimer_name')
    this.deviceId = window.localStorage.getItem('disclaimer_device_id')
  },

  methods: {
    /**
     * @description: 打开控制台按钮
     */
    handleOpenDev() {
      try {
        remote.getCurrentWebContents().openDevTools()
      } catch (err) {
        this.$message({
          type: 'error',
          message: `打开控制台失败：${err}`
        })
      }
    },

    /**
     * @description: 保存摩擦阻力值到localStorage
     */
    handleCheckResistanceTrainWeight() {
      if (!this.resistanceTrainWeight) {
        this.resistanceTrainWeight = 0
      }
      window.localStorage.setItem(
        'resistanceTrainWeight',
        this.resistanceTrainWeight
      )
      this.$message({
        type: 'success',
        message: '设置摩擦阻力值成功',
        duration: 1000
      })
    },

    /**
     * @description: 保存波特率值到localStorage
     */
    handleCheckScmBaudRate() {
      if (!this.scmBaudRate) {
        this.scmBaudRate = 0
      }
      window.localStorage.setItem('scmBaudRate', this.scmBaudRate)
      this.$message({
        type: 'success',
        message: '设置波特率值成功',
        duration: 1000
      })
    },

    /**
     * @description: 设置免责声明
     */
    handleSetDisclaimer() {
      window.localStorage.setItem('disclaimer_name', this.name)
      window.localStorage.setItem('disclaimer_device_id', this.deviceId)

      this.$message({
        type: 'success',
        message: '设置免责声明成功！',
        duration: 3000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.developer-container {
  width: 100%;
  height: 100%;

  .disclaimer {
    width: 50%;
    margin-top: 50px;
    border: 2px solid rgb(133, 130, 130);
    border-radius: 20px;
    padding: 20px 20px 0 20px;
    .item {
      margin-bottom: 30px;
    }
  }
}
</style>

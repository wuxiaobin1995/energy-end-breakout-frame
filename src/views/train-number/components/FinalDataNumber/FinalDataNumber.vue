<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-09-11 15:53:11
 * @Description : FinalData子组件
-->
<template>
  <div class="container">
    <!-- 单选按钮组 -->
    <el-radio-group class="select" v-model="radio" @change="handleSelect">
      <el-row class="select-row">
        <el-radio label="峰值功率" border>峰值功率</el-radio>
        <el-radio label="峰值速度" border>峰值速度</el-radio>
      </el-row>
      <el-row class="select-row">
        <el-radio label="平均功率" border>平均功率</el-radio>
        <el-radio label="平均速度" border>平均速度</el-radio>
      </el-row>
    </el-radio-group>

    <!-- 显示数据 -->
    <div class="show">
      <div class="show-main">
        <div v-show="isShowMaxSpeed">{{ recordData2.maxSpeed }} m/s</div>
        <div v-show="isShowMaxPower">{{ recordData2.maxPower }} W</div>
        <div v-show="isShowAverageSpeed">
          {{ recordData2.averageSpeed }} m/s
        </div>
        <div v-show="isShowAveragePower">{{ recordData2.averagePower }} W</div>
      </div>
      <div class="show-other">
        <div>百分比：{{ tireValue }} %</div>
        <div>重复次数：{{ trainCount }} | {{ trainCountSet }}</div>
        <div>负重：{{ trainWeight }} kg</div>
      </div>
    </div>

    <!-- logo图片 -->
    <el-image
      class="img"
      :src="require('@/assets/logo.png')"
      fit="contain"
    ></el-image>
  </div>
</template>

<script>
export default {
  name: 'FinalDataNumber',

  props: {
    // 一组训练的动态次数
    trainCount: {
      type: Number,
      default: 0
    },
    // 设定一组训练的次数，≥2
    trainCountSet: {
      type: Number,
      default: 2
    },
    // 百分比
    tireValue: {
      type: Number,
      default: 0
    },
    // 负重
    trainWeight: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      isShowMaxPower: true,
      isShowMaxSpeed: false,
      isShowAveragePower: false,
      isShowAverageSpeed: false,
      radio: '峰值功率'
    }
  },

  computed: {
    // 通过Vuex传递值
    recordData2() {
      return this.$store.state.recordData2
    }
  },

  methods: {
    /**
     * @description: 绑定值变化时触发的事件
     * @param {String} value 选中的单选框的值
     */
    handleSelect(value) {
      this.isShowMaxPower = false
      this.isShowMaxSpeed = false
      this.isShowAveragePower = false
      this.isShowAverageSpeed = false
      switch (value) {
        case '峰值功率':
          this.isShowMaxPower = true
          break
        case '峰值速度':
          this.isShowMaxSpeed = true
          break
        case '平均功率':
          this.isShowAveragePower = true
          break
        case '平均速度':
          this.isShowAverageSpeed = true
          break
        default:
          this.radio = '峰值功率'
          this.isShowMaxPower = true
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .select {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #cacbcc;
    .select-row {
      margin: 8px 0;
    }
  }

  .show {
    background-color: #606266;
    .show-main {
      padding-right: 5px;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 66px;
      text-align: right;
      color: #f82727;
    }
    .show-other {
      font-size: 22px;
      color: #ffffff;
      padding-left: 5px;
      margin-bottom: 8px;
    }
  }

  .img {
    flex-grow: 1;
  }
}
</style>

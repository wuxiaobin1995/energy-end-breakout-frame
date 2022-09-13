<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-09-15 09:43:46
 * @Description : LineChart子组件：速度与功率
-->
<template>
  <div class="container">
    <el-button
      class="btn"
      type="success"
      round
      size="small"
      @click="handleShow"
    >
      {{ isPowerShow ? '切换速度曲线图' : '切换功率曲线图' }}
    </el-button>
    <div
      id="PowerChart"
      ref="PowerChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isPowerShow"
    />
    <div
      id="SpeedChart"
      ref="SpeedChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isSpeedShow"
    />
  </div>
</template>

<script>
export default {
  name: 'LineChartTwoNumber',

  data() {
    return {
      myChartPower: null,
      myChartSpeed: null,
      isPowerShow: true,
      isSpeedShow: true
    }
  },

  mounted() {
    this.initChart().then(() => {
      this.isSpeedShow = false
    })
  },
  beforeDestroy() {
    if (this.myChartPower) {
      this.myChartPower.dispose() // 释放功率图表实例，释放后实例不再可用
      this.myChartPower = null
    } else if (this.myChartSpeed) {
      this.myChartSpeed.dispose() // 释放速度图表实例，释放后实例不再可用
      this.myChartSpeed = null
    }
  },

  computed: {
    // 通过Vuex传递值
    recordData2() {
      return this.$store.state.recordData2
    }
  },

  watch: {
    recordData2: {
      handler(newValue, oldValue) {
        /* 速度单位转换，把 cm/s -> m/s */
        const newSpeedDataArray = []
        newValue.speedDataArray.forEach(item => {
          newSpeedDataArray.push(parseFloat((item * 0.01).toFixed(2)))
        })

        /* x轴 */
        const xAxisData = []
        for (let i = 0, len = newValue.powerDataArray.length; i < len; i++) {
          xAxisData.push((i * 0.1).toFixed(1))
        }

        /* 重新设值，刷新功率曲线图形 */
        this.myChartPower.setOption({
          xAxis: {
            data: xAxisData
          },
          series: [
            {
              data: newValue.powerDataArray
            }
          ]
        })

        /* 重新设值，刷新速度曲线图形 */
        this.myChartSpeed.setOption({
          xAxis: {
            data: xAxisData
          },
          series: [
            {
              data: newSpeedDataArray
            }
          ]
        })
      },
      deep: true
    }
  },

  methods: {
    /**
     * @description: echarts配置项
     */
    initChart() {
      return new Promise((resolve, reject) => {
        /* 功率 */
        this.myChartPower = this.$echarts.init(document.getElementById('PowerChart'))
        this.myChartPower.setOption({
          /* 标题栏。包含主标题和副标题 */
          title: {
            text: '功率曲线图', // 主标题
            subtext: '功率[W]' // 副标题
          },
          /* 提示框 */
          tooltip: {
            trigger: 'axis' // 触发类型：坐标轴触发
          },
          /* 图例。展现了不同系列的标记(symbol)，颜色和名字 */
          legend: {
            data: ['功率曲线']
          },
          /* 直角坐标系 grid 中的 x 轴 */
          xAxis: [
            {
              name: 't/s',
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          /* 直角坐标系 grid 中的 y 轴 */
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          /* 系列列表。每个系列通过 type 决定自己的图表类型 */
          series: [
            {
              name: '功率曲线',
              type: 'line',
              smooth: true,
              areaStyle: {},
              markPoint: {
                symbolSize: 68,
                data: [{ type: 'max', name: '最大值' }]
              },
              data: []
            }
          ],
          /* 工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具 */
          toolbox: {
            show: true,
            feature: {
              // 导出图片
              saveAsImage: {
                name: `功率曲线图_${this.$moment().format('YYYY-MM-DD')}`
              },
              restore: {} // 重置
            }
          },
          /* 是否开启动画效果 */
          animation: true
        })

        /* 速度 */
        this.myChartSpeed = this.$echarts.init(document.getElementById('SpeedChart'))
        this.myChartSpeed.setOption({
          /* 标题栏。包含主标题和副标题 */
          title: {
            text: '速度曲线图', // 主标题
            subtext: '速度[m/s]' // 副标题
          },
          /* 提示框 */
          tooltip: {
            trigger: 'axis' // 触发类型：坐标轴触发
          },
          /* 图例。展现了不同系列的标记(symbol)，颜色和名字 */
          legend: {
            data: ['速度曲线']
          },
          /* 直角坐标系 grid 中的 x 轴 */
          xAxis: [
            {
              name: 't/s',
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          /* 直角坐标系 grid 中的 y 轴 */
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          /* 系列列表。每个系列通过 type 决定自己的图表类型 */
          series: [
            {
              name: '速度曲线',
              type: 'line',
              smooth: true,
              areaStyle: {},
              markPoint: {
                symbolSize: 68,
                data: [{ type: 'max', name: '最大值' }]
              },
              data: []
            }
          ],
          /* 工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具 */
          toolbox: {
            show: true,
            feature: {
              // 导出图片
              saveAsImage: {
                name: `速度曲线图_${this.$moment().format('YYYY-MM-DD')}`
              },
              restore: {} // 重置
            }
          },
          /* 是否开启动画效果 */
          animation: true
        })

        return resolve()
      })
    },

    /**
     * @description: 切换图形按钮
     */
    handleShow() {
      this.isPowerShow = !this.isPowerShow
      this.isSpeedShow = !this.isSpeedShow
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .btn {
    margin-left: 5px;
  }
}
</style>

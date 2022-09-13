<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2022-03-09 10:10:49
 * @Description : 普通模式
-->
<template>
  <el-row class="train-normal-container">
    <!-- 语音播放 -->
    <audio ref="audio" controls="controls" hidden :src="audioTipSrc" />

    <!-- 左半区 -->
    <el-col :span="6" class="left-container">
      <!-- 数显区域 -->
      <el-divider><i class="el-icon-help"></i> 数显区域</el-divider>
      <el-row class="finaldata-area">
        <!-- FinalDataNormal子组件 -->
        <final-data-normal
          :trainCount="trainCount"
          :tireValue="tireValue"
          :trainWeight="recordData.trainWeight"
        />
      </el-row>
    </el-col>

    <!-- 中半区 -->
    <el-col :span="9" class="center-container">
      <!-- 控制区域 -->
      <el-divider><i class="el-icon-place"></i> 控制区域</el-divider>
      <el-row class="control-area">
        <el-col :span="10" class="control-area-left">
          <!-- 开始按钮 -->
          <el-button
            :style="{ margin: '0px 4px 20px 4px', 'font-size': '18px' }"
            type="primary"
            plain
            @click="handleOpenUsb"
            :loading="isUsbConnect && isDataConnect"
            :disabled="!isUsbConnect"
            >{{
              isUsbConnect && isDataConnect ? '运 动 中......' : '开 始 运 动'
            }}</el-button
          >
          <!-- 结束按钮 -->
          <el-button
            :style="{ margin: '0px 4px 0px 4px', 'font-size': '18px' }"
            type="danger"
            plain
            @click="handleCloseUsb"
            :disabled="!isUsbConnect"
            >结 束 运 动</el-button
          >
        </el-col>
        <el-col :span="14" class="control-area-right">
          <el-form label-width="80px" size="small">
            <!-- 分组下拉框 -->
            <el-form-item label="分组:" :style="{ 'margin-bottom': '20px' }">
              <el-select
                v-model="recordData.userGroup"
                placeholder="选择分组"
                @change="handleSelectUserGroup"
                :disabled="isDataConnect"
              >
                <el-option
                  v-for="(item, index) in userGroupArray"
                  :key="index"
                  :value="item.userGroup"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 用户下拉框 -->
            <el-form-item label="用户名:" :style="{ 'margin-bottom': '20px' }">
              <el-select
                v-model="recordData.userId"
                placeholder="选择用户"
                @change="handleSelectUser"
              >
                <el-option
                  v-for="(item, index) in userShowArray"
                  :key="index"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 训练动作下拉框 -->
            <el-form-item label="训练动作:" :style="{ 'margin-bottom': '0px' }">
              <el-select
                v-model="recordData.actionId"
                placeholder="选择训练动作"
                @change="handleSelectTrainAction"
              >
                <el-option
                  v-for="(item, index) in actionArray"
                  :key="index"
                  :value="item.actionId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 绘图区域 -->
      <el-divider><i class="el-icon-picture-outline"></i> 绘图区域</el-divider>
      <el-row class="linechart-area-one">
        <!-- LineChartOneNormal子组件 -->
        <line-chart-one-normal />
      </el-row>
    </el-col>

    <!-- 右半区 -->
    <el-col :span="9" class="right-container">
      <!-- 控制区域 -->
      <el-divider><i class="el-icon-place"></i> 控制区域</el-divider>
      <el-row class="input-number-area">
        <el-row class="input-number-area-first">
          <!-- 前端配重计数器 -->
          <el-col>
            <div>前端配重(kg):</div>
            <el-input-number
              v-model="heavyWeight"
              :step="5"
              :min="0"
              :max="1000"
              @change="handleCheckHeavyWeight"
            ></el-input-number>
          </el-col>
        </el-row>
        <el-row class="input-number-area-second">
          <!-- 后端配重计数器 -->
          <el-col>
            <div>后端配重(kg):</div>
            <el-input-number
              v-model="balanceWeight"
              :step="5"
              size="small"
              :min="0"
              :max="170"
              @change="handleCheckBalanceWeight"
            ></el-input-number>
          </el-col>
          <!-- 灵敏度下拉框 -->
          <el-col>
            <div>灵敏度:</div>
            <el-select
              v-model="sensitivity"
              size="small"
              placeholder="请选择灵敏度"
            >
              <el-option
                v-for="item in sensitivityArray"
                :key="item.sensitivity"
                :label="item.label"
                :value="item.sensitivity"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-row>

      <!-- 绘图区域 -->
      <el-divider><i class="el-icon-picture-outline"></i> 绘图区域</el-divider>
      <el-row class="linechart-area-two">
        <!-- LineChartTwoNormal子组件 -->
        <line-chart-two-normal />
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
/* 路径模块 */
import path from 'path'

/* 串口通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

/* indexDB数据库 */
import { initDB } from '@/db/index.js'

/* 数据计算方法 */
import { calculateData } from './utils/calculate-data-normal.js'

/* 子组件 */
import FinalDataNormal from '@/views/train-normal/components/FinalDataNormal/FinalDataNormal.vue'
import LineChartOneNormal from '@/views/train-normal/components/FinalChartNormal/LineChartOneNormal.vue'
import LineChartTwoNormal from '@/views/train-normal/components/FinalChartNormal/LineChartTwoNormal.vue'

export default {
  name: 'train-normal',

  components: {
    FinalDataNormal,
    LineChartOneNormal,
    LineChartTwoNormal
  },

  data() {
    return {
      usbPort: null,
      parser: null,
      isUsbConnect: true, // USB线连接状态（true为已连接设备，false为断开设备连接）
      isDataConnect: false, // 串口的数据通讯状态（true为数据正在接收，false为接收已断开）
      isStart: true, // 是否开始该次数据记录开关
      isSave: false, // 是否正在保存该次数据开关
      isSaveCount: 0, // 连续n次负值，才判断为要保存该次数据（只针对向上或向下运动）
      isSafeSwitchClose: 0, // 安全数值，连续30分钟不动作，就自动关闭串口连接
      /* 记录到train_data表的数据 */
      recordData: {
        speedDataArray: [], // 瞬时速度数组[cm/s]
        distanceDataArray: [], // 瞬时位移数组[mm]
        powerDataArray: [], // 瞬时功率数组[W]
        maxPower: 0, // 峰值功率[W]
        maxPowerArray: [], // 峰值功率数组[W]
        maxSpeed: 0, // 峰值速度[m/s]
        averagePower: 0, // 平均功率[W]
        averageSpeed: 0, // 平均速度[m/s]
        relativeDistance: 0, // 相对位移值[mm]，即运动距离
        currentTime: '', // 该次数据记录的时间[s]
        userId: '', // 当前用户id-双向绑定
        userGroup: '', // 所属分组-双向绑定
        actionId: '', // 训练动作-双向绑定
        trainWeight: 1, // 最终负重[kg]-双向绑定，≥1
        mode: '普通模式'
      },
      userArray: [], // 所有user表数据
      actionArray: [], // 所有action表数据
      userGroupArray: [], // 所有分组（已去重复）
      userShowArray: [], // 所选分组下的用户
      balanceWeight: 135, // 后端配重[kg]-双向绑定，0~170kg，（171.25kg即配平）
      heavyWeight: 0, // 前端配重[kg]-双向绑定，0~300kg
      resistanceTrainWeight: 8, // 摩擦阻力值[kg]，测得8kg
      sensitivity: 5, // 灵敏度，用于过滤轻微下降
      sensitivityArray: [
        {
          sensitivity: 5,
          label: '高灵敏度'
        },
        {
          sensitivity: 15,
          label: '中灵敏度'
        },
        {
          sensitivity: 25,
          label: '低灵敏度'
        }
      ],
      trainCount: 0, // 运动重复的次数
      scmBaudRate: 115200, // 波特率
      audioTipSrc: path.join(__static, 'music/ding.mp3'), // 音频路径，功率小于前几次峰值功率的90%时发出提示音
      everyMaxPowerArray: [], // 记录当前重复次数下的峰值功率的数组
      tireValue: 0, // 疲劳结果，0~100%
      maxPowerPercent: 90 // 人员设定的峰值功率百分比，默认90%
    }
  },

  created() {
    this.initSerialPort() // 初始化SerialPort串口
    this.getUserData() // 获取user表数据
    this.getActionData() // 获取action表数据
    this.getLocalStorageData() // 获取loaclStorage的数据
    /* 计算最终负重值 */
    this.countTrainWeight()
  },
  beforeDestroy() {
    this.initVuex()
    if (this.usbPort) {
      if (this.usbPort.isOpen) {
        this.usbPort.close()
      }
    }
  },

  methods: {
    /**
     * @description: 初始化SerialPort串口方法
     */
    initSerialPort() {
      /**
       * @description: SerialPort.list()返回Promise
       * @param {Array[Object]} ports 所有串口的基本信息
       */
      SerialPort.list()
        .then(ports => {
          /* 遍历设备的USB串口，目标设备需安装驱动 */
          let comPath = ''
          for (const port of ports) {
            if (/^USB/.test(port.pnpId)) {
              comPath = port.path
              break
            }
          }

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            this.$notify({
              title: '通知',
              message: `连接到串口：${comPath}；波特率为：${this.scmBaudRate}`,
              type: 'success',
              position: 'bottom-left',
              duration: 2000
            })

            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPort = new SerialPort(comPath, {
              baudRate: this.scmBaudRate, // 默认波特率115200
              autoOpen: false // 是否自动开启串口
            })
            /* 调用 this.usbPort.open() 成功时触发（开启串口成功） */
            this.usbPort.on('open', () => {
              this.$message({
                message: '串口开启成功',
                type: 'success',
                duration: 2500
              })
            })
            /* 调用 this.usbPort.open() 失败时触发（开启串口失败） */
            this.usbPort.on('error', () => {
              this.isUsbConnect = false
              this.$notify({
                title: '没有检测到USB连接',
                message: '请重新连接USB线，然后刷新页面或重启设备',
                type: 'error',
                position: 'bottom-left'
              })
            })
            /* Readline解析器将数据转换成字符串 */
            this.parser = this.usbPort.pipe(new Readline({ delimiter: '\n' }))
            /* 流式通信，每隔0.1秒下位机发送一次数据 */
            this.parser.on('data', data => {
              // console.log(data)
              const arrData = data.split(',')
              const speedData = parseFloat(parseFloat(arrData[0]).toFixed(1)) // 瞬时速度cm/s，保留1位小数
              const distanceData = parseFloat(
                (parseFloat(arrData[1]) * 0.4).toFixed(0)
              ) // 位移mm，有正负，不保留小数

              /* 验证下位机数据的完整性 */
              if (!isNaN(speedData) && !isNaN(distanceData)) {
                /* 安全开关 */
                if (speedData === 0) {
                  this.isSafeSwitchClose += 1
                } else {
                  this.isSafeSwitchClose = 0
                }
                /* 连续30分钟无动作，则自动关闭串口连接 */
                if (this.isSafeSwitchClose >= 18000) {
                  this.isSafeSwitchClose = 0
                  this.handleCloseUsb()
                  this.clearSerialData()
                  this.$message({
                    message:
                      '警告，检测到您连续30分钟内均没有动作，串口已自动关闭',
                    type: 'warning',
                    duration: 10000
                  })
                }

                /* 过滤掉速度 <0cm/s的数据 */
                if (speedData >= 0) {
                  if (this.recordData.speedDataArray.length >= 600) {
                    this.clearSerialData()
                  }
                  this.recordData.speedDataArray.push(speedData)
                  this.recordData.distanceDataArray.push(distanceData)
                }

                /* 开始该次数据记录 */
                if (this.isStart) {
                  if (this.recordData.distanceDataArray.length >= 2) {
                    const dis1 = this.recordData.distanceDataArray[
                      this.recordData.distanceDataArray.length - 2
                    ]
                    const dis2 = this.recordData.distanceDataArray[
                      this.recordData.distanceDataArray.length - 1
                    ]
                    if (dis2 - dis1 > 0) {
                      this.isStart = false
                      /* 数据预处理，把第一个点的值保留下来 */
                      let firstSpeed = this.recordData.speedDataArray.pop()
                      let firstDistance = this.recordData.distanceDataArray.pop()
                      if (!firstSpeed) {
                        firstSpeed = 0
                      }
                      if (!firstDistance) {
                        firstDistance = 0
                      }
                      this.clearSerialData()
                      this.recordData.speedDataArray.push(firstSpeed)
                      this.recordData.distanceDataArray.push(firstDistance)
                      this.isSave = true
                    }
                  }
                }

                /* 保存该次数据 */
                if (this.isSave) {
                  if (this.recordData.distanceDataArray.length >= 2) {
                    const dis1 = this.recordData.distanceDataArray[
                      this.recordData.distanceDataArray.length - 2
                    ]
                    const dis2 = this.recordData.distanceDataArray[
                      this.recordData.distanceDataArray.length - 1
                    ]
                    if (dis2 - dis1 <= 0) {
                      this.isSaveCount += 1
                      /* 保存该次数据（sensitivity表示灵敏度） */
                      if (this.isSaveCount === this.sensitivity) {
                        this.isSave = false
                        /* 这里进行切片，把位移波峰值之后的下降阶段值过滤掉 */
                        const maxDistance = Math.max.apply(
                          null,
                          this.recordData.distanceDataArray
                        )
                        const maxDistanceIndex = this.recordData.distanceDataArray.findIndex(
                          item => {
                            return item === maxDistance
                          }
                        )
                        this.recordData.speedDataArray = this.recordData.speedDataArray.slice(
                          0,
                          maxDistanceIndex + 1
                        )
                        this.recordData.distanceDataArray = this.recordData.distanceDataArray.slice(
                          0,
                          maxDistanceIndex + 1
                        )

                        /* 把运动距离≤50mm的不作保存 */
                        const relativeDistanceTest = parseFloat(
                          Math.abs(
                            Math.max.apply(
                              null,
                              this.recordData.distanceDataArray
                            ) -
                              Math.min.apply(
                                null,
                                this.recordData.distanceDataArray
                              )
                          )
                        )
                        if (relativeDistanceTest > 50) {
                          /* 调用数据计算方法 */
                          const calculateDataResult = calculateData(
                            this.recordData.speedDataArray,
                            this.recordData.distanceDataArray,
                            this.recordData.trainWeight
                          )
                          this.recordData.relativeDistance =
                            calculateDataResult.relativeDistance
                          this.recordData.currentTime =
                            calculateDataResult.currentTime
                          this.recordData.maxPower =
                            calculateDataResult.maxPower
                          this.recordData.maxSpeed =
                            calculateDataResult.maxSpeed
                          this.recordData.averagePower =
                            calculateDataResult.averagePower
                          this.recordData.averageSpeed =
                            calculateDataResult.averageSpeed
                          this.recordData.powerDataArray =
                            calculateDataResult.powerDataArray
                          this.recordData.maxPowerArray = [
                            this.recordData.maxPower
                          ]

                          // 判断功率是否低于前面几次峰值功率的设定百分比
                          this.everyMaxPowerArray.push(this.recordData.maxPower)
                          this.tireValue = parseFloat(
                            (
                              (this.recordData.maxPower /
                                Math.max.apply(null, this.everyMaxPowerArray)) *
                              100
                            ).toFixed(0)
                          )
                          if (this.tireValue < this.maxPowerPercent) {
                            // 调用提示音
                            this.audioTip()
                          }

                          // 重复的次数
                          this.trainCount += 1

                          /* 数据保存到 train_data 表中 */
                          const db = initDB()
                          db.train_data
                            .add(this.recordData)
                            .then(() => {
                              this.$message({
                                message: '数据保存成功',
                                type: 'success',
                                duration: 1500
                              })
                            })
                            .then(() => {
                              // 更新Vuex仓库
                              this.$store.dispatch('changeRecordData', {
                                speedDataArray: this.recordData.speedDataArray,
                                distanceDataArray: this.recordData
                                  .distanceDataArray,
                                powerDataArray: this.recordData.powerDataArray,
                                maxPower: this.recordData.maxPower,
                                maxSpeed: this.recordData.maxSpeed,
                                averagePower: this.recordData.averagePower,
                                averageSpeed: this.recordData.averageSpeed
                              })
                            })
                            .catch(() => {
                              this.$message({
                                message: '数据保存失败',
                                type: 'error',
                                duration: 2000
                              })
                            })
                            .finally(() => {
                              // 清空该次的速度与位移数据
                              this.clearSerialData()
                              // 重新启动记录开关
                              this.isStart = true
                            })
                        } else {
                          // 清空该次的速度与位移数据
                          this.clearSerialData()
                          // 重新启动记录开关
                          this.isStart = true
                        }
                      }
                    } else {
                      this.isSaveCount = 0
                    }
                  }
                }
              }
            })
          } else {
            this.isUsbConnect = false
            this.$notify({
              title: '没有检测到USB连接',
              message: '请重新连接USB线，然后刷新页面或重启设备',
              type: 'error',
              position: 'bottom-left'
            })
          }
        })
        .catch(err => {
          this.isUsbConnect = false
          this.$notify({
            title: `初始化SerialPort.list失败：${err}`,
            message: '请重新连接USB线，然后刷新页面或重启设备',
            type: 'error',
            position: 'bottom-left',
            duration: 10000
          })
        })
    },

    /**
     * @description: 从user表获取用户数据，用于下拉框选项
     */
    getUserData() {
      const db = initDB()
      db.user
        .toArray()
        .then(res => {
          this.userArray = res
          // 获取分组（并去重）
          this.userGroupArray = []
          const obj = {} // 用于去重复
          for (let i = 0; i < this.userArray.length; i++) {
            if (!obj[this.userArray[i].userGroup]) {
              this.userGroupArray.push(this.userArray[i])
              obj[this.userArray[i].userGroup] = true
            }
          }
        })
        .catch(() => {
          this.$message({
            message: '获取user表用户数据失败，请刷新页面或重启设备',
            type: 'error'
          })
        })
    },

    /**
     * @description: 从action表获取训练动作数据，用于下拉框选项
     */
    getActionData() {
      const db = initDB()
      db.action
        .toArray()
        .then(res => {
          this.actionArray = res
        })
        .catch(() => {
          this.$message({
            message: '获取action表训练动作数据失败，请刷新页面或重启设备',
            type: 'error'
          })
        })
    },

    /**
     * @description: 获取loaclStorage的数据
     */
    getLocalStorageData() {
      // 从localStorage获取波特率
      this.scmBaudRate = parseFloat(window.localStorage.getItem('scmBaudRate'))
      // 从localStorage获取摩擦阻力值
      this.resistanceTrainWeight = parseFloat(
        window.localStorage.getItem('resistanceTrainWeight')
      )
      // 从localStorage获取后端配重值
      this.balanceWeight = parseFloat(
        window.localStorage.getItem('balanceWeight')
      )
      // 从localStorage获取前端配重值
      this.heavyWeight = parseFloat(window.localStorage.getItem('heavyWeight'))
      // 从localStorage获取人员设定的峰值功率百分比
      this.maxPowerPercent = parseFloat(
        window.localStorage.getItem('maxPowerPercent')
      )
    },

    /**
     * @description: 打开串口连接按钮
     */
    handleOpenUsb() {
      if (this.recordData.userId) {
        if (this.recordData.actionId) {
          if (!this.usbPort.isOpen) {
            this.isDataConnect = true // 数据通讯状态
            this.trainCount = 0 // 重复次数清零
            this.tireValue = 0 // 功率百分比清零
            this.everyMaxPowerArray = [] // 清空前几次峰值功率数组
            this.clearSerialData() // 清空数据
            this.initVuex() // 清空Vuex
            setTimeout(() => {
              this.initVuex() // 清空Vuex
            }, 500)
            this.usbPort.open()
          }
        } else {
          this.$confirm('训练动作不能为空，请选择训练动作', '警告', {
            type: 'warning',
            center: true,
            showConfirmButton: true,
            showCancelButton: false
          })
            .then(() => {})
            .catch(() => {})
        }
      } else {
        this.$confirm('用户名不能为空，请选择当前用户', '警告', {
          type: 'warning',
          center: true,
          showConfirmButton: true,
          showCancelButton: false
        })
          .then(() => {})
          .catch(() => {})
      }
    },

    /**
     * @description: 关闭串口连接按钮
     */
    handleCloseUsb() {
      if (this.usbPort.isOpen) {
        this.isDataConnect = false // 数据通讯状态
        this.usbPort.close()
      }
    },

    /**
     * @description: 数据初始化方法-清空该次的速度与位移数据
     */
    clearSerialData() {
      this.recordData.speedDataArray = []
      this.recordData.distanceDataArray = []
    },

    /**
     * @description: 验证输入的后端配重，如果为Undefined则赋值为0
     * @param {Number|Undefined} value 后端配重
     */
    handleCheckBalanceWeight(value) {
      if (!value) {
        this.balanceWeight = 0
      }
      // localStorage缓存每次的值
      window.localStorage.setItem('balanceWeight', value)
      this.countTrainWeight()
    },

    /**
     * @description: 验证输入的前端配重，如果为Undefined则赋值为0
     * @param {Number|Undefined} value 前端配重
     */
    handleCheckHeavyWeight(value) {
      if (!value) {
        this.heavyWeight = 0
      }
      // localStorage缓存每次的值
      window.localStorage.setItem('heavyWeight', value)
      this.countTrainWeight()
    },

    /**
     * @description: 下拉选项框-选择分组
     * @param {String|Undefined} value 当前分组
     */
    handleSelectUserGroup(value) {
      this.recordData.userId = '' // 把用户下拉框选项值清空一下
      this.recordData.userGroup = value
      // 筛选出当前分组的用户
      this.userShowArray = this.userArray.filter(item => {
        if (item.userGroup === value) {
          return item
        }
      })
    },

    /**
     * @description: 下拉选项框-选择当前用户
     * @param {String|Undefined} value 当前用户id
     */
    handleSelectUser(value) {
      this.trainCount = 0 // 重复次数清零
      this.tireValue = 0 // 功率百分比清零
      this.everyMaxPowerArray = [] // 清空前几次峰值功率数组
      this.recordData.userId = value
    },

    /**
     * @description: 下拉选项框-选择训练动作
     * @param {String|Undefined} value 当前训练动作
     */
    handleSelectTrainAction(value) {
      this.trainCount = 0 // 重复次数清零
      this.tireValue = 0 // 功率百分比清零
      this.everyMaxPowerArray = [] // 清空前几次峰值功率数组
      this.recordData.actionId = value
    },

    /**
     * @description: 最终负重[kg]=前端自身重 - (后端总负重 / 3.3) + 前端配重 + 摩擦阻力 + 固定向上油压阻力
     */
    countTrainWeight() {
      this.recordData.trainWeight = parseFloat(
        (
          58 -
          parseFloat(((this.balanceWeight + 20) / 3.3).toFixed(0)) +
          this.heavyWeight +
          this.resistanceTrainWeight +
          1
        ).toFixed(2)
      )
    },

    /**
     * @description: 初始化Vuex中的recordData数据
     */
    initVuex() {
      this.$store.dispatch('changeRecordData', {
        speedDataArray: [],
        distanceDataArray: [],
        powerDataArray: [],
        maxSpeed: 0,
        maxPower: 0,
        averageSpeed: 0,
        averagePower: 0
      })
    },

    /**
     * @description: 默认功率低于90%发出提示音
     */
    audioTip() {
      this.$refs.audio.currentTime = 0 // 从头开始播放提示音
      this.$refs.audio.play() // 播放
    }
  }
}
</script>

<style lang="scss" scoped>
.train-normal-container {
  width: 100%;
  height: 100%;

  /* 左半区 */
  .left-container {
    height: 100%;
    border-right: 2px solid #aaa8a8;
    display: flex;
    flex-direction: column;
    .finaldata-area {
      flex-grow: 1;
    }
  }

  /* 中半区 */
  .center-container {
    height: 100%;
    border-right: 2px solid #aaa8a8;
    display: flex;
    flex-direction: column;

    .control-area {
      display: flex;
      justify-content: space-between;

      .control-area-left {
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e2dede;
      }
      .control-area-right {
        padding-right: 5px;
      }
    }
    .linechart-area-one {
      flex-grow: 1;
    }
  }

  /* 右半区 */
  .right-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .input-number-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      .input-number-area-first {
        display: flex;
      }
      .input-number-area-second {
        display: flex;
        margin-top: 20px;
        margin-bottom: 5px;
      }
    }
    .linechart-area-two {
      flex-grow: 1;
    }
  }
}
</style>

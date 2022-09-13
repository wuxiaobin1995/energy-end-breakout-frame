<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-09-22 14:55:44
 * @Description : CurrentTable子组件
-->
<template>
  <div class="container">
    <!-- 控制区域 -->
    <div class="control-container">
      <el-form :inline="true" label-width="80px">
        <!-- 分组下拉框 -->
        <el-form-item label="分组:">
          <el-select
            v-model="userGroup"
            placeholder="选择分组"
            @change="handleSelectUserGroup"
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
        <el-form-item label="用户:">
          <el-select
            v-model="userId"
            placeholder="选择用户"
            @change="handleSelectUser"
          >
            <el-option
              v-for="(item, index) in userIdArray"
              :key="index"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 日期选择器 -->
        <el-form-item label="筛选日期:">
          <el-date-picker
            v-model="selectDateValue"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            :editable="false"
            :clearable="false"
            :unlink-panels="true"
            align="center"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            :disabled="this.loading"
            @click="handleCheckTrainData"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 导出Excel按钮 -->
      <el-button
        type="success"
        icon="el-icon-upload"
        :disabled="this.loading"
        :loading="exportLoading"
        @click="handleExportExcel"
        >导 出 表 格 Excel</el-button
      >
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      element-loading-text="数据加载中，请耐心等待......"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      style="width: 100%;"
      height="82vh"
      highlight-current-row
      :border="true"
    >
      <!-- No -->
      <el-table-column type="index" label="No" width="50" />
      <!-- 模式 -->
      <el-table-column prop="mode" label="模式" width="50" sortable />
      <!-- 查看按钮 -->
      <el-table-column label="查看操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleCheckChart(scope.$index, scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <!-- 记录时间 -->
      <el-table-column
        prop="currentTime"
        label="记录时间"
        width="160"
        sortable
      />
      <!-- 负重 -->
      <el-table-column
        prop="trainWeight"
        label="负重[kg]"
        width="60"
        sortable
      />
      <!-- 运动距离 -->
      <el-table-column
        prop="relativeDistance"
        label="运动距离[mm]"
        width="80"
        sortable
      />
      <!-- 平均功率 -->
      <el-table-column
        prop="averagePower"
        label="平均功率[W]"
        width="100"
        sortable
      />
      <!-- 平均速度 -->
      <el-table-column
        prop="averageSpeed"
        label="平均速度[m/s]"
        width="80"
        sortable
      />
      <!-- 峰值功率 -->
      <el-table-column
        prop="maxPower"
        label="峰值功率[W]"
        width="100"
        sortable
      />
      <!-- 峰值速度 -->
      <el-table-column
        prop="maxSpeed"
        label="峰值速度[m/s]"
        width="80"
        sortable
      />
      <!-- 训练动作 -->
      <el-table-column prop="actionId" label="训练动作" width="120" sortable />
      <!-- 用户名 -->
      <el-table-column prop="userId" label="用户名" width="80" />
      <!-- 分组 -->
      <el-table-column prop="userGroup" label="分组" width="80" />
      <!-- 删除按钮 -->
      <el-table-column label="删除操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 图形弹窗 -->
    <el-dialog
      title="图形显示"
      :visible.sync="dialogVisible"
      width="70%"
      top="5vh"
    >
      <!-- LineChartOne子组件 -->
      <div :style="{ height: '50vh' }">
        <show-chart-one :rowData="rowData" />
      </div>
      <!-- LineChartTwo子组件 -->
      <div :style="{ height: '50vh' }">
        <show-chart-two :rowData="rowData" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* indexDB数据库 */
import { initDB } from '@/db/index.js'

/* 子组件 */
import ShowChartOne from '@/views/data-record/components/ShowChart/ShowChartOne.vue'
import ShowChartTwo from '@/views/data-record/components/ShowChart/ShowChartTwo.vue'

export default {
  name: 'CurrentTable',

  components: {
    ShowChartOne,
    ShowChartTwo
  },

  data() {
    return {
      userId: '', // 用户id
      userGroup: '', // 所属分组
      userArray: [], // 所有用户数据（即user表）
      userIdArray: [], // 根据所选分组的对应用户
      userGroupArray: [], // 所有分组数据（已去重复）
      tableData: [], // 表格数据
      selectDateValue: [], // 日期选择器的筛选值
      /* 日期选择器快捷选项 */
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '该用户所有数据',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 36000)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      loading: false, // 表格加载动画
      exportLoading: false, // 导出表格按钮加载动画
      dialogVisible: false, // 控制图形弹窗的显隐
      rowData: {} // 传给子组件的那一行数据
    }
  },

  created() {
    this.getUserData() // 从user表获取所有用户数据，用于下拉框选项
  },

  methods: {
    /**
     * @description: 从user表获取所有用户数据，用于下拉框选项
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
     * @description: 从train_data表获取数据（根据userGroup、userId和currentTime复合查询）
     */
    getTrainData() {
      if (this.selectDateValue.length !== 0 && this.userId) {
        const db = initDB()
        this.loading = true
        db.train_data
          .where(['userGroup', 'userId', 'currentTime'])
          .between(
            [this.userGroup, this.userId, this.selectDateValue[0]],
            [this.userGroup, this.userId, this.selectDateValue[1]],
            true,
            true
          )
          .toArray()
          .then(res => {
            this.tableData = res
          })
          .catch(() => {
            this.$message({
              message: '表格数据查询失败，请刷新页面或重启设备',
              type: 'error'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },

    /**
     * @description: 下拉选项框-选择分组
     * @param {String|Undefined} value 当前分组
     */
    handleSelectUserGroup(value) {
      this.userId = '' // 把用户下拉框选项值清空一下
      this.userGroup = value
      // 筛选出当前分组的用户
      this.userIdArray = this.userArray.filter(item => {
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
      this.userId = value
    },

    /**
     * @description: 查询按钮
     */
    handleCheckTrainData() {
      this.getTrainData()
    },

    /**
     * @description: 查看图形按钮
     * @param {Number} index 数据的下标，从0开始
     * @param {Object} row 选中的该行showTableData数据
     */
    handleCheckChart(index, row) {
      this.rowData = row
      this.dialogVisible = true
    },

    /**
     * @description: 删除按钮
     * @param {Number} index 数据的下标，从0开始
     * @param {Object} row 选中的该行showTableData数据
     */
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          const db = initDB()
          db.train_data
            .where({ userId: row.userId, currentTime: row.currentTime })
            .delete()
            .then(() => {
              this.$message({
                message: '删除数据成功',
                type: 'success'
              })
            })
            .catch(() => {
              this.$message({
                message: '删除数据失败',
                type: 'error'
              })
            })
            .finally(() => {
              this.getTrainData() // 重新初始化表格
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 导出Excle表逻辑
     */
    handleExportExcel() {
      if (!this.tableData.length) {
        this.$message({
          message: '表格数据不能为空',
          type: 'error'
        })
        return
      }
      this.exportLoading = true
      // 此处使用懒加载的方式
      import('@/utils/Export2Excel.js')
        .then(excel => {
          const excelTitle = {
            mode: '模式',
            userId: '用户名',
            userGroup: '分组',
            actionId: '训练动作',
            currentTime: '记录时间',
            trainWeight: '负重[kg]',
            relativeDistance: '运动距离[mm]',
            maxPower: '峰值功率[W]',
            maxSpeed: '峰值速度[m/s]',
            averagePower: '平均功率[W]',
            averageSpeed: '平均速度[m/s]'
          }
          const tHeader = Object.values(excelTitle)
          // 会根据key键的顺序、属性值等动态变化
          const filterVal = Object.keys(excelTitle)
          const exportData = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel({
            header: tHeader, // 表头 必填
            data: exportData, // 具体数据 必填
            filename: `[${this.userId}]训练数据表 ${this.$moment().format(
              'YYYY-MM-DD HH_mm_ss'
            )}`, // 非必填
            autoWidth: true, // 非必填
            bookType: this.exportFormat // 非必填
          })
        })
        .then(() => {
          this.$message({
            message: '导出表格成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.$message({
            message: '导出表格失败：' + err,
            type: 'error'
          })
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    /**
     * @description: 数据格式化
     * @param {Array} filterVal key键
     * @param {Array} jsonData 一维数据 [{},{},...]
     * @return {Array} 二维数组 [[],[],...]
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .control-container {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 5px 0;
  }
}
</style>

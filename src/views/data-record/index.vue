<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-09-11 15:53:51
 * @Description : 数据记录页
-->
<template>
  <!-- CurrentTable表格子组件 -->
  <current-table />
</template>

<script>
/* 子组件 */
import CurrentTable from '@/views/data-record/components/CurrentTable/CurrentTable.vue'

export default {
  name: 'data-record',

  components: {
    CurrentTable
  }
}
</script>

<style lang="scss" scoped></style>

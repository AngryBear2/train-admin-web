<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <el-input v-model="orderId" placeholder="查询订单编号" />
      </el-col>
      <el-col :span="8">
        <el-button type="primary" round @click="selectOrder">搜索</el-button>
      </el-col>

      <!-- 火车列表区域 -->
      <el-table :data="orderInfo" highlight-current-row style="width: 100% ;margin-top: 40px">
        <el-table-column prop="orderId" label="订单号" width="150px" />
        <el-table-column prop="userPhoneNumber" label="用户手机号" width="150px" />
        <el-table-column prop="passengerIdNumber" label="乘客编号" width="150px" />
        <el-table-column prop="passengerPhoneNumber" label="乘客手机号" width="150px" />
        <el-table-column prop="tId" label="车次" width="150px" />
        <el-table-column prop="carriageNo" label="车厢号" width="150px" />
        <el-table-column prop="seatNo" label="座位号" width="150px" />
        <el-table-column prop="startStationName" label="起始站" width="150px" />
        <el-table-column prop="endStationName" label="终点站" width="150px" />
        <el-table-column prop="orderCreateTime" label="订单创建时间" width="150px" />
      </el-table>

    </el-row>
  </div>
</template>

<script>
import { allOrder, orderById } from '@/api/order'
const dayjs = require('dayjs')
export default {
  data() {
    return {
      orderId: '',
      orderInfo: [],
      form: {
      }
    }
  },
  created() {
    this.orderList()
  },
  methods: {
    orderList() {
      allOrder().then((response) => {
        this.orderInfo = response
        this.formatTime()
      }).catch((error) => {
        console.error(error)
      })
    },
    selectOrder() {
      if (this.orderId !== '') {
        orderById(this.orderId).then((response) => {
          this.orderInfo = []
          if (response !== '') {
            this.orderInfo.push(response)
            this.formatTime()
          }
        }).catch((error) => {
          console.error(error)
        })
      }
    },
    formatTime() {
      console.log(this.orderInfo)
      if (this.orderInfo.length !== 0) {
        for (const order of this.orderInfo) {
          const createTime = dayjs(order.orderCreateTime)
          order.orderCreateTime = createTime.format('YYYY-DD-MM HH:mm:ss')
        }
      }
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>


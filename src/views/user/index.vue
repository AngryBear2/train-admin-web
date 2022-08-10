<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <el-input v-model="phone" placeholder="请输入要查询的用户手机号" />
      </el-col>
      <el-col :span="8">
        <el-button type="primary" round @click="userByPhone">搜索</el-button>
      </el-col>

      <!-- 火车列表区域 -->
      <el-table :data="userList" highlight-current-row style="width: 100% ;margin-top: 40px">
        <el-table-column prop="userId" label="用户编号" width="150px" />
        <el-table-column prop="uName" label="用户名" width="150px" />
        <el-table-column prop="uRealname" label="真实姓名" width="150px" />
        <el-table-column prop="uGender" label="性别" width="150px" />
        <el-table-column prop="uType" label="用户类型" width="150px" />
        <el-table-column prop="uPhone" label="手机号码" width="150px" />
        <el-table-column prop="uEmail" label="邮箱号" width="150px" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-row>
  </div>
</template>

<script>

import { userList, findUserByPhone, deleteUser } from '@/api/user'
export default {
  data() {
    return {
      userList: [],
      phone: ''
    }
  },
  created() {
    this.allUser()
  },
  methods: {
    allUser() {
      userList().then((response) => {
        this.userList = response
        this.formatUser()
      }).catch((error) => {
        console.error(error)
      })
    },
    userByPhone() {
      if (this.phone !== '') {
        findUserByPhone().then((response) => {
          this.userList = []
          this.userList.push(response)
          this.formatUser()
        }).catch((error) => {
          console.error(error)
        })
      }
    },
    formatUser() {
      for (const user of this.userList) {
        if (user.uGender === 0) {
          user.uGender = '女'
        } else {
          user.uGender = '男'
        }
        if (user.uType === 0) {
          user.uType = '普通用户'
        } else {
          user.uType = '管理员'
        }
      }
    },
    handleDelete(user) {
      deleteUser(user.userId).then((response) => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.allUser()
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <el-input v-model="tId" placeholder="请输入要查询的列车车次" />
      </el-col>
      <el-col :span="8">
        <el-button type="primary" round @click="showById">搜索</el-button>
        <el-button type="primary" round @click="outerVisible=true">添加车次</el-button>
      </el-col>

      <el-dialog title="添加车次" :visible.sync="outerVisible" width="90%">
        <el-dialog
          width="80%"
          title="添加站点"
          :visible.sync="innerVisible"
          append-to-body
        >
          <el-form ref="insertStation" :model="insertStation" :rules="stationRules" label-width="120px">
            <el-form-item label="站点名" prop="stationName">
              <el-input v-model="insertStation.stationName" size="medium" style="width:200px" />
            </el-form-item>
            <el-form-item label="是否为终点">
              <el-radio v-model="insertStation.type" label="是">是</el-radio>
              <el-radio v-model="insertStation.type" label="否">否</el-radio>
            </el-form-item>
            <el-form-item label="到达日期类型" prop="arriveDayType">
              <el-select v-model="insertStation.arriveDayType" placeholder="请选择到达日期类型">
                <el-option label="当日到达" value="当日到达" />
                <el-option label="次日到达" value="次日到达" />
              </el-select>
            </el-form-item>
            <el-form-item label="到达时间" prop="arriveTime">
              <el-time-picker v-model="insertStation.arriveTime" placeholder="选择时间" format="HH:mm" />
            </el-form-item>
            <el-form-item v-if="insertStation.type==='否'" prop="startTime" label="发车时间">
              <el-time-picker v-model="insertStation.startTime" placeholder="选择时间" format="HH:mm" />
            </el-form-item>
            <el-form-item v-if="insertStation.type==='否'" prop="runningTime" label="距离下一站时间">
              <el-time-picker v-model="insertStation.runningTime" placeholder="选择时间" format="HH:mm" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeStationDialog()">取 消</el-button>
            <el-button type="primary" @click="pushStation()">添加</el-button>
          </div>
        </el-dialog>
        <el-form ref="insertTrain" :rules="trainRules" :model="insertTrain" label-width="80px" inline>
          <el-form-item label="车次" prop="tid">
            <el-input v-model="insertTrain.tid" />
          </el-form-item>
          <el-form-item label="类型" prop="ttype">
            <el-select v-model="insertTrain.ttype" placeholder="请选择火车类型">
              <el-option label="动车" value="动车" />
              <el-option label="快速" value="快速" />
              <el-option label="直特" value="直特" />
            </el-select>
          </el-form-item>
          <el-form-item label="起始站" prop="tstartStation">
            <el-input v-model="insertTrain.tstartStation" />
          </el-form-item>
          <el-form-item label="终点站" prop="tendStation">
            <el-input v-model="insertTrain.tendStation" />
          </el-form-item>
          <el-form-item label="起止时间" required>
            <el-time-picker v-model="insertTrain.tstarttime" placeholder="选择时间" format="HH:mm" />
            -
            <el-time-picker v-model="insertTrain.tendtime" placeholder="选择时间" format="HH:mm" />
          </el-form-item>
          <el-form-item label="到达日期" prop="tarrivalTime">
            <el-select v-model="insertTrain.tarrivalTime" placeholder="请选择到达日期">
              <el-option label="当日到达" value="当日到达" />
              <el-option label="次日到达" value="次日到达" />
            </el-select>
          </el-form-item>
          <el-form-item label="站点列表">
            <el-button type="primary" @click="showAddStation(index)">添加站点</el-button>
            <el-table :data="insertTrain.tParkingStations" highlight-current-row>
              <el-table-column prop="stationName" label="站点名" width="150px" />
              <el-table-column prop="arriveDayType" label="到达日期类型" width="150px" />
              <el-table-column prop="arriveTime" label="到达时间" width="150px" />
              <el-table-column prop="startTime" label="发车时间" width="150px" />
              <el-table-column prop="runningTime" label="距离下一站时间" width="150px" />
              <el-table-column label="插入" width="150px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="showAddStation(scope.$index+1)"
                  >插入下一站</el-button>
                </template>
              </el-table-column>
              <el-table-column label="删除" width="150px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteAddStation(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeTrainDialog()">取 消</el-button>
          <el-button type="primary" @click="addTrain()">提 交</el-button>
        </div>
      </el-dialog>

      <!-- 火车列表区域 -->
      <el-table :data="trainInfo" highlight-current-row style="width: 100% ;margin-top: 40px">
        <el-table-column prop="tId" label="车次" width="150px" />
        <el-table-column prop="tType" label="列车类型" width="150px" />
        <el-table-column prop="tStartStation" label="始发站" width="150px" />
        <el-table-column prop="tEndStation" label="终点站" width="150px" />
        <el-table-column prop="tStarttime" label="开车时间" width="150px" />
        <el-table-column prop="tEndtime" label="到达时间" width="150px" />
        <el-table-column prop="tArrivalTime" label="到达日期" width="150px" />
        <el-table-column label="操作" width="300px">
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
import { allTrain, selectByTId, deleteTrain, insertTrain } from '@/api/train'
const _ = require('lodash')
const dayjs = require('dayjs')
export default {
  name: 'Dashboard',
  data() {
    return {
      index: -1,
      insertTrain: {
        tid: '',
        tstarttime: '',
        tendStation: '',
        tendtime: '',
        tarrivalTime: '',
        tstartStation: '',
        ttype: '',
        tParkingStations: []
      },
      insertStation: {
        tId: '',
        stationName: '',
        arriveDayType: '',
        arriveTime: '',
        startTime: '',
        runningTime: '',
        type: '否'
      },
      outerVisible: false,
      innerVisible: false,
      trainInfo: [
        {
          tid: '',
          tstarttime: '',
          tendStation: '',
          tendtime: '',
          tarrivalTime: '',
          tstartStation: '',
          ttype: ''
        }
      ],
      showList: false,
      tId: '',
      stationRules: {
        stationName: [
          { required: true, message: '请输入站点名', trigger: 'blur' }
        ],
        arriveDayType: [
          { required: true, message: '请选择到达日期类型', trigger: 'change' }
        ],
        arriveTime: [
          { type: 'date', required: true, message: '请选择到达时间', trigger: 'change' }
        ],
        startTime: [
          { type: 'date', required: true, message: '请选择发车时间', trigger: 'change' }
        ],
        runningTime: [
          { type: 'date', required: true, message: '请选择距离下一站时间', trigger: 'change' }
        ]
      },
      trainRules: {
        tid: [
          { required: true, message: '请输入车次', trigger: 'blur' }
        ],
        tstartStation: [
          { required: true, message: '请输入始发站', trigger: 'blur' }
        ],
        tendStation: [
          { required: true, message: '请输入终点站', trigger: 'blur' }
        ],
        tarrivalTime: [
          { required: true, message: '请输入到达日期类型', trigger: 'blur' }
        ],
        ttype: [
          { required: true, message: '请选择列车类型', trigger: 'change' }
        ]
      }

    }
  },
  created() {
    this.showAll()
  },
  methods:
  {
    addTrain() {
      this.$refs['insertTrain'].validate((valid) => {
        if (valid) {
          this.insertTrain.tStartTime = this.formatTime(this.insertTrain.tstarttime)
          this.insertTrain.tEndTime = this.formatTime(this.insertTrain.tendtime)
          insertTrain(this.insertTrain).then((response) => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.closeTrainDialog()
            this.showAll()
          }).catch((error) => {
            console.error(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatTime(time) {
      const createTime = dayjs(time)
      return createTime.format('HH:mm')
    },
    closeStationDialog() {
      this.insertStation.tId = ''
      this.insertStation.stationName = ''
      this.insertStation.arriveDayType = ''
      this.insertStation.arriveTime = ''
      this.insertStation.tstartStation = ''
      this.insertStation.startTime = ''
      this.insertStation.runningTime = ''
      this.insertStation.type = '否'
      this.index = -1
      this.innerVisible = false
    },
    closeTrainDialog() {
      this.$refs['insertTrain'].resetFields()
      this.insertTrain.tstarttime = ''
      this.insertTrain.tendtime = ''
      this.insertTrain.tParkingStations = []
      this.outerVisible = false
    },
    pushStation() {
      this.$refs['insertStation'].validate((valid) => {
        if (valid) {
          if (this.index === -1) {
            this.index = this.insertTrain.tParkingStations.length
          }
          if (this.insertStation.type === '否') {
            this.insertStation.startTime = this.formatTime(this.insertStation.startTime)
            this.insertStation.runningTime = this.formatTime(this.insertStation.runningTime)
          } else {
            this.insertStation.startTime = '---'
            this.insertStation.runningTime = '---'
          }
          this.insertStation.arriveTime = this.formatTime(this.insertStation.arriveTime)
          this.insertStation.tId = this.insertTrain.tid
          const tempStation = _.clone(this.insertStation)
          this.insertTrain.tParkingStations.splice(this.index, 0, tempStation)
          this.closeStationDialog()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteAddStation(index) {
      _.pullAt(this.insertTrain.tParkingStations, index)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },
    showAddStation(index) {
      if (this.insertTrain.tid === '') {
        this.$message('请先填写列车信息')
      } else {
        this.index = index
        this.innerVisible = true
        this.insertStation.tId = this.insertTrain.tid
      }
    },
    showAll() {
      allTrain().then((response) => {
        this.trainInfo = response
      }).catch((error) => {
        console.error(error)
      })
    },
    showById() {
      if (this.tId !== '') {
        selectByTId(this.tId).then((response) => {
          this.trainInfo = []
          this.trainInfo.push(response)
        }).catch((error) => {
          console.error(error)
        })
      }
    },
    handleDelete(train) {
      deleteTrain(train).then((response) => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.showAll()
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

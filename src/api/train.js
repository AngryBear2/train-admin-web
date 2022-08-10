import request from '@/utils/request'

export function allTrain() {
  return request({
    url: '/TrainInfoController/showAllTrainInfo',
    method: 'post'
  })
}

export function selectByTId(tId) {
  return request({
    url: '/TrainInfoController/trainByTId',
    method: 'get',
    params: { tId: tId }
  })
}

export function updateTrain(data) {
  return request({
    url: '/TrainInfoController/putTrain',
    method: 'put',
    data
  })
}

export function deleteTrain(data) {
  return request({
    url: '/TrainInfoController/deleteTrain',
    method: 'delete',
    data
  })
}

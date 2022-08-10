import request from '@/utils/request'

export function allOrder() {
  return request({
    url: '/OrderListController/SelectAllOrder',
    method: 'post'
  })
}

export function orderById(orderId) {
  return request({
    url: '/OrderListController/orderById',
    method: 'get',
    params: { orderId: orderId }
  })
}

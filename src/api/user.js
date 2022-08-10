import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/UserInfoController/loginAdmin',
    method: 'post',
    data
  })
}

export function userList() {
  return request({
    url: '/UserInfoController/allUser',
    method: 'get'
  })
}

export function findUserByPhone(phone) {
  return request({
    url: '/UserInfoController/userByPhone',
    method: 'get',
    params: { phone: phone }
  })
}

export function updateUser(data) {
  return request({
    url: '/UserInfoController/putUser',
    method: 'put',
    data
  })
}

export function deleteUser(userId) {
  return request({
    url: '/UserInfoController/deleteUser',
    method: 'delete',
    params: { userId: userId }
  })
}

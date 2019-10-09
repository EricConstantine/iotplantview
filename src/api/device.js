import axios from '@/libs/api.request'

export const getsensors = (param) => {
  return axios.request({
    url: '/iotplant/sensor/getsensors',
    params: {
      pid:param
    },
    method: 'post'
  })
}
export const initTree = () => {
  return axios.request({
    url: '/iotplant/device/pagedata?page=0&size=10000&sort=name,asc',
    method: 'get'
  })
}

export const devicemanage = (current,pagesize,sort,keywords) => {
  return axios.request({
    url: '/iotplant/device/mngpagedata',
    params: {
      page:current,
      current:pagesize,
      sort:sort,
      keywords:keywords
    },
    method: 'get'
  })
}
export const devicedelete = (usersids) => {
  return axios.request({
    url: '/iotplant/device/delete?deviceids='+ usersids,
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    method: 'delete'
  })
}
export const deviceshow = (id) => {
  return axios.request({
    url: '/iotplant/device/findById',
    params: {
      id:id 
    },
    method: 'get'
  })
}
export const deviceadd = (data) => {
  return axios.request({
    url: '/iotplant/device/saveDevice',
    headers:{'Content-Type': 'application/json;charset=utf-8'},
    data: data,
    method: 'post'
  })
}
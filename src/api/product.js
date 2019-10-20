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
//产品管理页面
export const productmanage = (current,pagesize,sort,keywords) => {
  return axios.request({
    url: '/iotplant/product/pagedata',
    params: {
      page:current,
      current:pagesize,
      sort:sort,
      keywords:keywords
    },
    method: 'get'
  })
}
//删除产品
export const productdelete = (usersids) => {
  return axios.request({
    url: '/iotplant/product/delete?productids='+ usersids,
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
//产品编辑
export const productadd = (data) => {
  return axios.request({
    url: '/iotplant/product/saveProduct',
    headers:{'Content-Type': 'application/json;charset=utf-8'},
    data: data,
    method: 'post'
  })
}
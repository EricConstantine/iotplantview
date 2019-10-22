import axios from '@/libs/api.request'

export const getnodes = (param) => {
  return axios.request({
    url: '/iotplant/node/getnodes',
    params: {
      pid:param
    },
    method: 'post'
  })
}
export const getProductTree = () => {
  return axios.request({
    url: '/iotplant/product/pagedata',
    method: 'get'
  })
}
//产品管理页面
export const productmanage = (current,pagesize,sort,keywords) => {
  return axios.request({
    url: '/iotplant/product/mngpagedata',
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
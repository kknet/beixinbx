/**
 * Created by liyigang on 2/11/2020.
 */
const host = 'http://120.78.84.243:9035'
const baseUrl = '/baoguanjia'
import Taro, { Component } from '@tarojs/taro'

function HttpConstructor(url, methods, data, headers) {
  return new Promise((reslove, reject) => {
    Taro.request({
      url: host + baseUrl + url,
      data: data,
      methods: methods,
      header: headers,
      success: (res) => {
        reslove(res)
      },
      error: (error) => {
        console.log('接口异常')
        reject(error)
      }
    })
  })
}
// http request 拦截器
const httpInstance = {
  post(url, data, headers) {
    return HttpConstructor(url, 'post', data, headers)
  },
  get() {
    return HttpConstructor(url, 'get', data, headers)
  }
}

export default httpInstance

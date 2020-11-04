/**
 * Created by liyigang on 2/11/2020.
 */
const host = 'http://120.78.84.243:9035'
const baseUrl = '/baoguanjia'
import Taro, { Component } from '@tarojs/taro'

function HttpConstructor(url, methods, data, headers) {
  return new Promise((reslove, reject) => {
    const headersObj = Object.assign({}, headers)
    const token = Taro.getStorage({
      key:'token'
    })
    headersObj.token = token
    Taro.request({
      url: host + baseUrl + url,
      data: data,
      method: methods,
      header: headersObj,
      success: (res) => {
        if(res.data.code === 50004) {
          reSetToken(url, methods, data, headers)
        }
        reslove(res)
      },
      error: (error) => {
        console.log('接口异常')
        reject(error)
      }
    })
  })
}

function refreshStorageToken() {
  let userInfo = Taro.getStorageSync('userInfo')
  return new Promise((reslove, reject) => {
    const loginData = Object.assign({}, userInfo)
    Taro.login({
      success: (res) => {
        loginData.code = res.code
        httpInstance.post('/app/wechat/loginOrRegist', loginData, {}).then((result) => {
          Taro.setStorageSync({
            key:'token',
            data:result.data
          })
          reslove()
        })
      }
    })
  })
}

function reSetToken(preUrl, preMethods, preData, preHeaders) {
  const loginData = {}
  Taro.login({
    success: (res) => {
      loginData.code = res.code
      httpInstance.post('/app/wechat/loginOrRegist', loginData, {}).then((result) => {
        Taro.setStorage({
          key:'token',
          data:result.data
        })
        httpInstance[preMethods](preUrl, preData, preHeaders)
      })
    }
  })
}
// http request 拦截器
const httpInstance = {
  refreshStorageToken: refreshStorageToken,
  host: host,
  baseUrl: baseUrl,
  post(url, data, headers) {
    return HttpConstructor(url, 'POST', data, headers)
  },
  get(url, data, headers) {
    return HttpConstructor(url, 'GET', data, headers)
  }
}

export default httpInstance

/**
 * Created by liyigang on 2/11/2020.
 */
// const host = 'http://120.78.84.243:9035'
const host = 'https://baoguanjia.ltd'
const baseUrl = '/baoguanjiatest'
import Taro, { Component } from '@tarojs/taro'

function HttpConstructor(url, methods, data, headers) {
  return new Promise((reslove, reject) => {
    const headersObj = Object.assign({}, headers)
    const token = Taro.getStorageSync('token')
    headersObj.token = token
    Taro.request({
      url: host + baseUrl + url,
      data: data,
      method: methods,
      header: headersObj,
      success: (res) => {
        if(res.data.code === 50004) {
          reSetToken(url, methods, data, headers).then(() => {
            HttpConstructor(url, 'post', data, headers).then((result) => {
              reslove(result)
            })
          })
          return
        }
        reslove(res)
      },
      error: (error) => {
        console.log('接口异常')
        Taro.showToast({
          title: `异常${error}`,
          icon: 'none',
          duration: 2000
        })
        reject(error)
      }
    })
  })
}

function refreshStorageToken() {
  let userInfo = Taro.getStorageSync('userInfo')
  return new Promise((reslove, reject) => {
    let userInfo = Object.assign({}, userInfo)
    Taro.login({
      success: (res) => {
        let submitData = {}
        submitData.avatar = userInfo.avatar
        submitData.city = userInfo.city
        submitData.code = res.code
        submitData.country = userInfo.country
        submitData.nickname = userInfo.nickname
        submitData.openId = Taro.getStorageSync('openId')
        submitData.province = userInfo.province
        submitData.unionId = userInfo.unionId
        submitData.wechat = userInfo.wechat
        httpInstance.post('/app/wechat/loginOrRegist', submitData, {}).then((result) => {
          Taro.setStorageSync('token', result.data.data.token)
          reslove()
        })
      }
    })
  })
}

function reSetToken(preUrl, preMethods, preData, preHeaders) {
  let userInfo = Taro.getStorageSync('userInfo')
  // const loginData = Object.assign({}, userInfo)
  return new Promise((reslove, reject) => {
    Taro.login({
      success: (res) => {
        // loginData.code = res.code
        let submitData = {}
        submitData.avatar = userInfo.avatar
        submitData.city = userInfo.city
        submitData.code = res.code
        submitData.country = userInfo.country
        submitData.nickname = userInfo.nickname
        submitData.openId = Taro.getStorageSync('openId')
        submitData.province = userInfo.province
        submitData.unionId = userInfo.unionId
        submitData.wechat = userInfo.wechat
        httpInstance.post('/app/wechat/loginOrRegist', submitData, {}).then((result) => {
          Taro.setStorageSync('token', result.data.data.token)
          reslove()
        })
      }
    })
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

import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import logoImg from '../../assets/images/logo_taro.png'
import './bxbx-home.css'

import Icon1 from './img/icon1.png'
import Icon2 from './img/icon2.png'
import Icon3 from './img/icon3.png'
import * as service from './services'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '保管家'
  }

  constructor () {
    super(...arguments)

    this.state = {
      autoHeight: '74%',
      isShowLogin: false,
        homeMenuIndex: {
            line1: [
                {
                    label: '保单保全',
                    icons: Icon1
                },
                {
                    label: '保险理赔',
                    icons: Icon2
                },
                {
                    label: '医疗绿道',
                    icons: Icon3
                }
            ]
        }
    }
  }

  async componentDidMount() {
    // await this.getOpenId()
    // this.getUserInfo()
    this.autoSetHeight()
    let token = Taro.getStorageSync('token')
    let authorize = Taro.getStorageSync('authorize')
    // 第一次进来没有授权的时候
    if(!authorize) {
      this.setState({
        isShowLogin: true
      })
    } else {
      this.refreshUserInfo()
    }
  }

  autoSetHeight() {
    Taro.getSystemInfo({
      success: (res) => {
        if(res.screenHeight > 800) {
          this.setState({
            autoHeight: '77%'
          })
        }
        console.log('获取信息', res)
      }
    })
  }

  // 分销商分享 客户点击进入
  shareBxOrder() {
    const shareId = this.$router.params.shareId
    const schemeId = this.$router.params.schemeId
    const buyCount = parseInt(this.$router.params.buyCount, 10)
    if(shareId) {
      Taro.navigateTo({
        url: `/pages/confirmOrder/index?type=${schemeId}&schemeId=${this.state.schemeId}&shareId=${shareId}&buyCount=${buyCount}`
      })
    }
  }

  goToShareArticleInfo() {
    const articleId = this.$router.params.articleId
    if(articleId) {
      Taro.navigateTo({
        url: `/pages/article/detail?id=${articleId}`
      })
    }
  }

  // 注册好友关系
  registerShareRecord() {
    const orderId = this.$router.params.orderId
    const userId = this.$router.params.userId
    const currentUserId = Taro.getStorageSync('userId').toString()
    const goUrl = this.$router.params.url
    if(orderId) {
      let shareObj = {
        orderId: orderId,
        userId: userId,
        sharedUserId: currentUserId
      }

      // 同一个人
      if(userId == currentUserId) {
        return
      }

      service.requestAddShareRecord(shareObj, {}).then((res) => {
        if(res.data.code === 80001) {
          return
        }
        Taro.showToast({
          title: '绑定关系成功',
          icon: 'success',
          duration: 2000
        })
        // Taro.navigateTo({
        //   // url: `/pages/panel/index?id=${id.toLowerCase()}`
        //   url: '/pages/my/page/myOrderDetail'
        // })
      })
    }
  }

  loginMethodsGetCode() {
    return new Promise((reslove, reject) => {
      Taro.login({
        success: (res) => {
          reslove(res)
        }
      })
    })
  }

  onShareAppMessage () {
    return {
      title: '朋友，这里可以做保单托管，以后你的保单就有人服务了。',
      path: '/pages/home/home',
      imageUrl: `${require('../../assets/images/share.png')}`
    }
  }

  gotoPanel = e => {
    const { id } = e.currentTarget.dataset
    Taro.navigateTo({
      // url: `/pages/panel/index?id=${id.toLowerCase()}`
      url: `/pages/${id.toLowerCase()}/index`
    })
  }

  goToDetailOrder = e => {
    Taro.navigateTo({
      // url: '/pages/startBxOrder/finishBd'
      url: `/pages/startBxOrder/index`
    })
  }

  goToPage = e => {
    let row = e.currentTarget.dataset.item
    let url = ''
    if(row.label === '保单保全') {
      url = '/pages/article/list?type=1'
    }
    if(row.label === '保险理赔') {
      url = '/pages/article/list?type=2'
    }
    if(row.label === '医疗绿道') {
      url = '/pages/article/list?type=3'
    }
    Taro.navigateTo({
      // url: `/pages/panel/index?id=${id.toLowerCase()}`
      url: url
    })
  }

  getOpenId() {
    const queryData = {}
    return new Promise((reslove, reject) => {
      Taro.login({
        success: (res) => {
          queryData.code = res.code
          service.requestGetOpenId(queryData, {}).then((result) => {
            Taro.setStorage({
              key:"openId",
              data:result.data.data.openid
            })
            Taro.setStorage({
              key:"sessionKey",
              data:result.data.data.session_key
            })
            queryData.openId = result.data.data.openid
            reslove(queryData)
          })
        }
      })
    })
  }

  async refreshUserInfo() {
    let submitData = {}
    const res2 = await this.getOpenId()
    let userInfo = Taro.getStorageSync('userInfo')
    const loginData = Object.assign({}, userInfo)
    loginData.openId = res2.openId
    loginData.code = res2.code

    submitData.avatar = userInfo.avatar
    submitData.city = userInfo.city
    submitData.code = res2.code
    submitData.country = userInfo.country
    submitData.nickname = userInfo.nickname
    submitData.openId = res2.openId
    submitData.province = userInfo.province
    submitData.unionId = userInfo.unionId
    submitData.wechat = userInfo.wechat

    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    service.LoginGetToken(submitData, {}).then((res) => {
      Taro.hideLoading()
      this.setState({
        isShowLogin: false
      })
      Taro.setStorageSync('token', res.data.data.token)
      Taro.setStorageSync('userId', res.data.data.userInfo.id)
      Taro.setStorageSync('userInfo', res.data.data.userInfo)

      this.registerShareRecord()
      this.shareBxOrder()
      this.goToShareArticleInfo()
    }, (err) => {
      Taro.showToast({
        title: `异常${err}`,
        icon: 'none',
        duration: 2000
      })
    })
  }

  getUserInfo = async (userInfo) => {
    let submitData = {}
    const res2 = await this.getOpenId()
    const loginData = Object.assign({}, userInfo.target.userInfo)
    loginData.openId = res2.openId
    loginData.code = res2.code

    Object.keys(loginData).forEach((item) => {
      submitData[item.toLowerCase()] = loginData[item]
    })
    submitData.avatar = submitData.avatarurl
    submitData.openId = submitData.openid
    delete submitData.openid
    delete submitData.avatarurl
    delete submitData.gender
    delete submitData.language

    // 记录已经授权过
    Taro.setStorageSync('authorize', true)
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    service.LoginGetToken(submitData, {}).then((res) => {
      Taro.hideLoading()
      this.setState({
        isShowLogin: false
      })
      Taro.setStorageSync('token', res.data.data.token)
      Taro.setStorageSync('userId', res.data.data.userInfo.id)
      Taro.setStorageSync('userInfo', res.data.data.userInfo)

      // 判断是否是分享进来的,若是进到对应的url
      this.registerShareRecord()
      this.shareBxOrder()
      this.goToShareArticleInfo()
    }, (err) => {
      Taro.showToast({
        title: `异常${err}`,
        icon: 'none',
        duration: 2000
      })
    })
  }

  render () {
    const { homeMenuIndex, isShowLogin, autoHeight } = this.state
    const { line } = homeMenuIndex

    return (
      <View className='bx-page'>
        {isShowLogin?
        <View>
          <View className="login-panel">
            <View className="login-panel-title">保管家授权</View>
            <View className="line" style={{marginBottom: '7px'}}></View>
            <Button
              className="login-button"
              size="mini"
              openType="getUserInfo"
              onGetUserInfo={this.getUserInfo}
            >
              登录授权
            </Button>
          </View>
          <View className="bg-wall">
          </View>
        </View>
            :
          ''
        }
        <View className="home-title-menu">
            {Object.keys(homeMenuIndex).map((v, k) => {
                return (
                    <View className="home-title-menu-row" key={`home-${k}`}>
                        {homeMenuIndex[v].map((item, index) => {
                            return (
                                <View key={`child-${index}`} className="home-title-menu-col" data-item={item} onClick={this.goToPage}>
                                    <Image className="home-title-menu-icons" src={item.icons} />
                                    <View style={{marginTop: '16rpx'}}>
                                        <Text>{item.label}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )
            })}
        </View>
        <View className="bx-home-content" style={{height: autoHeight}}>
            <View className="start-bx-button" onClick={this.goToDetailOrder}>
                <Image className="start-bx-button-image" src={require('./img/start_button.png')} />
                <View className="start-bx-button-text">
                    <Text>立马托管</Text>
                </View>
            </View>
        </View>
      </View>
    )
  }
}

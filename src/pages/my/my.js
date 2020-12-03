import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './my.scss'
import * as service from '../home/services'

export default class myIndex extends Taro.Component {
  config = {
    navigationBarTitleText: '我的'
  }

  constructor () {
    super(...arguments)

    this.state = {
      userInfo: Taro.getStorageSync('userInfo'),
      autoHeight: '97%'
    }
    this.isCanClick = true
  }

  componentDidMount() {
    this.autoSetHeight()
  }

  onShareAppMessage () {
    return {
      title: '朋友，这里可以做保单托管，以后你的保单就有人服务了。',
      path: '/pages/home/home',
      imageUrl: `${require('../../assets/images/share.png')}`
    }
  }

  autoSetHeight() {
    Taro.getSystemInfo({
      success: (res) => {
        if(res.screenHeight > 800) {
          this.setState({
            autoHeight: '98%'
          })
        }
        console.log('获取信息', res)
      }
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

  getUserInfoByStartButton = async (userInfo) => {
    if(Taro.getStorageSync('authorize')) {
      let routerType = userInfo.currentTarget.dataset.url
      Taro.navigateTo({
        url: `${routerType}`
      })
      return
    }
    if(!this.isCanClick) return
    this.isCanClick = false
    if(userInfo.detail.userInfo) {
      Taro.showLoading({
        title: Taro.loadingText,
        mask: true
      })
      let submitData = {}
      const res2 = await this.getOpenId()
      const loginData = Object.assign({}, userInfo.detail.userInfo)
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
      service.LoginGetToken(submitData, {}).then((res) => {
        this.setState({
          isShowLogin: false
        })
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userId', res.data.data.userInfo.id)
        Taro.setStorageSync('userInfo', res.data.data.userInfo)

        //  去订单详情
        setTimeout(() => {
          Taro.hideLoading()
          this.isCanClick = true

          this.setState({
            userInfo: Taro.getStorageSync('userInfo')
          })
          //  去订单详情
          let routerType = userInfo.currentTarget.dataset.url
          if(routerType === 'current') {

          } else {
            Taro.navigateTo({
              url: `${routerType}`
            })
          }
        }, 100)
      }, (err) => {
        Taro.showToast({
          title: `异常${err}`,
          icon: 'none',
          duration: 2000
        })
      })
    } else {
      this.isCanClick = true
    }
  }
    

  render () {
    const {userInfo, autoHeight} = this.state
    return (
      <View className='bx-page'>
        <View className="my-container" style={{margin: '20rpx 0 20rpx 0', height: autoHeight}}>
            <View className="avator-section">
              <Button
                className="my-contact-button"
                openType="getUserInfo"
                onGetUserInfo={this.getUserInfoByStartButton}
                data-url="current"
              >
                <View className="avator-row">
                    {userInfo?<OpenData className="avator-icons avator-image" type='userAvatarUrl' />
                      : <Image src={require('./image/ava-default.png')} className="avator-icons avator-image" />
                    }
                    <View>
                        <Text className="avator-name">{userInfo.nickname?userInfo.nickname: '点击登录账户'}</Text>
                    </View>
                </View>
              </Button>
            </View>

            <View className="my-menu-section">
              <Button
                className="my-contact-button"
                openType="getUserInfo"
                onGetUserInfo={this.getUserInfoByStartButton}
                data-url="/pages/my/page/myOrder"
              >
                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/my-order.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">我的保单</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>
              </Button>
                
                <View className="line"></View>

              <Button
                className="my-contact-button"
                openType="getUserInfo"
                onGetUserInfo={this.getUserInfoByStartButton}
                data-url="/pages/startBxOrder/finishBd?type=report"
              >
                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/my-order.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">保单报告</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>
              </Button>

                <View className="line"></View>

              <Button openType="contact" className="my-contact-button">
                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/kf.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">联系客服</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>
              </Button>

                <View className="line"></View>

              {userInfo.role != 0?
                <Button
                  className="my-contact-button"
                  openType="getUserInfo"
                  onGetUserInfo={this.getUserInfoByStartButton}
                  data-url="/pages/my/page/myCustom"
                >
                  <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                      <Image src={require('./image/kh.png')} className="my-menu-icons" />
                      <Text className="my-menu-content">我的客户</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                  </View>
                </Button>
                : ''}

              {userInfo.role != 0?
                <View className="line"></View>
                : ''}

                <Button openType="share" className="my-contact-button">
                  <View className="my-menu-row">
                      <View style={{display: 'flex', alignItems: 'center'}}>
                          <Image src={require('./image/share.png')} className="my-menu-icons" />
                          <Text className="my-menu-content">分享好友</Text>
                      </View>

                      <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                  </View>
                </Button>

                <View className="line"></View>
            </View>
        </View>
      </View>
    )
  }
}

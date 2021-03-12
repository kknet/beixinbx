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

    this.isCanClick = true
  }

  async componentDidMount() {
    // await this.getOpenId()
    // this.getUserInfo()
	  // 分享的参数, 有则证明是分享进来的
	  const {shareId, articleId, isShare} = this.$router.params
	  if(shareId || articleId || isShare) {
		  Taro.setStorageSync('resource', 2)
	  } else {
		  Taro.setStorageSync('resource', 1)
	  }
    this.autoSetHeight()
    let token = Taro.getStorageSync('token')
    let authorize = Taro.getStorageSync('authorize')
    // 第一次进来没有授权的时候
    if(!authorize) {
      const {orderId} = this.$router.params
      if(orderId) {
        this.setState({
          isShowLogin: true
        })
      }
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
      }
    })
  }

  // 分销商分享 客户点击进入
  shareBxOrder() {
    const shareId = this.$router.params.shareId
    const schemeId = this.$router.params.schemeId
    const buyCount = parseInt(this.$router.params.buyCount, 10)
	  let authorize = Taro.getStorageSync('authorize')
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
        url: `/pages/web/articleWebview?articleId=${articleId}`
      })
    }
  }

  // 注册好友关系
  registerShareRecord() {
    const {orderId, userId, schemeId, buyCount, currentTab, total, current} = this.$router.params
    const currentUserId = Taro.getStorageSync('userId').toString()

    if(orderId) {
      let shareObj = {
        orderId: orderId,
        userId: userId,
        sharedUserId: currentUserId
      }

      console.log(orderId, userId, schemeId, buyCount, currentTab, total, current)
      // 同一个人
      if(userId == currentUserId) {
        Taro.navigateTo({
          url: `/pages/my/page/myOrderDetail?orderId=${orderId}&schemeId=${schemeId}&buyCount=${buyCount}&clickTab=${currentTab}&total=${total}&current=${current}`
        })
        return
      }

      service.requestAddShareRecord(shareObj, {}).then((res) => {
        if(res.data.code === 80001) {
          Taro.navigateTo({
            url: `/pages/my/page/myOrderDetail?orderId=${orderId}&schemeId=${schemeId}&buyCount=${buyCount}&clickTab=${currentTab}&total=${total}&current=${current}`
          })
          return
        }
        Taro.showToast({
          title: '绑定关系成功',
          icon: 'success',
          duration: 2000
        })
        Taro.navigateTo({
          url: `/pages/my/page/myOrderDetail?orderId=${orderId}&schemeId=${schemeId}&buyCount=${buyCount}&clickTab=${currentTab}&total=${total}&current=${current}`
        })
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
      path: '/pages/home/home?isShare=1',
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
            Taro.setStorageSync("openId", result.data.data.openid)
            Taro.setStorageSync("sessionKey", result.data.data.session_key)
            Taro.setStorageSync("unionid", result.data.data.unionid)
            queryData.openId = result.data.data.openid
            queryData.unionId = result.data.data.unionid
            console.log('queryData', queryData)
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
    submitData.unionId = res2.unionId
    submitData.province = userInfo.province
    submitData.wechat = userInfo.wechat

	  // submitData.resource = Taro.getStorageSync('resource').toString() // 来源

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
    if(!this.isCanClick) return
    this.isCanClick = false
    if(userInfo.detail.userInfo) {
      let submitData = {}
      const res2 = await this.getOpenId()
      const loginData = Object.assign({}, userInfo.detail.userInfo)
      loginData.openId = res2.openId
      loginData.code = res2.code
	    loginData.resource = Taro.getStorageSync('resource').toString() // 来源

      Object.keys(loginData).forEach((item) => {
        submitData[item.toLowerCase()] = loginData[item]
      })
      submitData.avatar = submitData.avatarurl
      submitData.openId = submitData.openid
      submitData.unionId = res2.unionId

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
        setTimeout(() => {
          Taro.hideLoading()
          this.isCanClick = true
          // 判断是否是分享进来的,若是进到对应的url
          this.registerShareRecord()
          this.shareBxOrder()
          this.goToShareArticleInfo()
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

  getUserInfoByStartButton = async (userInfo) => {
    if(Taro.getStorageSync('authorize')) {
      //  去订单详情
      this.goToDetailOrder()
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
      submitData.unionId = res2.unionId
	    submitData.resource = Taro.getStorageSync('resource').toString() // 来源

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

        setTimeout(() => {
          Taro.hideLoading()
          this.isCanClick = true
          //  去订单详情
          // this.goToDetailOrder()
	        this.registerShareRecord()
	        this.shareBxOrder()
	        this.goToShareArticleInfo()
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
            <View className="start-bx-button">
                <Button
                  className="login-start-button"
                  size="mini"
                  openType="getUserInfo"
                  onGetUserInfo={this.getUserInfoByStartButton}
                >
                  <Image className="start-bx-button-image" src={require('./img/start_button.png')} />
                  <View className="start-bx-button-text">
                    <Text>立马托管</Text>
                  </View>
                </Button>
            </View>
        </View>
      </View>
    )
  }
}

import Taro from '@tarojs/taro'
import { View, Image, OfficialAccount } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import * as service from './services'
import logoImg from '../../assets/images/logo_taro.png'
import './register.scss'

export default class RegisterIndex extends Taro.Component {
  config = {
    navigationBarTitleText: '注册'
  }

  constructor () {
    super(...arguments)

    this.state = {
      autoHeight: '74%',
      isShowLogin: false
    }
    this.isCanClick = true
  }

  async componentDidMount() {
    let authorize = Taro.getStorageSync('authorize')
    // 已授权
    if(authorize) {
      this.goToHomePage()
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

  getUserInfoForRegister = async (userInfo) => {
    if(!this.isCanClick) return
    this.isCanClick = false
    console.log('userinfo', userInfo)
    if(userInfo.detail.userInfo) {
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
      Taro.showLoading({
        title: Taro.loadingText,
        mask: true
      })
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
          // 判断是否是分享进来的,若是进到对应的url
          this.registerShareRecord()
          this.shareBxOrder()
          this.goToShareArticleInfo()
          this.goToHomePage()
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

  goToHomePage() {
    Taro.switchTab({
      // url: '/pages/startBxOrder/finishBd'
      url: `/pages/home/home`
    })
  }

  render () {

    return (
      <View className='bx-page register-page'>
        <Image src={require('./image/bg.png')} className="bg-image" />
        <Button
          className="login-button"
          size="mini"
          openType="getUserInfo"
          onGetUserInfo={this.getUserInfoForRegister}
        >
          开始托管
        </Button>
      </View>
    )
  }
}

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
	    isLoadingFile: false,
      userInfo: Taro.getStorageSync('userInfo'),
      autoHeight: '97%',
	    downLoadPercent: 0
    }
    this.isCanClick = true
  }

  componentDidMount() {
    this.autoSetHeight()
  }

  onShareAppMessage () {
    return {
      title: '朋友，这里可以做保单托管，以后你的保单就有人服务了。',
      path: '/pages/home/home?isShare=1',
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
            Taro.setStorageSync("openId", result.data.data.openid)
            Taro.setStorageSync("sessionKey", result.data.data.session_key)
            Taro.setStorageSync("unionid", result.data.data.unionid)
            queryData.openId = result.data.data.openid
            queryData.unionId = result.data.data.unionid
            reslove(queryData)
          })
        }
      })
    })
  }

  getUserInfoByStartButton = async (userInfo) => {
    if(Taro.getStorageSync('authorize')) {
      let routerType = userInfo.currentTarget.dataset.url
      if(routerType === 'report') {
        this.getReport()
      } else {
        Taro.navigateTo({
          url: `${routerType}`
        })
      }
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
      submitData.unionId = res2.unionId
      submitData.avatar = submitData.avatarurl
      submitData.openId = submitData.openid
	    submitData.resource = Taro.getStorageSync('resource').toString()

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
            console.log(routerType)
            if(routerType === 'report') {
              this.getReport()
            } else {
              Taro.navigateTo({
                url: `${routerType}`
              })
            }
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

  getReport() {
    let currentUserId = Taro.getStorageSync('userId').toString()
    let params = {
      userId: currentUserId
    }

    service.getReportService(params, {}).then((res) => {
	    console.log('数据', res.data.data)
	    if(res.data.data === '' || res.data.data === null) {
		    Taro.showToast({
			    title: `您暂无保单报告`,
			    icon: 'none',
			    duration: 2000
		    })
		    return
	    } else {
		    Taro.navigateTo({
			    url: `/pages/web/webview`
		    })
	    }
	    
	    return
      this.setState({
        reportImage: res.data.data || ""
      }, () => {
	      Taro.showLoading({
		      title: Taro.loadingText,
		      mask: true
	      })
	      this.setState({
		      isLoadingFile: true
	      })
        const downLoadTask = wx.downloadFile({
          url: res.data.data, //仅为示例，并非真实的资源
          success: (res1) => {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res1.statusCode === 200) {
              Taro.openDocument({
                filePath: res1.tempFilePath,
                success: (res2) => {
	                Taro.hideLoading()
	                this.setState({
		                isLoadingFile: false
	                })
                },
	              fail: function(err) {
		              console.log('网络异常', err)
		              Taro.showToast({
			              title: `网络异常`,
			              icon: 'none',
			              duration: 2000
		              })
		              Taro.hideLoading()
	              }
              })
            }
          },
	        fail: function(error) {
		        console.log('网络异常', error)
		        Taro.showToast({
			        title: `网络异常`,
			        icon: 'none',
			        duration: 2000
		        })
		        Taro.hideLoading()
	        }
        })
	      downLoadTask.onProgressUpdate((res) => {
		      this.setState({
			      downLoadPercent: res.progress
		      })
	      })
      })
    })
  }


  render () {
    const {userInfo, autoHeight, downLoadPercent, isLoadingFile} = this.state
    return (
      <View className='bx-page'>
	      {isLoadingFile && <View className='download-percent'>
		      <Text>进度: {downLoadPercent}%</Text>
	      </View>}
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
                data-url="report"
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

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
      isShowLogin: false,
        homeMenuIndex: {
            line1: [
                {
                    label: '保单保全',
                    icons: Icon1
                },
                {
                    label: '申请理赔',
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
    let token = Taro.getStorageSync('token')
    if(!token) {
      this.setState({
        isShowLogin: true
      })
    }
  }

  loginMethodsGetCode() {
    return new Promise((reslove, reject) => {
      Taro.login({
        success: (res) => {
          console.log('登录成功', res)
          reslove(res)
        }
      })
    })
  }

  onShareAppMessage () {
    return {
      title: 'Taro UI',
      path: '/pages/index/index',
      imageUrl: 'http://storage.360buyimg.com/mtd/home/share1535013100318.jpg'
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
      // url: `/pages/panel/index?id=${id.toLowerCase()}`
      url: `/pages/startBxOrder/index`
    })
  }

  goToPage = e => {
      Taro.navigateTo({
          // url: `/pages/panel/index?id=${id.toLowerCase()}`
          url: `/pages/startBxOrder/addBxBd`
      })
  }

  getOpenId() {
    const queryData = {}
    return new Promise((reslove, reject) => {
      Taro.login({
        success: (res) => {
          queryData.code = res.code
          service.requestGetOpenId(queryData, {}).then((result) => {
            console.log('获取open', result)
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

    Taro.setStorage({
      key:'userInfo',
      data:submitData
    })
    service.LoginGetToken(submitData, {}).then((res) => {
      console.log('token', res.data)
      this.setState({
        isShowLogin: false
      })
      Taro.setStorage({
        key:'token',
        data:res.data.data.token
      })
      Taro.setStorage({
        key:'userId',
        data:res.data.data.userInfo.id
      })
    })
  }

  render () {
    const { homeMenuIndex, isShowLogin } = this.state
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
                                <View key={`child-${index}`} className="home-title-menu-col" onClick={this.goToPage}>
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
        <View className="bx-home-content">
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

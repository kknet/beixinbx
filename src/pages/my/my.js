import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './my.scss'

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
    

  render () {
    const {userInfo, autoHeight} = this.state
    return (
      <View className='bx-page'>
        <View className="my-container" style={{margin: '20rpx 0 20rpx 0', height: autoHeight}}>
            <View className="avator-section">
                <View className="avator-row">
                    <OpenData className="avator-icons avator-image" type='userAvatarUrl' />
                    <View>
                        <Text className="avator-name">{userInfo.nickname}</Text>
                    </View>
                </View>
            </View>

            <View className="my-menu-section">
                <View className="my-menu-row" data-url="/pages/my/page/myOrder" onClick={Taro.goToTarget}>
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/my-order.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">我的保单</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>
                
                <View className="line"></View>

                <View className="my-menu-row" data-url="/pages/startBxOrder/finishBd?type=report" onClick={Taro.goToTarget}>
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/my-order.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">保单报告</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>

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
                <View className="my-menu-row" data-url="/pages/my/page/myCustom" onClick={Taro.goToTarget}>
                  <View style={{display: 'flex', alignItems: 'center'}}>
                    <Image src={require('./image/kh.png')} className="my-menu-icons" />
                    <Text className="my-menu-content">我的客户</Text>
                  </View>

                  <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>
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

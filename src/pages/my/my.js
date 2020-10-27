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
      
    }
  }
    

  render () {

    return (
      <View className='bx-page'>
        <View className="my-container">
            <View className="avator-section">
                <View className="avator-row">
                    <Image className="avator-icons" src={require('./image/ava-default.png')} className="avator-image" />
                    <View>
                        <Text className="avator-name">李益钢</Text>
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

                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/my-order.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">保单报告</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>

                <View className="line"></View>

                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/kf.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">联系客服</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>

                <View className="line"></View>

                <View className="my-menu-row" data-url="/pages/my/page/myCustom" onClick={Taro.goToTarget}>
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/kh.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">我的客户</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>

                <View className="line"></View>

                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('./image/share.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">分享好友</Text>
                    </View>

                    <Image src={require('./image/right-arrow.png')} className="my-menu-right-arrow-icons" />
                </View>

                <View className="line"></View>
            </View>
        </View>
      </View>
    )
  }
}
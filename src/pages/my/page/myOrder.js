import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import '../my.scss'

export default class MyOrder extends Taro.Component {
  config = {
    navigationBarTitleText: '我的保单'
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
            <View className="my-menu-section" onClick={Taro.goToTarget} data-url="/pages/my/page/myOrderDetail">
                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('../image/home-online.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">家庭保单</Text>
                        <Text className="my-order-small-status">保障中</Text>
                    </View>

                    <View>
                        <Text>3份</Text>
                    </View>
                </View>
                
                <View className="line"></View>

                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('../image/person-online.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">单份保单</Text>
                        <Text className="my-order-small-status">保障中</Text>
                    </View>

                    <View>
                        <Text>3/5份</Text>
                    </View>
                </View>

                <View className="line"></View>

                <View className="my-menu-row">
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <Image src={require('../image/person-unline.png')} className="my-menu-icons" />
                        <Text className="my-menu-content">单份保单</Text>
                        <Text className="my-order-small-status">失效</Text>
                    </View>

                    <View>
                        <Text>3/5份</Text>
                    </View>
                </View>

                <View className="line"></View>
            </View>
        </View>
      </View>
    )
  }
}

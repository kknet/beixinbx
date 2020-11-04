/**
 * Created by liyigang on 4/11/2020.
 */
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import '../confirm-order.scss'
export default class ProduceIcons extends Taro.Component {
  render() {
    // 0 单份保险  1 家庭保险
    const {currentType} = this.props
    console.log('type', currentType)

    return (
      <View>
        {currentType === 0 ?
        <View className="serve-content-rows" style={{padding: '0 27rpx', justifyContent: 'space-around'}}>

          <View className="serve-content-col">
            <Image src={require('../../../assets/images/analyse-icons.png')} className="serve-content-icons" />
            <View style={{marginTop: '20rpx'}}>
              <Text className="12Font">保障分析</Text>
            </View>
          </View>

          <View className="serve-content-col">
            <Image src={require('../../../assets/images/xf.png')} className="serve-content-icons" />
            <View style={{marginTop: '20rpx'}}>
              <Text className="12Font">续费提醒</Text>
            </View>
          </View>

          <View className="serve-content-col">
            <Image src={require('../../../assets/images/xzlp.png')} className="serve-content-icons" />
            <View style={{marginTop: '20rpx'}}>
              <Text className="12Font">协助理赔</Text>
            </View>
          </View>
        </View>
          :
          <View className="serve-content-rows" style={{padding: '0 27rpx'}}>
            <View className="serve-content-col">
              <Image src={require('../../../assets/images/order-report.png')} className="serve-content-icons" />
              <View style={{marginTop: '20rpx'}}>
                <Text className="12Font">保单诊断报告</Text>
              </View>
            </View>

            <View className="serve-content-col">
              <Image src={require('../../../assets/images/analyse-icons.png')} className="serve-content-icons" />
              <View style={{marginTop: '20rpx'}}>
                <Text className="12Font">保障分析</Text>
              </View>
            </View>

            <View className="serve-content-col">
              <Image src={require('../../../assets/images/xf.png')} className="serve-content-icons" />
              <View style={{marginTop: '20rpx'}}>
                <Text className="12Font">续费提醒</Text>
              </View>
            </View>

            <View className="serve-content-col">
              <Image src={require('../../../assets/images/xzlp.png')} className="serve-content-icons" />
              <View style={{marginTop: '20rpx'}}>
                <Text className="12Font">协助理赔</Text>
              </View>
            </View>

            <View className="serve-content-col">
              <Image src={require('../../../assets/images/one-serve.png')} className="serve-content-icons" />
              <View style={{marginTop: '20rpx'}}>
                <Text className="12Font">一对一服务</Text>
              </View>
            </View>
          </View>
        }
      </View>
    )
  }
}
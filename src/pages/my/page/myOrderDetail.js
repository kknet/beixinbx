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
        <View className="my-family-section">
            <View>
                <Text style={{fontSize: '34rpx', color: '#222222'}}>我的家人</Text>
            </View>
            <View className="my-family-row" style={{marginTop: '26rpx'}}>
                <Image src={require('../image/ava-default.png')} className="family-avator-col" />
                <Image src={require('../image/ava-default.png')} className="family-avator-col" />
                <Image src={require('../image/add-family.png')} style={{border: '2rpx dashed black'}} className="family-avator-col" />
            </View>
        </View>

        <View className="order-details-sub-titles">
            家庭保单
        </View>

        <View className="order-detail-info-section" onClick={Taro.goToTarget} data-url="/pages/my/page/myOrderDetailInfo">
            <View className="order-detail-info-row">
                <View className="float-right-button">
                    <Text style={{color: '#FE9B14', fontSize: '26rpx'}}>保障中</Text>
                </View>
                <View>
                    <Text>重疾险</Text>
                </View>
                <View>
                    <Text className="order-detail-info-tips">被保险人：张三</Text>
                </View>

                <View>
                    <Text className="order-detail-info-tips">保额: 10万</Text>
                </View>

                <View>
                    <Text className="order-detail-info-tips">保障期限：2020年10月02日</Text>
                </View>
            </View>
            
            <View className="order-detail-line"></View>

            <View className="order-detail-info-row">
                <View className="float-right-button">
                    <Text style={{color: '#999999', fontSize: '26rpx'}}>已失效</Text>
                </View>
                <View>
                    <Text>重疾险</Text>
                </View>
                <View>
                    <Text className="order-detail-info-tips">被保险人：张三</Text>
                </View>

                <View>
                    <Text className="order-detail-info-tips">保额: 10万</Text>
                </View>

                <View>
                    <Text className="order-detail-info-tips">保障期限：2020年10月02日</Text>
                </View>
            </View>

            <View className="order-detail-line" style={{ margin: '24px 0 0 0'}}></View>


            <View className="add-new-order">
                <Image src={require('../image/add-new-order.png')} className="add-new-order-button-image" />
                <View>
                    <Text style={{color: '#999999', fontSize: '26rpx'}}>添加保单</Text>
                </View>
            </View>
        </View>
      </View>
    )
  }
}

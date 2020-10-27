import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import '../myCustom.scss'

export default class MyOrder extends Taro.Component {
  config = {
    navigationBarTitleText: '我的客户'
  }

  constructor () {
    super(...arguments)

    this.state = {
      scoreData: [
          {
              label: '今日积分',
              data: '300'
          },
          {
              label: '管理积分',
              data: '300'
          },
          {
              label: '本月积分',
              data: '3200'
          },
          {
              label: '全年积分',
              data: '6000'
          }
      ]
    }
  }
    

  render () {
      const { scoreData } = this.state
    return (
      <View className='bx-page'>
          <View className="my-score-section">
              <View>
                  <Text style={{color: '#333', fontSize: '34rpx'}}>我的积分</Text>
              </View>

              <View className="my-score-info">
                  {scoreData.map((item, index) => {
                     return (
                         <View style={{display: 'flex'}}>
                             <View className="my-score-block">
                                 <View>
                                     <Text style={{color: '#666', fontSize: '26rpx'}}>{item.label}</Text>
                                 </View>
                                 <View>
                                     <Text style={{color: '#333', fontSize: '36rpx'}}>300</Text>
                                 </View>
                             </View>

                             {index === scoreData.length-1?'':<View className="ver-line"></View>}
                         </View>
                     )
                  })}
              </View>
          </View>

          <View className="my-score-info-list-section">
              <View className="my-score-info-list-row">
                  <View style={{display: 'flex', alignItems: 'center'}}>
                      <Text style={{fontSize: '32rpx', color: '#333333', marginRight: '20rpx'}}>张三</Text>
                      <Text className="small-tips">家庭保单 3份</Text>
                  </View>

                  <View>
                      <View>
                          <Text className="small-tips">已付款 100元</Text>
                      </View>
                      <View>
                          <Text className="small-tips">积分 20分</Text>
                      </View>
                  </View>
              </View>
              
              <View className="my-score-info-line"></View>

              <View className="my-score-info-list-row">
                  <View style={{display: 'flex', alignItems: 'center'}}>
                      <Text style={{fontSize: '32rpx', color: '#333333', marginRight: '20rpx'}}>张三</Text>
                      <Text className="small-tips">家庭保单 3份</Text>
                  </View>

                  <View>
                      <View>
                          <Text className="small-tips">已付款 100元</Text>
                      </View>
                      <View>
                          <Text className="small-tips">积分 20分</Text>
                      </View>
                  </View>
              </View>

              <View className="my-score-info-line"></View>

              <View className="my-score-info-list-row">
                  <View style={{display: 'flex', alignItems: 'center'}}>
                      <Text style={{fontSize: '32rpx', color: '#333333', marginRight: '20rpx'}}>张三</Text>
                      <Text className="small-tips">家庭保单 3份</Text>
                  </View>

                  <View>
                      <View>
                          <Text className="small-tips">已付款 100元</Text>
                      </View>
                      <View>
                          <Text className="small-tips">积分 20分</Text>
                      </View>
                  </View>
              </View>

              <View className="my-score-info-line"></View>
          </View>


      </View>
    )
  }
}

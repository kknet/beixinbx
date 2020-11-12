import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import * as service from '../services'
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
              data: 0,
              fields: 'pointsToday'
          },
          {
              label: '昨日积分',
              data: 0,
              fields: 'pointsYesterday'
          },
          {
              label: '本月积分',
              data: 0,
              fields: 'pointsThisMonth'
          },
          {
              label: '上月积分',
              data: 0,
              fields: 'pointsLastMonth'
          }
      ],
      clientOrderList: []
    }
  }

  componentDidMount(options) {
    this.requestGetClientData()
    this.requestGetClientOrderList()
  }

  requestGetClientData() {
    let queryData = {
      userId: Taro.getStorageSync('userId').toString()
    }
    service.requestGetMyClientData(queryData, {}).then((res) => {
      let scoreData = this.state.scoreData.slice()
      scoreData.forEach((v, k) => {
        v.data = res.data.data[v.fields]
      })
      this.setState({
        scoreData: scoreData
      })
    })
  }

  requestGetClientOrderList() {
    let queryData = {
      userId: Taro.getStorageSync('userId').toString()
    }
    service.requestGetMyClientOrderList(queryData, {}).then((res) => {
      console.log('获取客户订单', res.data)
      this.setState({
        clientOrderList: res.data.data
      })
    })
  }
    

  render () {
      const { scoreData, clientOrderList } = this.state
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
                                     <Text style={{color: '#333', fontSize: '36rpx'}}>{item.data}</Text>
                                 </View>
                             </View>

                             {index === scoreData.length-1?'':<View className="ver-line"></View>}
                         </View>
                     )
                  })}
              </View>
          </View>

          <View className="my-score-info-list-section">
              {clientOrderList.map((item, index) => {
                return (
                  <View>
                    <View className="my-score-info-list-row">
                      <View style={{display: 'flex', alignItems: 'center'}}>
                        <Text style={{fontSize: '32rpx', color: '#333333', marginRight: '20rpx'}}>{item.name}</Text>
                        <Text className="small-tips">{item.schemeId == 1?'单份': '家庭'}保单 {item.count}份</Text>
                      </View>

                      <View>
                        <View>
                          <Text className="small-tips">已付款 {item.amount}元</Text>
                        </View>
                        <View>
                          <Text className="small-tips">积分 {item.points}分</Text>
                        </View>
                      </View>
                    </View>

                    <View className="my-score-info-line"></View>
                  </View>
                )
              })}
          </View>


      </View>
    )
  }
}

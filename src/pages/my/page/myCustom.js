import Taro from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import * as service from '../services'
import '../myCustom.scss'

export default class MyOrder extends Taro.Component {
  config = {
    navigationBarTitleText: '我的客户'
  }

  constructor () {
    super(...arguments)

    this.state = {
      scoreDataObj: {},
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
      clientOrderList: [],
      page: 1,
      pageSize: 10
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
        scoreData: scoreData,
        scoreDataObj: res.data.data
      })
    })
  }

  requestGetClientOrderList() {
    let queryData = {
      userId: Taro.getStorageSync('userId').toString(),
      page: this.state.page,
      pageSize: this.state.pageSize
    }
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    service.requestGetMyClientOrderList(queryData, {}).then((res) => {
      Taro.hideLoading()
      this.setState({
        clientOrderList: res.data.data
      })
    })
  }

  loadMore() {
    this.setState({
      page: this.state.page+1
    }, () => {
      let queryData = {
        userId: Taro.getStorageSync('userId').toString(),
        page: this.state.page,
        pageSize: this.state.pageSize
      }
      let history = this.state.clientOrderList
      Taro.showLoading({
        title: Taro.loadingText,
        mask: true
      })
      service.requestGetMyClientOrderList(queryData, {}).then((res) => {
        Taro.hideLoading()
        res.data.data.forEach((item) => {
          history.push(item)
        })
        this.setState({
          clientOrderList: history
        })
      })
    })
  }

  goToBxDetail = (e) => {
    let {state, insuranceid} = e.currentTarget.dataset
    let routeUrl = ''
    console.log(state, insuranceid)
    return
    // 0 未处理  1 已处理
    if(state == 0) {
      routeUrl = '/pages/startBxOrder/finishBd?type=wait'
    } else {
      routeUrl = `/pages/my/page/myOrderDetailInfo?insuranceId=${insuranceid}`
    }
    this.setState({
      page: 1,
      pageSize: 10
    }, () => {
      Taro.navigateTo({
        url: `${routeUrl}`
      })
    })
  }
    

  render () {
      const { scoreData, clientOrderList, scoreDataObj } = this.state
    return (
      <View className='bx-page'>
          <View className="my-score-section">
              <View>
                  <Text style={{color: '#333', fontSize: '34rpx'}}>我的积分</Text>
              </View>

            <View className="my-score-info">
              <View style={{display: 'flex', justifyContent: 'space-between', width: '92%', alignItems: 'center'}}>
                <View className="my-score-block">
                  <View>
                    <Text decode={true} style={{color: '#666', fontSize: '38rpx'}}>总积分&nbsp;</Text>
                    <Text style={{color: '#333', fontSize: '38rpx'}}>{scoreDataObj.total}</Text>
                  </View>
                </View>

                <View className="my-score-block">
                  <View>
                    <Text decode={true} style={{color: '#666', fontSize: '26rpx'}}>额外积分&nbsp;</Text>
                    <Text style={{color: '#333', fontSize: '26rpx'}}>{scoreDataObj.otherPoints}</Text>
                  </View>
                </View>
              </View>
            </View>

              <View className="my-score-info">
                  {scoreData.map((item, index) => {
                     return (
                         <View key={`myScore${index}`} style={{display: 'flex'}}>
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

          <ScrollView scrollY={true} onScrollToLower={() => {this.loadMore()}} className="my-score-info-list-section">
              {clientOrderList.map((item, index) => {
                return (
                  <View key={`clientOrder${index}`}>
                    <View
                      onClick={this.goToBxDetail}
                      className="my-score-info-list-row"
                      data-insuranceId={item.id}
                      data-state={item.state}
                    >
                      <View style={{display: 'flex', alignItems: 'center'}}>
                        <View className="my-custom-name">
                          <Text style={{fontSize: '32rpx', color: '#333333', marginRight: '20rpx'}}>{item.name}</Text>
                        </View>
                        <View style={{marginLeft: '20rpx'}}>
                          <Text className="small-tips">{item.schemeId == 1?'单份': '家庭'}保单 {item.count}份</Text>
                        </View>
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
          </ScrollView>


      </View>
    )
  }
}

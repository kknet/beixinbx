import Taro from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import * as service from '../services'
import '../my.scss'

export default class MyOrder extends Taro.Component {
  config = {
    navigationBarTitleText: '我的保单'
  }

  constructor () {
    super(...arguments)

    this.state = {
      buyCount: 0,
      orderId: '',
      schemeId: '',
      insuranceList: [],
      shareList: [],
      currentPage: 1,
      currentPageSize: 20,
      currentTab: 1,
      total: 0,
      current: 0
    }
  }

  componentDidMount() {

  }

  // 对应 onShow
  componentDidShow () {
    const {orderId, schemeId, buyCount, clickTab, total, current} = this.$router.params
    if(orderId) {
      this.setState({
        orderId: orderId,
        schemeId: schemeId,
        buyCount: buyCount,
        currentTab: clickTab,
        total: total,
        current: current
      }, () => {
        this.getInsuranceDetailById()
        this.getSharePersonList()
      })
    }
  }

  getSharePersonList() {
    let queryParams = {
      orderId: this.state.orderId
    }

    service.requestGetSharedList(queryParams, {}).then((res) => {
      Taro.hideLoading()
      this.setState({
        shareList: res.data.data
      })
    })
  }

  getInsuranceDetailById() {
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    let queryParams = {
      orderId: this.state.orderId,
      page: this.state.currentPage,
      pageSize: this.state.currentPageSize
    }
    service.requestGetMyInsuranceList(queryParams, {}).then((res) => {
      Taro.hideLoading()
      res.data.data.list.forEach((v) => {
        if(v.status == 0) {
          v.statusText = '已失效'
        } else {
          v.statusText = '保险中'
        }

        // 0未处理  1已处理
        if(v.state == 0) {
          v.statusText = '处理中'
        }
      })
      let buyCount = 0
      if(this.state.schemeId == 1) {
        buyCount = parseInt(this.state.buyCount, 10) - res.data.data.total
      } else {
        buyCount = res.data.data.total
      }
      this.setState({
        insuranceList: res.data.data.list,
        buyCount: buyCount
      })
    })
  }

  goToBxDetail = (e) => {
    let {routeUrl, state} = e.currentTarget.dataset

    // 0 未处理  1 已处理
    if(state == 0) {
      routeUrl = '/pages/startBxOrder/finishBd?type=wait'
    }
    this.setState({
      currentPage: 1,
      currentPageSize: 20,
    }, () => {
      Taro.navigateTo({
        url: `${routeUrl}`
      })
    })
  }

  onShareAppMessage () {
    const userId = Taro.getStorageSync('userId').toString()
    const orderId = this.state.orderId
    return {
      title: '这是我已经托管的家庭保险资产，很重要，亲爱的你也需要知道。',
      path: `/pages/home/home?userId=${userId}&orderId=${orderId}&jump=true&url=/page/my/myOrderDetail&type=shareRegister`,
      imageUrl: `${require('../image/scan.jpg')}`
    }
  }

  loadMore() {
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    this.setState({
      currentPage: this.state.currentPage + 1
    }, () => {
      let queryParams = {
        orderId: this.state.orderId,
        page: this.state.currentPage,
        pageSize: this.state.currentPageSize
      }
      let historyArr = this.state.insuranceList
      service.requestGetMyInsuranceList(queryParams, {}).then((res) => {
        Taro.hideLoading()
        res.data.data.list.forEach((v) => {
          if(v.status == 0) {
            v.statusText = '已失效'
          } else {
            v.statusText = '保险中'
          }

          // 0未处理  1已处理
          if(v.state == 0) {
            v.statusText = '处理中'
          }
          historyArr.push(v)
        })

        this.setState({
          insuranceList: historyArr
        })
      })
    })

  }

  goToAddNewOrder(e) {
    const url = e.currentTarget.dataset.url
    this.setState({
      currentPage: 1,
      currentPageSize: 20,
    }, () => {
      Taro.navigateTo({
        url: `${url}`
      })
    })
  }

  render () {
    const {insuranceList, schemeId, orderId, shareList, buyCount, currentTab, total, current} = this.state
    return (
      <View className='bx-page'>
        <View className="my-family-section">
            <View>
                <Text style={{fontSize: '34rpx', color: '#222222'}}>我的家人</Text>
            </View>
            <View className="my-family-row" style={{marginTop: '26rpx'}}>
                {shareList.map((item) => {
                  return <Image src={item.avatar} className="family-avator-col" />
                })}
              {currentTab == 1?
                <Button
                  style={shareList.length === 0?{margin: 0}: ''}
                  openType="share"
                  className="my-image-share-button"
                >
                  <Image
                    src={require('../image/add-family.png')}
                    className="family-avator-col"
                  />
                </Button>
                :
                ''
              }
            </View>
        </View>

        <View className="order-details-sub-titles">
            {schemeId == '1'?'单份保单': '家庭保单'}
        </View>

        <ScrollView className="order-detail-info-section" scrollY={true} onScrollToLower={() => {this.loadMore()}}>
            {insuranceList.map((item, index) => {
              return (
                <View>
                  <View
                    className="order-detail-info-row"
                    onClick={this.goToBxDetail}
                    data-url={`/pages/my/page/myOrderDetailInfo?insuranceId=${item.id}`}
                    data-state={item.state}
                  >
                    <View className="float-right-button">
                      <Text style={item.status == 0?{color: '#999999', fontSize: '26rpx'}:{color: '#FE9B14', fontSize: '26rpx'}}>{item.statusText}</Text>
                    </View>
                    <View>
                      <Text>{item.name === null?'':item.name}</Text>
                    </View>
                    <View>
                      <Text className="order-detail-info-tips">被保险人：{item.insurant === null?'':item.insurant}</Text>
                    </View>

                    <View>
                      <Text className="order-detail-info-tips">保额: {item.coverage === null? '': item.coverage}</Text>
                    </View>

                    <View>
                      <Text className="order-detail-info-tips">保障期限：{item.limit === null? '': item.limit}</Text>
                    </View>
                  </View>
                  {insuranceList.length-1 === index?''
                      :
                    <View className="order-detail-line"></View>
                  }
                </View>
              )
            })}

            {/*<View className="order-detail-info-row">*/}
            {/*    <View className="float-right-button">*/}
            {/*        <Text style={{color: '#999999', fontSize: '26rpx'}}>已失效</Text>*/}
            {/*    </View>*/}
            {/*    <View>*/}
            {/*        <Text>重疾险</Text>*/}
            {/*    </View>*/}
            {/*    <View>*/}
            {/*        <Text className="order-detail-info-tips">被保险人：张三</Text>*/}
            {/*    </View>*/}

            {/*    <View>*/}
            {/*        <Text className="order-detail-info-tips">保额: 10万</Text>*/}
            {/*    </View>*/}

            {/*    <View>*/}
            {/*        <Text className="order-detail-info-tips">保障期限：2020年10月02日</Text>*/}
            {/*    </View>*/}
            {/*</View>*/}

            {/*<View className="order-detail-line" style={{ margin: '24px 0 0 0'}}></View>*/}


            {(buyCount == 0 && schemeId == 1) || currentTab === 2?
              '':
              <View
                className="add-new-order"
                onClick={(e) => {this.goToAddNewOrder(e)}}
                data-url={`/pages/startBxOrder/addBxBd?schemeId=${schemeId}&orderId=${orderId}&buyCount=${buyCount}&total=${total}&current=${current}`}
              >
                <Image src={require('../image/add-new-order.png')} className="add-new-order-button-image" />
                <View>
                  <Text style={{color: '#999999', fontSize: '26rpx'}}>添加保单</Text>
                </View>
              </View>
            }
        </ScrollView>
      </View>
    )
  }
}

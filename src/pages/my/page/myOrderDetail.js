import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
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
      currentTab: 1
    }
  }

  componentDidMount() {

  }

  // 对应 onShow
  componentDidShow () {
    const {orderId, schemeId, buyCount, currentTab} = this.$router.params
    if(orderId) {
      this.setState({
        orderId: orderId,
        schemeId: schemeId,
        buyCount: buyCount,
        currentTab: currentTab
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
      title: Taro.loadingText
    })
    let queryParams = {
      orderId: this.state.orderId,
      page: this.state.currentPage,
      pageSize: 20
    }
    service.requestGetMyInsuranceList(queryParams, {}).then((res) => {
      Taro.hideLoading()
      res.data.data.forEach((v) => {
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
      this.setState({
        insuranceList: res.data.data
      })
    })
  }

  goToBxDetail = (e) => {
    let {routeUrl, state} = e.currentTarget.dataset

    // 0 未处理  1 已处理
    if(state == 0) {
      routeUrl = '/pages/startBxOrder/finishBd?type=wait'
    }
    Taro.navigateTo({
      url: `${routeUrl}`
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

  render () {
    const {insuranceList, schemeId, orderId, shareList, buyCount, currentTab} = this.state
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
              <Button openType="share" className="my-image-share-button">
                <Image
                  src={require('../image/add-family.png')}
                  className="family-avator-col"
                />
              </Button>
            </View>
        </View>

        <View className="order-details-sub-titles">
            {schemeId == '1'?'单份保单': '家庭保单'}
        </View>

        <View className="order-detail-info-section">
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
                onClick={Taro.goToTarget}
                data-url={`/pages/startBxOrder/addBxBd?schemeId=${schemeId}&orderId=${orderId}&buyCount=${buyCount}`}
              >
                <Image src={require('../image/add-new-order.png')} className="add-new-order-button-image" />
                <View>
                  <Text style={{color: '#999999', fontSize: '26rpx'}}>添加保单</Text>
                </View>
              </View>
            }
        </View>
      </View>
    )
  }
}

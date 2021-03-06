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
	    bottomHeight: '66%',
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
		const height = wx.getSystemInfoSync().screenHeight
	  if(height > 812) {
		  this.setState({
			  bottomHeight: '68%'
		  })
	  }
	  console.log('高度', height)
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
	      if(v.state == 1) {
		      v.statusText = '保障中'
	      } else if(v.state == 0) {
		      v.statusText = '处理中'
	      } else {
		      v.statusText = '已失效'
	      }
      })
      let buyCount = 0
      if(this.state.schemeId == 1) {
        buyCount = parseInt(this.state.buyCount, 10) - res.data.data.total
      } else {
        buyCount = res.data.data.total
      }
      console.log('buycount', buyCount)
      this.setState({
        insuranceList: res.data.data.list,
        buyCount: buyCount
      })
    })
  }

  goToBxDetail = (e) => {
    let {routeUrl, state, insuranceid} = e.currentTarget.dataset
    // 0 未处理  1 已处理
    if(state == 0) {
      routeUrl = '/pages/startBxOrder/finishBd?type=wait'
    } else {
      routeUrl = `/pages/my/page/myOrderDetailInfo?insuranceId=${insuranceid}`
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
    const {schemeId, orderId, buyCount, currentTab, total, current} = this.state

	  let shareTitle = '这是我们的家庭保险资产，有几件很重要的事，你知道吗？'
	  let shareUrl = `/pages/home/home?userId=${userId}&orderId=${orderId}&jump=true&type=shareRegister&schemeId=${schemeId}&buyCount=${buyCount}&currentTab=${2}&total=${total}&current=${current}`
	  if(currentTab == 2) {
		  shareTitle = '朋友，这里可以做保单托管，以后你的保单就有人服务了。'
		  shareUrl = '/pages/home/home?isShare=1'
	  }
    return {
      title: shareTitle,
      path: shareUrl,
      imageUrl: `${require('../image/share-image.png')}`
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
	        if(v.state == 1) {
		        v.statusText = '保障中'
	        } else if(v.state == 0) {
		        v.statusText = '处理中'
	        } else {
		        v.statusText = '已失效'
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

  delShareRecord(row) {
    console.log('删除', row)
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    let delParams = {
      orderId: this.state.orderId,
      userId: Taro.getStorageSync('userId').toString(),
      sharedUserId: row.id
    }
    service.requestDeleteShareRecord(delParams, {}).then((res) => {
      Taro.hideLoading()
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      this.getSharePersonList()
    })
  }

  render () {
    const {bottomHeight, insuranceList, schemeId, orderId, shareList, buyCount, currentTab, total, current} = this.state
    return (
      <View className='bx-page'>
        <View className="my-family-section">
            <View>
                <Text style={{fontSize: '34rpx', color: '#222222'}}>我的家人</Text>
            </View>
            <ScrollView scrollX={true} style={{marginTop: '26rpx'}}>
                <View className="my-family-row">
                  {shareList.map((item, index) => {
                    return (
                      <View className="family-col" key={`family-col${index}`}>
                        <Image src={item.avatar} className="family-avator-col" />
                        {currentTab != 2 &&
                        <Image
                          className="close-image"
                          onClick={() => {this.delShareRecord(item)}}
                          src={require('../image/close.png')}
                        />
                        }
                      </View>
                    )
                  })}
                  {currentTab == 1?
                    <Button
                      style={shareList.length === 0?{margin: 0}: ''}
                      openType="share"
                      className="my-image-share-button"
                    >
                      <Image
                        src={require('../image/add-family-yellow.png')}
                        className="family-avator-col"
                      />
                    </Button>
                    :
                    ''
                  }
                </View>
            </ScrollView>
        </View>

        <View className="order-details-sub-titles">
            {schemeId == '1'?'单份保单': '家庭保单'}
        </View>

        <ScrollView style={{height: bottomHeight}} className="order-detail-info-section" scrollY={true} onScrollToLower={() => {this.loadMore()}}>
            {insuranceList.map((item, index) => {
              return (
                <View key={`order-detail-${index}`}>
                  <View
                    className="order-detail-info-row"
                    onClick={this.goToBxDetail}
                    data-insuranceId={item.id}
                    data-state={item.state}
                  >
                    <View className="float-right-button">
                      <Text style={item.status == 0?{color: '#999999', fontSize: '26rpx'}:{color: '#FE9B14', fontSize: '26rpx'}}>{item.statusText}</Text>
                    </View>
                    <View className="order-detail-insurance-name">
                      <Text>{item.name === null?'':item.name}</Text>
                    </View>
	                  <View>
		                  <Text className="order-detail-info-tips">投保人：{item.policyHolder === null?'':item.policyHolder}</Text>
	                  </View>
                    <View>
                      <Text className="order-detail-info-tips">被保险人：{item.insurant === null?'':item.insurant}</Text>
                    </View>

	                  <View>
		                  <Text className="order-detail-info-tips">保费: {item.cost === null? '': item.cost}</Text>
	                  </View>

                    <View>
                      <Text className="order-detail-info-tips">保额: {item.coverage === null? '': item.coverage}</Text>
                    </View>

                    <View>
                      <Text className="order-detail-info-tips">保单生效日：{item.limit === null? '': item.limit}</Text>
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


            {currentTab == 2?
              '':
              buyCount <= 0 && schemeId == 1? '' :
              <View
                className="add-new-order"
                onClick={(e) => {this.goToAddNewOrder(e)}}
                data-url={`/pages/startBxOrder/addBxBd?schemeId=${schemeId}&orderId=${orderId}&buyCount=${buyCount}&total=${total}&current=${current}`}
              >
                <Image src={require('../image/add-new-order-yellow.png')} className="add-new-order-button-image" />
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

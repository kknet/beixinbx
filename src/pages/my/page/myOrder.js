import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import * as service from '../services'
import homeOnline from '../image/home-online.png'
import homeUnline from '../image/home-unline.png'
import personOnline from '../image/person-online.png'
import personUnline from '../image/person-unline.png'
import '../my.scss'
import {startPayMethods} from "../../../utils/payMethods";

export default class MyOrder extends Taro.Component {
  config = {
    navigationBarTitleText: '我的保单'
  }

  constructor () {
    super(...arguments)

    this.state = {
      insuranceList: [],
      currentPage: 1,
      currentTab: 1,
      currentPageSize: 15
    }
  }

  componentDidMount() {

  }

  componentDidShow() {
    this.setState({
      currentTab: 1,
	    currentPage: 1
    }, () => {
	    this.requestGetAllInsurance()
    })
  }

  requestGetAllInsurance() {
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    const queryData = {
      userId: Taro.getStorageSync('userId').toString(),
      page: this.state.currentPage,
      pageSize: this.state.currentPageSize
    }

    service.requestGetMyAllInsurance(queryData, {}).then((res) => {
      Taro.hideLoading()
      // 遍历生成当前图标
      if(res.data.data !== null) {
        res.data.data.forEach((v) => {
          if(v.status == 1) {
            if(v.schemeId == 1) {
              v.icons = personOnline
            } else {
              v.icons = homeOnline
            }
          } else {
            if(v.schemeId == 1) {
              v.icons = personUnline
            } else {
              v.icons = homeUnline
            }
          }

          if(v.status == 0) {
            v.statusName = '处理中'
          } else if(v.status == 1) {
            v.statusName = '保障中'
          } else if(v.status == 2) {
            v.statusName = '已失效'
          }
        })
      }
      this.setState({
        insuranceList: res.data.data
      })
    })
  }

  requestGetShareList() {
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    const queryData = {
      userId: Taro.getStorageSync('userId').toString(),
      page: this.state.currentPage,
      pageSize: this.state.currentPageSize
    }
    service.requestGetShareOrder(queryData, {}).then((res) => {
      Taro.hideLoading()
      // 遍历生成当前图标
      if(res.data.data !== null) {
        res.data.data.forEach((v) => {
          if(v.status == 1) {
            if(v.schemeId == 1) {
              v.icons = personOnline
            } else {
              v.icons = homeOnline
            }
          } else {
            if(v.schemeId == 1) {
              v.icons = personUnline
            } else {
              v.icons = homeUnline
            }
          }

          if(v.status == 0) {
            v.statusName = '处理中'
          } else if(v.status == 1) {
            v.statusName = '保障中'
          } else if(v.status == 2) {
            v.statusName = '已失效'
          }
        })
      }
      this.setState({
        insuranceList: res.data.data
      })
    })
  }

  changeTabs = (e) => {
    const tabsIndex = parseInt(e.currentTarget.dataset.tabs, 10)
    this.setState({
      currentTab: tabsIndex,
      currentPage: 1,
      currentPageSize: 15
    }, () => {
      if(tabsIndex === 1) {
        this.requestGetAllInsurance()
      } else {
        this.requestGetShareList()
      }
    })
  }

  loadMore() {
    let page = this.state.currentPage + 1
    this.setState({
      currentPage: page
    },() => {
      let tabsIndex = this.state.currentTab
      if(tabsIndex === 1) {
        this.loadMoreMyInsurance()
      } else {
        this.loadMoreShareInsurance()
      }
    })
  }

  loadMoreMyInsurance() {
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    const queryData = {
      userId: Taro.getStorageSync('userId').toString(),
      page: this.state.currentPage,
      pageSize: this.state.currentPageSize
    }
    service.requestGetMyAllInsurance(queryData, {}).then((res) => {
      Taro.hideLoading()
      let historyArr = this.state.insuranceList
      // 遍历生成当前图标
      if(res.data.data !== null) {
        res.data.data.forEach((v) => {
          if(v.status == 1) {
            if(v.schemeId == 1) {
              v.icons = personOnline
            } else {
              v.icons = homeOnline
            }
          } else {
            if(v.schemeId == 1) {
              v.icons = personUnline
            } else {
              v.icons = homeUnline
            }
          }

          if(v.status == 0) {
            v.statusName = '处理中'
          } else if(v.status == 1) {
            v.statusName = '保障中'
          } else if(v.status == 2) {
            v.statusName = '已失效'
          }

          historyArr.push(v)
        })
      }

      this.setState({
        insuranceList: historyArr
      })
    })
  }

  loadMoreShareInsurance() {
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    const queryData = {
      userId: Taro.getStorageSync('userId').toString(),
      page: this.state.currentPage,
      pageSize: this.state.currentPageSize
    }
    service.requestGetSharedList(queryData, {}).then((res) => {
      Taro.hideLoading()
      let historyArr = this.state.insuranceList
      // 遍历生成当前图标
      if(res.data.data !== null) {
        res.data.data.forEach((v) => {
          if(v.status == 1) {
            if(v.schemeId == 1) {
              v.icons = personOnline
            } else {
              v.icons = homeOnline
            }
          } else {
            if(v.schemeId == 1) {
              v.icons = personUnline
            } else {
              v.icons = homeUnline
            }
          }

          if(v.status == 0) {
            v.statusName = '处理中'
          } else if(v.status == 1) {
            v.statusName = '保障中'
          } else if(v.status == 2) {
            v.statusName = '已失效'
          }

          historyArr.push(v)
        })
      }

      this.setState({
        insuranceList: historyArr
      })
    })
  }

  // 续费
  newOrderPay(e, row) {
    e.stopPropagation()
    e.preventDefault()
    let currentUserId = Taro.getStorageSync('userId').toString()
    let params = {
      amount: parseFloat(row.renewPrice),
      userId: currentUserId,
      orderId: row.orderId
    }
    let productName = row.schemeId === 1?'单份托管': '家庭托管'
    service.createRenewOrder(params, {}).then((res) => {
      console.log('res', res.data)
      let orderInfo = res.data.data
      startPayMethods(orderInfo.orderId, orderInfo.amount, productName, 2).then((result) => {
	      this.requestGetAllInsurance()
      })
    })
  }


  render () {
    const {insuranceList, currentTab} = this.state
    return (
      <View className='bx-page'>
        <View>
          <View className="start-bx-title-row">
            <View onClick={this.changeTabs} data-tabs="1" className={currentTab === 1?'start-bx-title-col start-bx-title-checked': 'start-bx-title-col'}>我的保单</View>
            <View onClick={this.changeTabs} data-tabs="2" className={currentTab === 2?'start-bx-title-col start-bx-title-checked': 'start-bx-title-col'}>分享的保单</View>
          </View>
        </View>
        <ScrollView scrollY={true} className="my-container" onScrollToLower={() => {this.loadMore()}}>
            <View className="my-menu-section">
                {
                  insuranceList.map((item, index) => {
                    let buyCount = parseInt(item.total, 10)
                    return (
                      <View key={`insuranceList${index}`}>
                        <View
                          onClick={Taro.goToTarget}
                          data-url={`/pages/my/page/myOrderDetail?orderId=${item.orderId}&schemeId=${item.schemeId}&buyCount=${buyCount}&clickTab=${currentTab}&total=${item.total}&current=${item.current}`}
                          className="my-menu-row"
                        >
                          <View class={item.status === 2?'useless-status': ''} style={{display: 'flex', alignItems: 'center'}}>
                            <Image src={item.icons} className="my-menu-icons" />
                            <Text className="my-menu-content">{item.schemeId == 1?'单份保单': '家庭保单'}</Text>
                            <Text className="my-order-small-status">{item.statusName}</Text>
	                          {item.renew == '1' && <View onClick={e => e.stopPropagation()}>
		                          <Button className="new-order-button" onClick={(e) => {this.newOrderPay(e, item)}}>续订</Button>
	                          </View>}
                          </View>

                          <View>
                            {item.schemeId == '1'?
                              <Text>{item.current}/{item.total}份</Text>:
                              <Text>{item.current}份</Text>
                            }
                          </View>
                        </View>
                        {insuranceList.length-1 === index?'':  <View className="line"></View>}
                      </View>
                    )
                  })
                }
            </View>
	          <View className="bottom-words">
		          您已滑到底部
	          </View>
            {insuranceList.length === 0?
              <View className='no-data-block'>
                <View>
                  <Image className='no-data-image' src={require('../../../assets/images/no-data.png')} />
                  <View className="null-words">暂无数据</View>
                </View>
              </View>
              : ''}
        </ScrollView>
      </View>
    )
  }
}

import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import * as service from '../services'
import homeOnline from '../image/home-online.png'
import homeUnline from '../image/home-unline.png'
import personOnline from '../image/person-online.png'
import personUnline from '../image/person-unline.png'
import '../my.scss'

export default class MyOrder extends Taro.Component {
  config = {
    navigationBarTitleText: '我的保单'
  }

  constructor () {
    super(...arguments)

    this.state = {
      insuranceList: [],
      currentPage: 1
    }
  }

  componentDidMount() {

  }

  componentDidShow() {
    this.requestGetAllInsurance()
  }

  requestGetAllInsurance() {
    Taro.showLoading({
      title: Taro.loadingText,
    })
    const queryData = {
      userId: Taro.getStorageSync('userId').toString(),
      page: this.state.currentPage,
      pageSize: 20
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
        }) 
      }
      this.setState({
        insuranceList: res.data.data
      })
    })
  }


  render () {
    const {insuranceList} = this.state
    return (
      <View className='bx-page'>
        <View className="my-container">
            <View className="my-menu-section">
                {insuranceList.map((item, index) => {
                  let buyCount = parseInt(item.current, 10) - parseInt(item.total, 10)
                  return (
                    <View>
                      <View
                        onClick={Taro.goToTarget}
                        data-url={`/pages/my/page/myOrderDetail?orderId=${item.orderId}&schemeId=${item.schemeId}&buyCount=${buyCount}`}
                        className="my-menu-row"
                        key={index}
                      >
                        <View style={{display: 'flex', alignItems: 'center'}}>
                          <Image src={item.icons} className="my-menu-icons" />
                          <Text className="my-menu-content">{item.schemeId == 1?'单份保单': '家庭保单'}</Text>
                          <Text className="my-order-small-status">{item.status == 1?'保障中': '失效'}</Text>
                        </View>

                        <View>
                          {item.schemeId == '1'?
                            <Text>{item.current}/{item.total}份</Text>:
                            <Text>{item.total}份</Text>
                          }
                        </View>
                      </View>
                      <View className="line"></View>
                    </View>
                  )
                })}

            </View>
        </View>
      </View>
    )
  }
}

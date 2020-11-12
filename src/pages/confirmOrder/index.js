/**
 * Created by liyigang on 24/10/2020.
 */
import Taro from '@tarojs/taro'
import { View, Image, Form } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtInputNumber, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import ConfirmInfo from './components/confirmInfo'
import ProduceIcons from './components/produceIcons'
import * as service from './services'
import {startPayMethods} from '../../utils/payMethods'
import './confirm-order.scss'

export default class ConfirmOrder extends Taro.Component {
    config = {
        navigationBarTitleText: '托管'
    }

    constructor () {
        super(...arguments)

        this.state = {
          totalPrice: 0,  // 乘以数量的总价格
          current: 0,
          buyCount: 1,
          preSalePrice: 39.9,
          salePrice: 9.9,
          isShowServeInfo: true,
          currentType: 0  // 0 单份保险  1  家庭保险
        }
    }

    componentDidMount (options) {
        const type = this.$router.params.type
        this.setState({
          totalPrice: type == 1? 699: 0.01,
          preSalePrice: type == 1? 999: 39.9,
          salePrice: type == 1? 699: 0.01,
          currentType: parseInt(this.$router.params.type, 10)
        })
        if(type) {
            if(type === '0') {
                // 微信环境下
                if(wx) {
                    wx.setNavigationBarTitle({
                        title: '单份托管'
                    })
                }
            }

            if(type === '1') {
                // 微信环境下
                if(wx) {
                    wx.setNavigationBarTitle({
                        title: '家庭托管'
                    })
                }
            }
        }
    }

    onShareAppMessage () {
        return {
            title: 'Taro UI',
            path: '/pages/index/index',
            imageUrl: 'http://storage.360buyimg.com/mtd/home/share1535013100318.jpg'
        }
    }

    hideModal = (e) => {
      this.setState({
        isShowServeInfo: !this.state.isShowServeInfo
      })
    }

    goToPay = (event) => {
      let postParams = {
        amount: parseFloat(this.state.salePrice * this.state.buyCount),
        number: this.state.buyCount,
        schemeId: this.state.currentType,
        userId: Taro.getStorageSync('userId').toString()
      }
      service.createBxOrder(postParams, {}).then((res) => {
        let orderInfo = res.data.data
        startPayMethods(orderInfo.id, postParams.amount).then((result) => {
          Taro.navigateTo({
            url: `/pages/startBxOrder/addBxBd?orderId=${result.orderId}&schemeId=${this.state.currentType}&buyCount=${this.state.buyCount}`
          })
        })
      })
    }

    changeBuyCount = (val) => {
      let result = parseFloat((this.state.salePrice * val).toFixed(1))
      this.setState({
        buyCount: val,
        totalPrice: result
      })
    }

    showWarnInfo = () => {
      this.setState({
        isShowServeInfo: true
      })
    }


    render () {
        const {
          current,
          isShowServeInfo,
          currentType,
          preSalePrice,
          salePrice,
          totalPrice
        } = this.state

        return (
            <View className="bx-page">
                <View className="tg-confirm-content">
                    <ProduceIcons currentType={currentType} />
                    <ConfirmInfo
                      currentType={currentType}
                      preSalePrice={preSalePrice}
                      salePrice={salePrice}
                    />

                    <View className="buy-count-row">
                        <Text style={{marginRight: '30rpx'}}>本次购买份数</Text>
                        <AtInputNumber
                            min={1}
                            max={99}
                            step={1}
                            value={this.state.buyCount}
                            onChange={this.changeBuyCount}
                        />
                    </View>
                </View>

                <View className="confirm-bottom-row">
                    <View>
                        <Text>实付金额</Text>
                        <Text style={{color: '#FE9B14', fontSize: '40rpx', marginLeft: '18rpx'}}>¥{totalPrice}</Text>
                    </View>
                    <Form onSubmit={this.goToPay} reportSubmit={false}>
                      <Button
                        formType="submit"
                        className="float-right-pay-button"
                        style={{borderRadius: 0}}
                      >
                        确定支付
                      </Button>
                    </Form>
                </View>

                <AtModal isOpened={isShowServeInfo} className="confirm-order-modal">
                    <AtModalContent>
                        <Image src={require('./image/logo.png')} className="logo-image" />
                        <View style={{margin: '14rpx 0 18rpx 0', textAlign: 'center'}}>
                            <Text style={{textIndent: '2em', fontSize: '36rpx', color: '#000'}}>消费者权益保障服务</Text>
                        </View>
                        <View>
                            <Text style={{textIndent: '2em', fontSize: '30rpx', color: '#888'}}>·15天无理由退 ·理赔无忧 ·客服协助 ·风险提示</Text>
                        </View>

                        <View style={{margin: '37rpx 0 66rpx 0'}}>
                            <Text style={{textIndent: '2em', fontSize: '30rpx', color: '#111'}}>你已进入蚂蚁保保险代理有限公司投保流程，请仔细阅读保险条款、投保须知、客户告知书等内容并关注承保保险公司信息。为保障你的权益，我们将会安全记录你的操作。</Text>
                        </View>
                    </AtModalContent>
                    <AtModalAction>
                        <Button style={{color: '#FE9B14'}} onClick={this.hideModal}>知道了</Button>
                    </AtModalAction>
                </AtModal>
            </View>
        )
    }
}

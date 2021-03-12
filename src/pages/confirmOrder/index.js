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
          shareId: 0,
          totalPrice: 0,  // 乘以数量的总价格
          current: 0,
          buyCount: 1,
          preSalePrice: 39.9,
          salePrice: 9.9,
          isShowServeInfo: true,
          currentType: 0  // 0 单份保险  1  家庭保险
        }
    }

    componentDidMount () {
      const type = this.$router.params.type
      // 分享点进来的
      const shareId = this.$router.params.shareId
      const buyCount = parseInt(this.$router.params.buyCount, 10)
      if(shareId) {
        Taro.hideShareMenu()
        this.setState({
          shareId: shareId,
          buyCount: buyCount
        })
      }
      this.requestGetItemPrice()
      if(type) {
        if(type == '1') {
          // 微信环境下
          if(wx) {
            wx.setNavigationBarTitle({
              title: '单份托管'
            })
          }
        }

        if(type == '2') {
          // 微信环境下
          if(wx) {
            wx.setNavigationBarTitle({
              title: '家庭托管'
            })
          }
        }
      }
    }

  requestGetItemPrice() {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    service.requestGetSchemeList({}, {}).then((res) => {
      Taro.hideLoading()
      const type = parseInt(this.$router.params.type, 10)
      const itemList = res.data.data
      console.log('查询数据', type, itemList)
      this.setState({
        totalPrice: itemList[type-1].price,
        preSalePrice: itemList[type-1].originalPrice,
        salePrice: itemList[type-1].price,
        currentType: parseInt(this.$router.params.type, 10),
        schemeId: parseInt(this.$router.params.type, 10)
      })
    })
  }

  onShareAppMessage () {
    const shareId = Taro.getStorageSync('userId').toString()
    const buyCount = this.state.buyCount
    return {
      title: '立即托管，以后您的保单有人服务了。',
      path: `/pages/home/home?schemeId=${this.state.schemeId}&shareId=${shareId}&buyCount=${buyCount}`,
      imageUrl: `${require('../../assets/images/share.png')}`
    }
  }

    hideModal = (e) => {
      this.setState({
        isShowServeInfo: !this.state.isShowServeInfo
      })
    }

    goToPay = (event) => {
      let currentUserId = Taro.getStorageSync('userId').toString()
      let postParams = {
        amount: parseFloat(this.state.salePrice * this.state.buyCount),
        number: this.state.buyCount,
        schemeId: this.state.currentType,
        userId: currentUserId
      }

      // 当前shareId和当前用户id不是同一个
      if(this.state.shareId !== 0 && this.state.shareId !== currentUserId) {
        postParams.shareId = this.state.shareId
      }
      let productName = this.state.schemeId === 1?'单份托管': '家庭托管'
      console.log('创建订单参数', postParams)
      service.createBxOrder(postParams, {}).then((res) => {
        let orderInfo = res.data.data
        startPayMethods(orderInfo.id, postParams.amount, productName, 1).then((result) => {
          Taro.navigateTo({
            url: `/pages/startBxOrder/addBxBd?orderId=${result.orderId}&schemeId=${this.state.currentType}&buyCount=${this.state.currentType == 1?this.state.buyCount: this.state.buyCount-1}&total=${this.state.buyCount}&current=0`
          })
        })
      })
    }

    changeBuyCount = (val) => {
      let result = parseFloat((this.state.salePrice * val).toFixed(2))
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
          totalPrice,
          schemeId,
          shareId
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
                      {schemeId == 2 ? '':<Text style={{marginRight: '30rpx'}}>本次购买份数</Text>}
                      {schemeId == 2 ? '' :
                        <AtInputNumber
                          disabled={schemeId == 2 || shareId != 0?true: false}
                          min={1}
                          max={99}
                          step={1}
                          value={this.state.buyCount}
                          onChange={this.changeBuyCount}
                        />
                      }
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
                        <View>
                          <Text>
                            感谢您选择我公司为您提供保险服务，为了保护您的合法权益，现将有关事项告知如下，请您仔细阅读。在您阅读过程中如果有任何疑问，可向我公司客服进行咨询。如您不同意本告知书中的任何条款，您应立即停止我公司的服务：\n

                            以下是我公司给您提供的服务：\n
                            1. 保单整理和诊断：安排专人为您整理此前已购的全部保单，并提供专业、中立的诊断分析意见及风险评估服务；\n
                            2. 保单变更服务：协助您办理保单中地址、银行账户、职业、投保人、受益人等合同事项的变更；\n
                            3．医疗绿通服务：基于您的保险附加功能，帮你筛选及跟进可以行使的保险绿通服务；\n
                            4. 协助理赔服务：在您需要进行保单项下的理赔时，协助您向保险公司递交理赔资料，并协助办理理赔申请；\n
                            注：上述所有服务项目，我公司会根据客户的需求、选择以及服务进程的不同，提供一项或多项的服务项目。\n

                            您的权利和义务\n
                            1. 您应本着最大诚信原则，如实、准确向我公司提供所有与委托事项有关的信息和资料，履行如实告知义务。\n
                            2. 购买保险产品时，不允许他人代签，也不授权或诱使、暗示我公司工作人员代替您签章。因非亲笔签名造成的后果，须由您自行承担。\n
                            3. 出现下列任一情况的，您应当在 24 小时内通知我公司：\n
                            （1）保险标的的风险性质及情况发生改变的；\n
                            （2）发生任何可能引起保险理赔的事件或情况的；\n
                            （3）发生保险事故的。\n
                            4.如保险公司要求出具您的《授权委托书》及相关证明文件，您应予配合提供。\n
                            5.我公司为您制定的任何文件和方案，均享有知识产权。未经许可，不允许复制、传播。\n

                            我公司的权利和义务\n
                            1.本着客户至上的服务宗旨，在法律范围内维护您的合法权益，并始终把您的利益放在第一位。\n
                            2.利用专业知识和技术，根据您的需求及您选择的服务套餐内容，为您提供客观、中立的保险售后及跟进服务。\n
                            3.承诺不会将获取的信息用于非法用途。\n

                            保密条款\n
                            对于在履行本协议过程中获得的对方的任何保密信息，我公司和您均应承担保密义务，除非为本协议约定之目的或履行法律法规规定的披露义务。\n

                          </Text>
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

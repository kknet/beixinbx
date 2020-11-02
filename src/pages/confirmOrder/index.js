/**
 * Created by liyigang on 24/10/2020.
 */
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtInputNumber, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import ConfirmInfo from './components/confirmInfo'
import './confirm-order.scss'

export default class ConfirmOrder extends Taro.Component {
    config = {
        navigationBarTitleText: '托管'
    }

    constructor () {
        super(...arguments)

        this.state = {
            current: 0,
            buyCount: 1,
            isShowServeInfo: true
        }
    }

    componentDidMount (options) {
        console.log('测试', this.$router, this)
        if(this.$router.params.type) {
            const type = this.$router.params.type
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

    hideModal = () => {
        this.setState({
            isShowServeInfo: !this.state.isShowServeInfo
        })
    }

    changeBuyCount = (val) => {
        this.setState({
            buyCount: val
        })
    }


    render () {
        const { current, isShowServeInfo } = this.state

        return (
            <View className="bx-page">
                <View className="tg-confirm-content">
                    <View className="serve-content-rows" style={{padding: '0 27rpx'}}>
                        <View className="serve-content-col">
                            <Image src={require('../../assets/images/order-report.png')} className="serve-content-icons" />
                            <View style={{marginTop: '20rpx'}}>
                                <Text className="12Font">保单诊断报告</Text>
                            </View>
                        </View>

                        <View className="serve-content-col">
                            <Image src={require('../../assets/images/analyse-icons.png')} className="serve-content-icons" />
                            <View style={{marginTop: '20rpx'}}>
                                <Text className="12Font">保障分析</Text>
                            </View>
                        </View>

                        <View className="serve-content-col">
                            <Image src={require('../../assets/images/xf.png')} className="serve-content-icons" />
                            <View style={{marginTop: '20rpx'}}>
                                <Text className="12Font">续费提醒</Text>
                            </View>
                        </View>

                        <View className="serve-content-col">
                            <Image src={require('../../assets/images/xzlp.png')} className="serve-content-icons" />
                            <View style={{marginTop: '20rpx'}}>
                                <Text className="12Font">协助理赔</Text>
                            </View>
                        </View>

                        <View className="serve-content-col">
                            <Image src={require('../../assets/images/one-serve.png')} className="serve-content-icons" />
                            <View style={{marginTop: '20rpx'}}>
                                <Text className="12Font">一对一服务</Text>
                            </View>
                        </View>
                    </View>


                    <ConfirmInfo />

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
                        <Text style={{color: '#FE9B14', fontSize: '40rpx', marginLeft: '18rpx'}}>¥14888</Text>
                    </View>
                    <View className="float-right-pay-button">
                        确定支付
                    </View>
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

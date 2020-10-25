/**
 * Created by liyigang on 24/10/2020.
 */
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtInputNumber } from 'taro-ui'
import ConfirmInfo from './components/confirmInfo'
import logoImg from '../../assets/images/logo_taro.png'
import './confirm-order.scss'

export default class ConfirmOrder extends Taro.Component {
    config = {
        navigationBarTitleText: '托管'
    }

    constructor () {
        super(...arguments)

        this.state = {
            current: 0,
            buyCount: 1
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

    handleChange() {

    }


    render () {
        const { current } = this.state

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
                            min={0}
                            max={10}
                            step={1}
                            value={this.state.buyCount}
                            onChange={this.handleChange.bind(this)}
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
            </View>
        )
    }
}

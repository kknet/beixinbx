/**
 * Created by liyigang on 24/10/2020.
 */
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import * as service from './services'
import './startBxOrder.scss'

export default class StartBxOrder extends Taro.Component {
    config = {
        navigationBarTitleText: '立马托管'
    }

    constructor () {
        super(...arguments)

        this.state = {
            current: 1,
            itemList: []
        }
    }

    componentDidMount (options) {
      this.requestGetItemPrice()
    }

    requestGetItemPrice() {
      Taro.showLoading({
        title: '加载中'
      })
      service.requestGetSchemeList({}, {}).then((res) => {
        Taro.hideLoading()
        this.setState({
          itemList: res.data.data
        })
        console.log('项目列表', res.data)
      })
    }
    
    goToOrderConfirm = () => {
        const url = '/pages/confirmOrder/index'
        const { current } = this.state
        Taro.navigateTo({
            // url: `/pages/panel/index?id=${id.toLowerCase()}`
            url: `${url}?type=${current}`
        })
    }

    changeTabs = (e) => {
        console.log('切换tabsIndex', e)
        const tabsIndex = parseInt(e.currentTarget.dataset.tabs, 10)
        this.setState({
            current: tabsIndex
        })
    }

    render () {
        const { current, itemList } = this.state

        return (
            <View className="bx-page">
                <View className="header-banner">
                    <Image src={require('../../assets/images/twice-ceshi.jpg')} className="banner-image" />
                </View>

                <View className="start-bx-content">
                    <View className="start-bx-title-row">
                        <View onClick={this.changeTabs} data-tabs="1" className={current === 1?'start-bx-title-col start-bx-title-checked': 'start-bx-title-col'}>{itemList[0].title}</View>
                        <View onClick={this.changeTabs} data-tabs="2" className={current === 2?'start-bx-title-col start-bx-title-checked': 'start-bx-title-col'}>{itemList[1].title}</View>
                    </View>

                    {current === 1?
                        <View className="start-bx-info-content">
                            <View className="start-bx-info">
                                <Text style={{color: '#FE9B14', fontSize: '60rpx'}}>{itemList[0].price}</Text>
                                <Text>元/年(每份)</Text>
                            </View>
                            <View className="start-bx-info">
                                <Text className="start-bx-small-words">原价{itemList[0].originalPrice}元/年 (每份)</Text>
                            </View>

                            <View className="start-bx-info">
                                <Text className="start-bx-small-words">{itemList[0].subtitle}</Text>
                            </View>

                            <View style={{textAlign: 'center', marginTop: '50rpx'}}>
                                <Text>服务内容</Text>
                            </View>

                            <View className="serve-content-rows">
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
                            </View>
                        </View>
                        :
                        <View className="start-bx-info-content">
                            <View className="start-bx-info">
                                <Text style={{color: '#FE9B14', fontSize: '60rpx'}}>{itemList[1].price}</Text>
                                <Text>元/年(每份)</Text>
                            </View>
                            <View className="start-bx-info">
                                <Text className="start-bx-small-words">原价{itemList[1].originalPrice}元/年 (每份)</Text>
                            </View>

                            <View className="start-bx-info">
                                <Text className="start-bx-small-words">{itemList[1].subtitle}</Text>
                            </View>

                            <View style={{textAlign: 'center', marginTop: '50rpx'}}>
                                <Text>服务内容</Text>
                            </View>

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
                        </View>
                    }

                    <View className="go-to-pay-button" onClick={this.goToOrderConfirm}>立即支付</View>
                </View>
            </View>
        )
    }
}

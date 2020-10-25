/**
 * Created by liyigang on 24/10/2020.
 */
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import logoImg from '../../assets/images/logo_taro.png'
import './startBxOrder.scss'

export default class StartBxOrder extends Taro.Component {
    config = {
        navigationBarTitleText: '立马托管'
    }

    constructor () {
        super(...arguments)

        this.state = {
            current: 0
        }
    }

    onShareAppMessage () {
        return {
            title: 'Taro UI',
            path: '/pages/index/index',
            imageUrl: 'http://storage.360buyimg.com/mtd/home/share1535013100318.jpg'
        }
    }

    gotoPanel = e => {
        const { id } = e.currentTarget.dataset
        Taro.navigateTo({
            // url: `/pages/panel/index?id=${id.toLowerCase()}`
            url: `/pages/${id.toLowerCase()}/index`
        })
    }

    goToDemo = e => {
        Taro.navigateTo({
            // url: `/pages/panel/index?id=${id.toLowerCase()}`
            url: `/pages/demo/demo`
        })
    }

    handleClick = (value) => {
        this.setState({
            current: value
        })
    }

    render () {
        const tabList = [{ title: '单份管理' }, { title: '家庭托管' }]

        return (
            <View className="bx-page">
                <View className="header-banner">
                    <Image src={require('../../assets/images/twice-ceshi.jpg')} className="banner-image" />
                </View>

                <View className="start-bx-content">
                    <View className="start-bx-title-row">
                        <View className="start-bx-title-col">单份托管</View>
                        <View className="start-bx-title-col">家庭托管</View>
                    </View>

                    <View className="start-bx-info-content">
                        <View className="start-bx-info">
                            <Text style={{color: '#FE9B14', fontSize: '60rpx'}}>9.9</Text>
                            <Text>元/年(每份)</Text>
                        </View>
                        <View className="start-bx-info">
                            <Text className="start-bx-small-words">原价39.9元/年 (每份)</Text>
                        </View>

                        <View className="start-bx-info">
                            <Text className="start-bx-small-words">适合10份保单以下</Text>
                        </View>

                        <View style={{textAlign: 'center', marginTop: '50rpx'}}>
                            <Text>服务内容</Text>
                        </View>

                        <View className="serve-content-rows">
                            <View className="serve-content-col">
                                <Image src={require('./img/analyse-icons.png')} className="serve-content-icons" />
                                <View style={{marginTop: '20rpx'}}>
                                    <Text className="12Font">保障分析</Text>
                                </View>
                            </View>

                            <View className="serve-content-col">
                                <Image src={require('./img/xf.png')} className="serve-content-icons" />
                                <View style={{marginTop: '20rpx'}}>
                                    <Text className="12Font">续费提醒</Text>
                                </View>
                            </View>

                            <View className="serve-content-col">
                                <Image src={require('./img/xzlp.png')} className="serve-content-icons" />
                                <View style={{marginTop: '20rpx'}}>
                                    <Text className="12Font">协助理赔</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

/**
 * Created by liyigang on 24/10/2020.
 */
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import '../confirm-order.scss'

export default class ConfirmInfo extends Taro.Component {
    constructor () {
        super(...arguments)

        this.state = {
            bxType: 0
        }
    }

    componentDidMount (options) {
        console.log('测试', this.$router, this)
        if(this.$router.params.type) {
            const type = this.$router.params.type
            this.setState({
                bxType: parseInt(type, 10)
            })
        }
    }

    onShareAppMessage () {
        return {
            title: 'Taro UI',
            path: '/pages/index/index',
            imageUrl: 'http://storage.360buyimg.com/mtd/home/share1535013100318.jpg'
        }
    }


    render () {
        const { bxType } = this.state

        return (
            <View className="confirm-info-content">
                <View style={{fontSize: '32rpx'}}>
                    限时推广价：
                    <Text style={{color: '#FE9B14', fontSize: '60rpx'}}>699</Text>
                    元/年(每份)
                </View>
                <View>
                    <Text style={{fontSize: '20rpx', color:'#111', textDecoration: 'line-through'}}>
                        原价999元/年 (每份)
                    </Text>
                </View>

                <View>
                    <Text style={{fontSize: '20rpx', color:'#111'}}>
                        家庭保单托管不限保单份数
                    </Text>
                </View>
            </View>
        )
    }
}

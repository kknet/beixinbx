/**
 * Created by liyigang on 24/10/2020.
 */
// 添加保单
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import logoImg from '../../assets/images/logo_taro.png'
import './addBxBd.scss'

export default class AddBxBd extends Taro.Component {
    config = {
        navigationBarTitleText: '添加保单'
    }

    constructor () {
        super(...arguments)

        this.state = {
            current: 0,
            value: ''
        }
    }

    onShareAppMessage () {
        return {
            title: 'Taro UI',
            path: '/pages/index/index',
            imageUrl: 'http://storage.360buyimg.com/mtd/home/share1535013100318.jpg'
        }
    }

    handleChange() {}


    render () {
        const { current } = this.state

        return (
            <View className="bx-page">
                <View className="bx-person-input">
                    <View>被保人</View>
                    <Input className="bx-person-input-control" type='text' placeholder='请输入保单中的被保人' />
                </View>

                <View className="bx-order-image-block">
                    <View className="bx-order-image-title">
                        <Text style={{fontSize: '26rpx', color: '#999999'}}>请拍照添加保单</Text>
                    </View>

                    <View className="line"></View>

                    <View className="bx-order-image-section">
                        <View className="bx-order-image-row-title">
                            <View>
                                <Text style={{color: '#222222', fontSize: '34rpx'}}>保单页</Text>
                            </View>

                            <View>
                                <Text style={{fontSize: '26rpx', color: '#999999'}}>0/2</Text>
                            </View>
                        </View>
                        
                        <View className="bx-order-image-row">
                            <View className="bx-order-image-col">
                                <Image src={require('./image/addNewPic.png')} className="add-pic-icons" />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import logoImg from '../../assets/images/logo_taro.png'
import './bxbx-home.css'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '保管家'
  }

  constructor () {
    super(...arguments)

    this.state = {
        homeMenuIndex: {
            line1: [
                {
                    label: '保单保全',
                    icons: 'icon1.png'
                },
                {
                    label: '申请理赔',
                    icons: 'icon2.png'
                },
                {
                    label: '医疗绿道',
                    icons: 'icon3.png'
                }
            ]
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

  gotoPanel = e => {
    const { id } = e.currentTarget.dataset
    Taro.navigateTo({
      // url: `/pages/panel/index?id=${id.toLowerCase()}`
      url: `/pages/${id.toLowerCase()}/index`
    })
  }

  goToDetailOrder = e => {
    Taro.navigateTo({
      // url: `/pages/panel/index?id=${id.toLowerCase()}`
      url: `/pages/startBxOrder/index`
    })
  }

  render () {
    const { homeMenuIndex } = this.state
    const { line } = homeMenuIndex

    return (
      <View className='bx-page'>
        <View className="home-title-menu">
            {Object.keys(homeMenuIndex).map((v, k) => {
                return (
                    <View className="home-title-menu-row">
                        {homeMenuIndex[v].map((item) => {
                            console.log('读取图片', './'+item.icons)
                            let menuIcon = `./${item.icons}`
                            return (
                                <View className="home-title-menu-col">
                                    <Image className="home-title-menu-icons" src={require('./img/icon1.png')} />
                                    <View style={{marginTop: '16rpx'}}>
                                        <Text>{item.label}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )
            })}
        </View>
        <View className="bx-home-content">
            <View className="start-bx-button" onClick={this.goToDetailOrder}>
                <Image className="start-bx-button-image" src={require('./img/start_button.png')} />
                <View className="start-bx-button-text">
                    <Text>立马托管</Text>
                </View>
            </View>
        </View>
      </View>
    )
  }
}

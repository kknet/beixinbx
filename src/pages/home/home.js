import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import logoImg from '../../assets/images/logo_taro.png'
import './bxbx-home.css'

import Icon1 from './img/icon1.png'
import Icon2 from './img/icon2.png'
import Icon3 from './img/icon3.png'

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
                    icons: Icon1
                },
                {
                    label: '申请理赔',
                    icons: Icon2
                },
                {
                    label: '医疗绿道',
                    icons: Icon3
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

  goToPage = e => {
      Taro.navigateTo({
          // url: `/pages/panel/index?id=${id.toLowerCase()}`
          url: `/pages/startBxOrder/addBxBd`
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
                    <View className="home-title-menu-row" key={`home-${k}`}>
                        {homeMenuIndex[v].map((item) => {
                            return (
                                <View key={item.icons} className="home-title-menu-col" onClick={this.goToPage}>
                                    <Image className="home-title-menu-icons" src={item.icons} />
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

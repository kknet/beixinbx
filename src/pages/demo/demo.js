import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import logoImg from '../../assets/images/logo_taro.png'


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

  render () {
    const { content } = this.state

    return (
      <View className='page page-index'>
        <View>
          {content}
        </View>
      </View>
    )
  }
}

import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import logoImg from '../../assets/images/logo_taro.png'
import './index.scss'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '贝鑫保险'
  }

  constructor () {
    super(...arguments)

    this.state = {
      content: '贝鑫保险首页'
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

  render () {
    const { content } = this.state

    return (
      <View className='page page-index'>
        <View>
          {content}
        </View>
        <AtButton type='primary' onClick={this.goToDemo}>点击跳转</AtButton>
      </View>
    )
  }
}

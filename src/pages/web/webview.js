import Taro from '@tarojs/taro'
import { View, Image, WebView } from '@tarojs/components'
import { AtButton } from 'taro-ui'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '保管家报告'
  }

  constructor () {
    super(...arguments)

    this.state = {
      autoHeight: '74%',
      isShowLogin: false,
	    userId: Taro.getStorageSync('userId').toString(),
	    token: Taro.getStorageSync('token').toString()
    }

    this.isCanClick = true
  }

  async componentDidMount() {
    
  }

  render () {
    const { userId,token } = this.state

    return (
      <View className='bx-page'>
        <WebView src={`https://baoguanjia.ltd/pdf?userId=${userId}&token=${token} `} />
      </View>
    )
  }
}

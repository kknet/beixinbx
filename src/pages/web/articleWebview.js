import Taro from '@tarojs/taro'
import { View, Image, WebView } from '@tarojs/components'
import { AtButton } from 'taro-ui'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '文章详情'
  }

  constructor () {
    super(...arguments)

    this.state = {
      autoHeight: '74%',
      isShowLogin: false,
	    userId: Taro.getStorageSync('userId').toString(),
	    token: Taro.getStorageSync('token').toString(),
      articleId: ''
    }

    this.isCanClick = true
  }

  componentDidMount() {
    const articleId = this.$router.params.articleId
    this.setState({
      articleId: articleId
    })
  }

  onShareAppMessage () {
    return {
      title: '朋友，这里可以做保单托管，以后你的保单就有人服务了。',
      path: `/pages/home/home?articleId=${this.state.articleId}`,
      imageUrl: `${require('../../assets/images/share.png')}`
    }
  }

  render () {
    const { articleId,token } = this.state

    return (
      <View className='bx-page'>
        <WebView src={`https://baoguanjia.ltd/articleInfo?articleId=${articleId}&token=${token} `} />
      </View>
    )
  }
}

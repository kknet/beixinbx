import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import WxParse from '../components/wxParse/wxParse'
import * as service from './services'
import './detail.scss'

export default class ArticleDetail extends Taro.Component {
  config = {
    navigationBarTitleText: '获取数百万投资'
  }

  constructor () {
    super(...arguments)

    this.state = {
      articleId: '',
      articleInfo: {}
    }
  }

  componentDidMount() {
    const id = this.$router.params.id
    this.setState({
      articleId: id
    }, () => {
      this.getArticleInfoById()
    })
  }

  getArticleInfoById() {
    let queryData = {
      id: this.state.articleId
    }
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    service.requestGetArticleInfoById(queryData, {}).then((res) => {
      Taro.hideLoading()
      if(res.data.data.createTime !== null) {
        res.data.data.times = res.data.data.createTime.split(' ')[0]
      }
      this.setState({
        articleInfo: res.data.data
      }, () => {
        WxParse.wxParse('article', 'html', res.data.data.content, this.$scope, 5)
      })
    })
  }

  onShareAppMessage () {
    return {
      title: '朋友，这里可以做保单托管，以后你的保单就有人服务了。',
      path: `/pages/home/home?articleId=${this.state.articleId}`,
      imageUrl: `${require('../../assets/images/share.png')}`
    }
  }

	onWxParseTagATap(ev) {
		console.log('超链接解析', ev)
	}

  // <Text style={{marginLeft: '25rpx'}}>{articleInfo.summary}</Text>
  render () {
    const {articleInfo} = this.state
    return (
      <View className='bx-page' style={{overflow: 'auto'}}>
        <Image src={articleInfo.imageUrl} className="article-banner-image" />
        <View className="article-content">
          <View className="article-info-title">
            <Text>{articleInfo.title}</Text>
          </View>
          <View className="article-other-info">
            <Text className="article-other-words">{articleInfo.times}</Text>
          </View>
          <View className="content-nodes">
            <import src='../components/wxParse/wxParse.wxml' />
            <template is='wxParse' data='{{wxParseData:article.nodes}}'/>
          </View>
        </View>
      </View>
    )
  }
}

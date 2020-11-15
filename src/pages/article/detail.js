import Taro from '@tarojs/taro'
import { View, Image, RichText } from '@tarojs/components'
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
    service.requestGetArticleInfoById(queryData, {}).then((res) => {
      console.log('查询文章详情', res.data)
      if(res.data.data.createTime !== null) {
        res.data.data.times = res.data.data.createTime.split(' ')[0]
      }
      this.setState({
        articleInfo: res.data.data
      })
    })
  }


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
            <Text style={{marginLeft: '25rpx'}}>{articleInfo.summary}</Text>
          </View>
          <View className="content-nodes">
            <RichText nodes={articleInfo.content} />
          </View>
        </View>
      </View>
    )
  }
}

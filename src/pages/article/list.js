import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import * as service from './services'
import './list.scss'

export default class ArticleList extends Taro.Component {
  config = {
    navigationBarTitleText: '保单保全'
  }

  constructor () {
    super(...arguments)

    this.state = {
      type: 0,
      articleList: []
    }
  }

  componentDidMount() {
    const type = this.$router.params.type
    this.setState({
      type: type
    }, () => {
      this.getArticleList()
    })
  }

  getArticleList() {
    let queryData = {
      page: 1,
      pageSize: 10,
      type: this.state.type
    }
    Taro.showLoading({
      title: Taro.loadingText,
      mask: true
    })
    service.requestGetArticleList(queryData, {}).then((res) => {
      Taro.hideLoading()
      res.data.data.list.forEach((item) => {
        if(item.createTime !== null) {
          item.times = item.createTime.split(' ')[0]
        }
      })
      this.setState({
        articleList: res.data.data.list
      })
    })

    // <View className='current-red'>最近读过</View>
  }


  render () {

    const {articleList} = this.state
    return (
      <View className='bx-page'>
        <View className='article-list-section'>
          {articleList.map((item, index) => {
            return (
              <View>
                <View
                  className='article-list-row'
                  data-url={`/pages/web/articleWebview?articleId=${item.id}`}
                  onClick={Taro.goToTarget}
                >
                  <Image src={item.imageUrl} className='article-image' />
                  <View className='article-list-col'>
                    <View className='article-title'>{item.title}</View>
                    <View className='article-time'>{item.times}</View>
                    <View className='article-desc'>{item.summary?item.summary: ''}</View>
                  </View>
                </View>
                <View className="list-line"></View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

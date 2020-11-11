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
    service.requestGetArticleList(queryData, {}).then((res) => {
      console.log('文章列表', res.data)
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
                  data-url={`/pages/article/detail?id=${item.id}`}
                  onClick={Taro.goToTarget}
                >
                  <Image src={require('./image/twice-ceshi.jpg')} className='article-image' />
                  <View className='article-list-col'>
                    <View className='article-title'>{item.title}</View>
                    <View className='article-desc'>{item.content?item.content: ''}</View>
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

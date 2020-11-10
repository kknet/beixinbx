import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './list.scss'

export default class ArticleList extends Taro.Component {
  config = {
    navigationBarTitleText: '保单保全'
  }

  constructor () {
    super(...arguments)

    this.state = {

    }
  }


  render () {

    return (
      <View className='bx-page'>
        <View className='article-list-section'>
          <View className='article-list-row'>
            <Image src={require('./image/twice-ceshi.jpg')} className='article-image' />
            <View className='article-list-col'>
              <View className='article-title'>获数百万天使投资</View>
              <View className='article-desc'>由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</View>
            </View>
            <View className='current-red'>最近读过</View>
          </View>
        </View>
      </View>
    )
  }
}

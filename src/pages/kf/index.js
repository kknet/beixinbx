import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './kf.scss'

export default class KfIndex extends Taro.Component {
  config = {
    navigationBarTitleText: '联系客服'
  }

  constructor () {
    super(...arguments)

    this.state = {
      
    }
  }
    

  render () {

    return (
      <View className='bx-page'>
        <View className="button-container">
          <Button openType="contact" className="my-contact-button">
            <View className="kf-row">进入客服</View>
          </Button>
        </View>
      </View>
    )
  }
}

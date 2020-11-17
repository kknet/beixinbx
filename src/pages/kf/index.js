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
            <View className="start-bx-button">
              <Image className="start-bx-button-image" src={require('../home/img/start_button.png')} />
              <View className="start-bx-button-text">
                <Text>联系客服</Text>
              </View>
            </View>
          </Button>
        </View>
      </View>
    )
  }
}

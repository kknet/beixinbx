/**
 * Created by liyigang on 24/10/2020.
 */
// 添加保单
import Taro from '@tarojs/taro'
import * as service from './services'
import { View, Image } from '@tarojs/components'
import './finishBd.scss'

export default class FinishBd extends Taro.Component {
  config = {
    navigationBarTitleText: '确定提交'
  }

  constructor () {
    super(...arguments)

    this.state = {
      descText: '请添加保管家客服咨询进度',
      type: '',
      reportImage: ''
    }
  }

  componentDidMount() {
    if(this.$router.params.type) {
      if(this.$router.params.type === 'report') {
        // this.getReport()
        Taro.setNavigationBarTitle({
          title: '保单报告'
        })
        this.setState({
          descText: '请联系客服咨询保单报告'
        })
      }
      this.setState({
        type: this.$router.params.type
      })
    }
  }

  savePicToAlbum = (ev) => {
    const fileImage = ev.currentTarget.dataset.src
    Taro.saveImageToPhotosAlbum({
      filePath: fileImage,
      success: (res) => {
        Taro.showToast({
          title: '二维码保存成功',
          icon: 'success',
          duration: 2000
        })
        console.log('保存成功', res)
      },
      fail: (err) => {
        console.log('保存失败', err)
      }
    })
  }

  render () {
    const {descText, type, reportImage} = this.state
    console.log('路由', type)

    return (
      <View className={`bx-page`}>
        {type === 'wait'?
          <View className="finish-title">
            <Text className="finish-title-words">已提交完成，工作人员处理中…</Text>
          </View>
          :
          ''
        }
        <View className={`finish-scan ${type === 'report'?'report-block': ''}`}>
          {/*<Image onClick={this.savePicToAlbum} data-src={require('./image/scan.jpg')} src={require('./image/scan.jpg')} className="finish-scan-image" />*/}
          <Image onClick={this.savePicToAlbum} data-src={reportImage} src={reportImage} className="finish-scan-image" />
        </View>
        <View className="finish-tips">
          <Text className="finish-tips-words">{descText}</Text>
        </View>
      </View>
    )
  }
}

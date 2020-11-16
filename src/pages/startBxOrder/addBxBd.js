/**
 * Created by liyigang on 24/10/2020.
 */
// 添加保单
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import httpService from '../../utils/http'
import * as service from './services'
import {startPayMethods} from '../../utils/payMethods'
import logoImg from '../../assets/images/logo_taro.png'
import './addBxBd.scss'

export default class AddBxBd extends Taro.Component {
    config = {
        navigationBarTitleText: '添加保单'
    }

    constructor () {
        super(...arguments)

        this.state = {
            buyCount: 0,
            current: 0,
            value: '',
            orderId: '',
            schemeId: '',
            orderObj: {
              insurant: '',
              policyImgs: [],
              bankCards: [],
              otherImg: [],
              schemeId: '1'  // 1 单份  2 家庭
            }
        }
    }

  componentDidMount() {
    const {orderId, schemeId, buyCount} = this.$router.params
    if(orderId) {
      this.setState({
        orderId: orderId,
        schemeId: schemeId,
        buyCount: buyCount
      }, () => {
        console.log('保单参数', orderId, schemeId, buyCount)
      })
    }
  }

    onShareAppMessage () {
        return {
            title: 'Taro UI',
            path: '/pages/index/index',
            imageUrl: 'http://storage.360buyimg.com/mtd/home/share1535013100318.jpg'
        }
    }

    handleChange() {}

  InputHandler = (event) => {
    let value = event.detail.value
    let formObj = this.state.orderObj
    formObj.insurant = value
    this.setState({
      orderObj: formObj
    })
  }

  sendFile = (files) => {
    let token = Taro.getStorageSync('token')
    return new Promise((reslove, reject) => {
      Taro.uploadFile({
        url: httpService.host + httpService.baseUrl + '/common/fileApi/file?type=1', //仅为示例，非真实的接口地址
        filePath: files[0],
        header: {token: token},
        name: 'file',
        success: (res) => {
          const result = JSON.parse(res.data)
          if(result.code === 50004) {
            httpService.refreshStorageToken()
            this.sendFile(files)
          }
          const uploadFile = `${httpService.host}${httpService.baseUrl}${result.data[0]}`
          reslove(uploadFile)
          //do something
        }
      })
    })

  }

  // 上传图片
  chooseImage(type) {
    Taro.chooseImage({
      count: 1,
      sourceType: ["album", "camera"],
      success: async (res) => {
        Taro.showLoading({
          title: Taro.loadingText
        })
        const {policyImgs, bankCards, otherImg} = this.state.orderObj
        const tempFilePaths = res.tempFilePaths
        let imgFile = await this.sendFile(tempFilePaths)
        Taro.hideLoading()
        let orderObj = this.state.orderObj
       
        if(type === 'policy') {
          policyImgs.push(imgFile)
          orderObj.policyImgs = policyImgs
        } else if(type === 'bankCard') {
          bankCards.push(imgFile)
          orderObj.bankCards = bankCards
        } else if(type === 'otherImg') {
          otherImg.push(imgFile)
          orderObj.otherImg = bankCards
        }
        this.setState({
          orderObj: orderObj
        })
      }
    })
  }

  clearFormModel() {
    let initModel = {
      insurant: '',
      policyImgs: [],
      bankCards: [],
      otherImg: [] // 1 单份  2 家庭
    }
    this.setState({
      orderObj: initModel
    })
  }

  createNewOrder = (ev) => {
    let type = ev.currentTarget.dataset.type
    const {policyImgs, bankCards, otherImg, insurant, schemeId, orderId, buyCount} = this.state.orderObj
    if(insurant === '') {
      Taro.showToast({
        title: '请输入保险人名称',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(bankCards.length === 0) {
      Taro.showToast({
        title: '请上传银行卡',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(policyImgs.length === 0) {
      Taro.showToast({
        title: '请上传保单',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    const orderForm = {
      imageVO: [
        {
          bankCardImg: policyImgs.join(';'),
          otherImg: bankCards.join(';'),
          policyImg: otherImg.join(';')
        }
      ],
      insurant: insurant,
      orderId: this.state.orderId,
      schemeId: this.state.schemeId,
      userId: Taro.getStorageSync('userId').toString()
    }

    service.createOrder(orderForm, {}).then((res) => {
      Taro.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 1000
      })
      // buyCount 减1
      if(this.state.schemeId == 1) {
        this.setState({
          buyCount: parseInt(buyCount, 10) - 1
        }, () => {

        })
      }

      setTimeout(() => {
        let nextUrl = ''
        if(type === 'next') {
          this.clearFormModel()
          return
        } else {
          nextUrl = '/pages/startBxOrder/finishBd?type=wait'
        }
        Taro.redirectTo({
          url: nextUrl
        })
      }, 1000)
    })
  }


    render () {
        const { current, buyCount, schemeId } = this.state
        const {insurant, policyImgs, bankCards, otherImg} = this.state.orderObj

        return (
            <View className="bx-page">
                <View className="bx-person-input">
                    <View>被保人</View>
                    <Input onInput={this.InputHandler} value={insurant} className="bx-person-input-control" type='text' placeholder='请输入保单中的被保人' />
                </View>

                <View className="bx-order-image-block">
                    <View className="bx-order-image-title">
                        <Text style={{fontSize: '26rpx', color: '#999999'}}>请拍照添加保单</Text>
                    </View>

                    <View className="line" style={{marginTop: '16rpx'}}></View>

                    <View className="bx-order-image-section">
                        <View className="bx-order-image-row-title">
                            <View>
                                <Text style={{color: '#222222', fontSize: '34rpx'}}>保单页</Text>
                            </View>

                            <View>
                                <Text style={{fontSize: '26rpx', color: '#999999'}}>{policyImgs.length}/2</Text>
                            </View>
                        </View>

                        <View className="bx-order-image-row">
                            <View className="bx-order-image-col">
                                {policyImgs.map((item, index) => {
                                  return (
                                    <Image src={item} key={index} className="add-pic-icons" alt="保单图片" />
                                  )
                                })}
                                <Image src={require('./image/addNewPic.png')} onClick={() => this.chooseImage('policy')} className="add-pic-icons" />
                            </View>
                        </View>
                    </View>

                    <View className="line" style={{marginTop: '30rpx'}}></View>

                    <View className="bx-order-image-section">
                        <View className="bx-order-image-row-title">
                            <View>
                                <Text style={{color: '#222222', fontSize: '34rpx'}}>投保单或银行卡</Text>
                            </View>

                            <View>
                                <Text style={{fontSize: '26rpx', color: '#999999'}}>0/2</Text>
                            </View>
                        </View>

                        <View className="bx-order-image-row">
                            <View className="bx-order-image-col">
                              {bankCards.map((item, index) => {
                                return (
                                  <Image src={item} key={index} className="add-pic-icons" alt="银行卡图片" />
                                )
                              })}
                                <Image src={require('./image/addNewPic.png')} onClick={() => this.chooseImage('bankCard')} className="add-pic-icons" />
                            </View>
                        </View>
                    </View>

                    <View className="line" style={{marginTop: '30rpx'}}></View>

                    <View className="bx-order-image-section">
                        <View className="bx-order-image-row-title">
                            <View>
                                <Text style={{color: '#222222', fontSize: '34rpx'}}>其他(现价单价或批单页)</Text>
                            </View>

                            <View>
                                <Text style={{fontSize: '26rpx', color: '#999999'}}>0/2</Text>
                            </View>
                        </View>

                        <View className="bx-order-image-row">
                            <View className="bx-order-image-col">
                              {otherImg.map((item, index) => {
                                return (
                                  <Image src={item} key={index} className="add-pic-icons" alt="其他图片" />
                                )
                              })}
                                <Image src={require('./image/addNewPic.png')} onClick={() => this.chooseImage('otherImg')} className="add-pic-icons" />
                            </View>
                        </View>
                    </View>

                    <View className="line" style={{marginTop: '30rpx'}}></View>

                    <View style={{fontSize: '26rpx', marginTop: '30rpx', color: '#111'}}>
                        <Text>
                            可上传保单页，投保单页，现价单和批单页。所上传图片均需同一张保单号下的保单信息，请确保图片清晰和保单内容完整。
                        </Text>
                        <Text style={{textDecoration: 'underline', color: '#576b95'}}>查看实例</Text>
                    </View>
                </View>

              <View className="confirm-bottom-row">
                {buyCount > 1 || schemeId == 2?
                  <View style={{right: '262rpx'}} className="float-right-pay-button" data-type="next" onClick={this.createNewOrder}>
                    下一份
                  </View>
                  :
                  ''
                }
                <View className="float-right-pay-button" data-type="submit" onClick={this.createNewOrder}>
                  保存保单
                </View>
              </View>
            </View>
        )
    }
}

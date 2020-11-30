import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import * as service from '../services'
import '../myOrderInfo.scss'
import BZOnline from '../image/online-icons.png'

let fields = [
    {
        title: '',
        children: [
            {
                filedsName: '投保人名称',
                value: 'policyHolder',
                filedsValue: ''
            },
            {
                filedsName: '被投保人名称',
                value: 'insurant',
                filedsValue: ''
            },
            {
                filedsName: '被保险人是',
                value: 'relationship',
                filedsValue: ''
            }
        ]
    },
    {
        title: '保单概况',
        children: [
            {
                filedsName: '保险公司',
                value: 'company',
                filedsValue: ''
            },
            {
                filedsName: '产品名称',
                value: 'name',
                filedsValue: ''
            },
            {
                filedsName: '保单生效日',
                value: 'effectiveDate',
                filedsValue: ''
            },
            {
                filedsName: '保费',
                value: 'cost',
                filedsValue: ''
            },
            {
                filedsName: '缴费时长',
                value: 'costYear',
                filedsValue: ''
            },
        ]
    },
    {
        title: '保单详情：主险',
        children: [
            {
                filedsName: '保障类型',
                value: 'mainReturnVO.type',
                filedsValue: ''
            },
            {
                filedsName: '保额',
                value: 'mainReturnVO.coverage',
                filedsValue: ''
            },
            {
                filedsName: '保障期限',
                value: 'mainReturnVO.duration',
                filedsValue: ''
            }
        ]
    }
]

export default class MyOrder extends Taro.Component {
  config = {
    navigationBarTitleText: '我的保单'
  }

  constructor () {
    super(...arguments)

    this.state = {
      insuranceId: '',
      insuranceObj: {},
      fields: fields,
      appendReturn: [],  //  附加险
      benificiary: []  //  受益人
    }
  }

  componentDidMount() {
    const insuranceId = this.$router.params.insuranceId
    if(insuranceId) {
      this.setState({
        insuranceId: insuranceId
      }, () => {
        this.getInsuranceDetailById()
      })
    }
  }

  getInsuranceDetailById() {
    let params = {
      insuranceId: this.state.insuranceId
    }
    service.requestGetMyInsuranceDetailById(params, {}).then((res) => {
      let fields = this.state.fields.slice()
      fields.forEach((v, k) => {
        v.children.forEach((val, key) => {
          if(val.value !== '') {
            // 深层对象
            if(val.value.indexOf('.') !== -1) {
              let obj = val.value.split('.')[0]
              let objChild = val.value.split('.')[1]
              console.log('对象', val.value,obj , objChild , res.data, res.data.data[obj])
              if(res.data.data[obj] && res.data.data[obj][objChild]) {
                if(res.data.data[obj][objChild] !== null) {
                  fields[k].children[key].filedsValue = res.data.data[obj][objChild]
                }
              }
            } else {
              if(res.data.data[val.value] !== null) {
                fields[k].children[key].filedsValue = res.data.data[val.value]
              }
            }
          }
        })
      })

      console.log('insuranceObj', res.data.data)
      this.setState({
        insuranceObj: res.data.data,
        fields: fields
      })
    })
  }


  render () {
      const {insuranceObj, fields} = this.state
      return (
      <View className='bx-page' style={{overflow: 'auto'}}>
        <View className="bx-header-info">
            <Image src={BZOnline} className="bz-online-image" />
            <View>
                <Text className="bx-info-small-words">{insuranceObj.name?insuranceObj.name: ''}</Text>
            </View>

            <View style={{minHeight: '60rpx'}}>
                <Text>{insuranceObj.company?insuranceObj.company: ''}</Text>
            </View>

            <View>
                <Text className="bx-info-small-words">保单号：{insuranceObj.orderNo}</Text>
            </View>
        </View>

          {fields.map((value, index) => {
              return (
                  <View className="basic-info-section" key={`basic-${index}`}>
                      {value.title === ''?'': <View className="basic-info-row">
                          <Text style={{fontSize: '34rpx', color: '#666'}}>
                              {value.title}
                          </Text>
                      </View>}
                      {value.children.map((item, idx) => {
                          return (
                              <View key={`child-detail${idx}`}>
                                  <View className="basic-info-row">
                                      <View className="basic-info-title-name">
                                          <Text>{item.filedsName}</Text>
                                      </View>
                                      <View className="basic-info-title-tips">
                                          <Text>{item.filedsValue}</Text>
                                      </View>
                                  </View>

                                  <View className="basic-info-line"></View>
                              </View>
                          )
                      })}
                  </View>
              )
          })}

          {insuranceObj.appendReturnVO && insuranceObj.appendReturnVO.map((item, idx) => {
            return (
              <View className="basic-info-section">
                <View className="basic-info-row">
                  <Text style={{fontSize: '34rpx', color: '#666'}}>
                    附加险
                  </Text>
                </View>
                <View key={`appendReturn${idx}`}>
                  <View className="basic-info-row">
                    <View className="basic-info-title-name">
                      <Text>附加险名称</Text>
                    </View>
                    <View className="basic-info-title-tips">
                      <Text>{item.name}</Text>
                    </View>
                  </View>

                  <View className="basic-info-row">
                    <View className="basic-info-title-name">
                      <Text>保障类型</Text>
                    </View>
                    <View className="basic-info-title-tips">
                      <Text>{item.type}</Text>
                    </View>
                  </View>

                  <View className="basic-info-row">
                    <View className="basic-info-title-name">
                      <Text>保额</Text>
                    </View>
                    <View className="basic-info-title-tips">
                      <Text>{item.coverage}</Text>
                    </View>
                  </View>

                  <View className="basic-info-row">
                    <View className="basic-info-title-name">
                      <Text>保障期限</Text>
                    </View>
                    <View className="basic-info-title-tips">
                      <Text>{item.duration}</Text>
                    </View>
                  </View>

                  <View className="basic-info-line"></View>
                </View>
              </View>
            )
          })}

          {insuranceObj.benificiaryReturnVO && insuranceObj.benificiaryReturnVO.map((item, idx) => {
            return (
              <View className="basic-info-section">
                <View className="basic-info-row">
                  <Text style={{fontSize: '34rpx', color: '#666'}}>
                    受益人
                  </Text>
                </View>
                <View key={`appendReturn${idx}`}>
                  <View className="basic-info-row">
                    <View className="basic-info-title-name">
                      <Text>受益人</Text>
                    </View>
                    <View className="basic-info-title-tips">
                      <Text>{item.name}</Text>
                    </View>
                  </View>

                  <View className="basic-info-line"></View>
                </View>
              </View>
            )
          })}
      </View>
    )
  }
}

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
    },
    {
        title: '附加险',
        children: [
            {
                filedsName: '附加险名称',
                value: 'appendReturnVO.name',
                filedsValue: ''
            },
            {
                filedsName: '保额',
                value: 'appendReturnVO.coverage',
                filedsValue: ''
            },
            {
                filedsName: '保障期限',
                value: 'appendReturnVO.duration',
                filedsValue: ''
            }
        ]
    },
    {
        title: '受益人',
        children: [
            {
                filedsName: '受益人',
                value: 'benificiaryReturnVO.name',
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
      fields: fields
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
              console.log('对象', val.value,obj , objChild , res.data)
              fields[k].children[key].filedsValue = res.data.data[obj][objChild]
            } else {
              fields[k].children[key].filedsValue = res.data.data[val.value]
            }
          }
        })
      })
      console.log('字段', fields)
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
            {insuranceObj.status}
            <Image src={BZOnline} className="bz-online-image" />
            <View>
                <Text className="bx-info-small-words">{insuranceObj.name}</Text>
            </View>

            <View>
                <Text>{insuranceObj.company}</Text>
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
                              <View>
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
      </View>
    )
  }
}

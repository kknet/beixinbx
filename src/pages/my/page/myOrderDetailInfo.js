import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import '../myOrderInfo.scss'
import BZOnline from '../image/online-icons.png'

const fields = [
    {
        title: '',
        children: [
            {
                filedsName: '投保人名称',
                value: '',
                filedsValue: '张三'
            },
            {
                filedsName: '被投保人名称',
                value: '',
                filedsValue: '张三'
            },
            {
                filedsName: '被保险人是',
                value: '',
                filedsValue: '张三'
            }
        ]
    },
    {
        title: '保单概况',
        children: [
            {
                filedsName: '保险公司',
                value: '',
                filedsValue: '平安保险'
            },
            {
                filedsName: '产品名称',
                value: '',
                filedsValue: '平安福'
            },
            {
                filedsName: '保单生效日',
                value: '',
                filedsValue: '2020-02-20'
            },
            {
                filedsName: '保费',
                value: '',
                filedsValue: '1000元/年'
            },
            {
                filedsName: '交费时长',
                value: '',
                filedsValue: '20年'
            },
        ]
    },
    {
        title: '保单详情：主险',
        children: [
            {
                filedsName: '保障类型',
                value: '',
                filedsValue: '重疾险'
            },
            {
                filedsName: '保额',
                value: '',
                filedsValue: '20万'
            },
            {
                filedsName: '保障期限',
                value: '',
                filedsValue: '终身'
            }
        ]
    },
    {
        title: '附加险',
        children: [
            {
                filedsName: '附加险名称',
                value: '',
                filedsValue: '重疾险'
            },
            {
                filedsName: '附加险名称',
                value: '',
                filedsValue: '重疾险'
            },
            {
                filedsName: '保额',
                value: '',
                filedsValue: '20万'
            },
            {
                filedsName: '保障期限',
                value: '',
                filedsValue: '终身'
            }
        ]
    },
    {
        title: '受益人',
        children: [
            {
                filedsName: '受益人',
                value: '',
                filedsValue: '李四'
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
      
    }
  }
    

  render () {
      return (
      <View className='bx-page'>
        <View className="bx-header-info">
            <Image src={BZOnline} className="bz-online-image" />
            <View>
                <Text className="bx-info-small-words">平安保险</Text>
            </View>

            <View>
                <Text>平安福</Text>
            </View>

            <View>
                <Text className="bx-info-small-words">保单号：P0488000000092</Text>
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

import Taro, { Component } from '@tarojs/taro'
import Home from './pages/home/home'
import Register from './pages/register/index'
export const Context = Taro.createContext(0)

import './app.scss'

class App extends Component {
  config = {
    pages: [
        'pages/home/home',  // 首页
        'pages/kf/index',  // 客服
        'pages/article/list',  // 文章列表
        'pages/article/detail',  // 文章详情
        'pages/my/my',  // 我的
        'pages/my/page/myOrder',  // 我的保单
        'pages/my/page/myOrderDetail',  // 我的保单详情
        'pages/my/page/myCustom',  // 我的客户
        'pages/my/page/myOrderDetailInfo',  // 我的保单详情信息
        'pages/startBxOrder/index', // 填写保单信息页
        'pages/confirmOrder/index', // 确认订单页
        'pages/startBxOrder/addBxBd',  // 添加保单
        'pages/startBxOrder/finishBd',  // 已完成等待
        'pages/register/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
      tabBar: {
          list: [{
              iconPath: 'assets/resource/bottom-bar/tg.png',
              selectedIconPath: 'assets/resource/bottom-bar/tg-checked.png',
              pagePath: 'pages/home/home',
              text: '保单托管'
          }, {
              iconPath: 'assets/resource/bottom-bar/kf.png',
              selectedIconPath: 'assets/resource/bottom-bar/kf-checked.png',
              pagePath: 'pages/kf/index',
              text: '联系客服'
          }, {
              iconPath: 'assets/resource/bottom-bar/my.png',
              selectedIconPath: 'assets/resource/bottom-bar/my-checked.png',
              pagePath: 'pages/my/my',
              text: '我的'
          }],
          'color': '#7F8389',
          'selectedColor': '#E48C00',
          'backgroundColor': '#fff',
          'borderStyle': 'white'
      },
  }

  componentWillMount () {
      Taro.goToTarget = (e) => {
          e.stopPropagation()
          e.preventDefault()
          const routeUrl = e.currentTarget.dataset.url
          Taro.navigateTo({
              url: `${routeUrl}`
          })
      }

      Taro.loadingText = '努力加载中...'
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return <Home />
  }
}

Taro.render(<App />, document.getElementById('app'))

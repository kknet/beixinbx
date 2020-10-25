import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index/index'
import Home from './pages/home/home'

import './app.scss'

class App extends Component {
  config = {
    pages: [
      'pages/home/home',  // 首页
      'pages/startBxOrder/index', // 填写保单信息页
      'pages/confirmOrder/index', // 确认订单页
      'pages/startBxOrder/addBxBd'  // 添加保单
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
              pagePath: 'pages/home/home',
              text: '联系客服'
          }, {
              iconPath: 'assets/resource/bottom-bar/my.png',
              selectedIconPath: 'assets/resource/bottom-bar/my-checked.png',
              pagePath: 'pages/home/home',
              text: '我的'
          }],
          'color': '#7F8389',
          'selectedColor': '#E48C00',
          'backgroundColor': '#fff',
          'borderStyle': 'white'
      },
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

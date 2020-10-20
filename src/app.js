import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index/index'
import Home from './pages/home/home'

import './app.scss'

class App extends Component {
  config = {
    pages: [
      'pages/home/home',
      'pages/demo/demo',
      'pages/index/index',
      'pages/basic/index',
      'pages/view/index',
      'pages/view/article/index',
      'pages/feedback/index',
      'pages/data-entry/index',
      'pages/layout/index',
      'pages/navigation/index',
      'pages/navigation/indexes/index',
      'pages/advanced/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
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

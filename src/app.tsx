import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount () {
    // 获取用户信息
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        wx.reLaunch({
          url: './pages/index/index'
        })
      }
    } catch (errorMsg) {
      console.log(errorMsg);
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/punch/punch'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#ddd',
      selectedColor: 'red',
      position: 'bottom',
      list: [{
        pagePath: "pages/index/index",
        text: "运动",
        iconPath: "./images/motion-line.png",
        selectedIconPath: "./images/motion.png"
      },
      {
        pagePath: "pages/punch/punch",
        text: "打卡",
        iconPath: "./images/register-line.png",
        selectedIconPath: "./images/register.png"
      }]
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

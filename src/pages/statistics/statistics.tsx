import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Navigator, ScrollView } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import './statistics.scss'

export default class Index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentTabIndex: 0
        }
        // this.handleTabbar = this.handleTabbar.bind(this);
    }

    componentDidMount () { }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '欧萨运动'
    }

    handleTabbar (index: number) {
        this.setState({
            currentTabIndex: index
        })
    }

    render () {
        const {currentTabIndex} = this.state;
        return (
            <view>askdf</view>
        );
    }
}
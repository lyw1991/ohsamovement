import Taro, { Component } from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components';
import NavBar from '../../components/navbar/index'
import './index.scss'

// 引入图片
import indexLogo from '../../images/indexLogo.png'

export default class Index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentTimeBtn: '月',
            currentSortBtn: '公里数',
            dataList: [
                {name: '王茹', value: 1200, day: 365},
                {name: '王2茹', value: 30, day: 1},
                {name: '王3茹', value: 70, day: 22},
                {name: '王4茹', value: 56, day: 1},
                {name: '王2茹', value: 30, day: 1},
                {name: '王3茹', value: 70, day: 22},
                {name: '王4茹', value: 56, day: 1},
                {name: '王茹', value: 120, day: 365},
                {name: '王茹', value: 40, day: 365},
                {name: '王3茹', value: 70, day: 22},
                {name: '王4茹', value: 56, day: 1},
                {name: '王茹', value: 12, day: 365},
                {name: '王茹', value: 80, day: 365},
            ]
        }
    }

    componentDidMount () {

    }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '运动',
        navigationBarTextStyle: 'black',
        usingComponents: {
            'navbar': '../../components/navbar/index', // 书写第三方组件的相对路径
        },
    }

    // 年月日切换
    handleBtnTimeClick = (e: string) => {
        this.setState({
            currentTimeBtn: e,
        });
    }

    // 公里数、天数切换
    handleBtnSortClick = (e: string) => {
        this.setState({
            currentSortBtn: e,
        });
    }

    render () {
        const {currentTimeBtn, currentSortBtn, dataList} = this.state;
        // 按钮组
        let timebtnList = ['日', '月', '年'];
        let sortBtnList = ['公里数', '天数'];
        let today = currentTimeBtn === '日';
        return (
            <View>
                <NavBar title='运动' />
                <View className='top-view'>
                    <Image className='index-logo' src={indexLogo} />
                </View>
                <View className='content-view'>
                    <View className='content-text'>统计打卡</View>
                    <View className='button-group'>
                        <View style={{display: 'flex',marginRight: '10px'}}>
                            {
                                sortBtnList.map((item) => {
                                    let isCurrentSortBtn = currentSortBtn === item;
                                    return (
                                        <View key={item} className={`button-item ${isCurrentSortBtn ? 'current' : ''}`} onClick={this.handleBtnSortClick.bind(this, item)}>
                                            <View className='button-title'>{item}</View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                        <View style={{display: 'flex'}}>
                            {
                                timebtnList.map((item) => {
                                    let isCurrentTimeBtn = currentTimeBtn === item;
                                    return (
                                        <View key={item} className={`button-item ${isCurrentTimeBtn ? 'current' : ''}`} onClick={this.handleBtnTimeClick.bind(this, item)}>
                                            <View className='button-title'>{item}</View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                </View>
                <View className='list-view'>
                    {
                        dataList.map((item, index) => {
                            let value = item.value;
                            let radioWidth = value > 100 ? `110%` : `${value}%`;
                            return <View className='list-item' key={index}>
                                        <View className='list-item-text-view'><Text>{item.name}</Text></View>
                                        <View style={{display: 'flex',width: today ? '76%' : '64%'}}>
                                            <View className='list-item-radio' style={{width: radioWidth}}></View>
                                        </View>
                                        <View className='list-item-text-view'><Text>{`${item.value}km`}</Text></View>
                                        {
                                            !today &&
                                            <View className='list-item-text-view list-item-right'><Text>{`${item.day}天`}</Text></View>
                                        }
                                    </View>
                        })
                    }
                </View>
            </View>
        );
    }
}

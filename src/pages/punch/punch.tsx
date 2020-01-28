import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, View, OpenData } from '@tarojs/components'
// import { } from 'taro-ui'
import './punch.scss'

export default class Index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            nowIdx: 0,
            swiperH: '',
            imgList: [
                {img: '../../images/motion.png'},
                {img: '../../images/motion-line.png'},
                {img: '../../images/register.png'}
            ],
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
        navigationBarTitleText: '打卡'
    }

    //获取swiper高度
    getHeight = (e) => {
        var winWid = Taro.getSystemInfoSync().windowWidth - 2*50;//获取当前屏幕的宽度
        var imgh = e.detail.height;//图片高度
        var imgw = e.detail.width;//图片宽度
        console.log(imgh,imgw);
        var sH = winWid * imgh / imgw + "px"
        this.setState({
            swiperH: sH//设置高度
        },()=>{
            console.log(this.state.swiperH)
        })
    }

    //swiper滑动事件
    swiperChange = (e) => {
        this.setState({
            nowIdx: e.detail.current
        })
    }

    render () {
        const {} = this.state;
        return (
            <View>
                <View className='user-info'>
                    <OpenData type='userAvatarUrl'></OpenData>
                    <OpenData type='userNickName'></OpenData>
                </View>
                <Swiper
                    previousMargin='50px' 
                    nextMargin='50px'
                    onChange={this.swiperChange}
                    className='test-h'
                    circular
                    interval='2000'>
                    {this.state.imgList.map((list, index) => {
                    return (
                        <SwiperItem key={list.img}>
                            <View className='demo-text-1'>
                                <Image onLoad={this.getHeight} style={`height:${this.state.swiperH}`} className={`swiper-img ${this.state.nowIdx === index ? "swiper-active" : ""}`} src={list.img}></Image>
                            </View>
                        </SwiperItem>
                    );
                    })}
                </Swiper>
            </View>
        );
    }
}
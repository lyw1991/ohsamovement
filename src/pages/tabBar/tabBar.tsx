import Taro, {Component} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import './tabBar.scss'
 
export default class TabBar extends Component {
    // 默认参数配置
    static defaultProps = {
        current: 0,
        background: '#fff',
        color: '#999',
        tintColor: '#6190e8',
        fixed: false,
        onClick: () => {},
        tabList: []
    }
    constructor(props) {
        super(props)
        this.state = {
            updateCurrent: props.current
        }
    }

    updateTabbar(index) {
        this.props.onClick(index);
    }
 
    render() {
        const { background, color, tintColor, fixed } = this.props
        const { updateCurrent } = this.state
        
        return (
            <View className={classNames('taro__tabbar', fixed && 'taro__tabbar--fixed')}>
                <View className={classNames('taro__tabbar-list', fixed && 'taro__tabbar-list--fixed')} style={{backgroundColor: background}}>
                    {
                        this.props.tabList.map((item, index) => {
                            return (
                                <View className="taro__tabbar-item taro__tabbar-item--active" key={item.iconSelect} onClick={this.updateTabbar.bind(this, index)}>
                                    <View className="taro__tabbar-icon">
                                        <Text className={"iconfont taro__tabbar-iconfont ohsa " + item.icon} style={{color: updateCurrent == index ? tintColor : color}} />
                                        {/* 圆点 */}
                                        {!!item.badge && <Text className="taro__badge taro__tabbar-badge">{item.badge}</Text>}
                                        {!!item.dot && <Text className="taro__badge-dot taro__tabbar-badge--dot"></Text>}
                                    </View>
                                    <Text className="taro__tabbar-title" style={{color: updateCurrent == index ? tintColor : color}}>{item.title}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        );
    }
}
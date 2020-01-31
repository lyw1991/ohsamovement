import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'
import logo from '../../images/ohsa.png'

class Navbar extends Taro.Component {

    render() {
        const style = {
            paddingTop: Taro.$navBarMarginTop + 'px'
        }
        return (
            <View className='navbar-wrapper' style={style}>
                <Image src={logo} className='logo-image'></Image>
                <View className='nav-title'>{this.props.title}</View>
            </View>
        );
    }
}

export default Navbar
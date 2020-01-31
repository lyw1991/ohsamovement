import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Picker, ScrollView, OpenData } from '@tarojs/components'
import { AtSegmentedControl, AtInput, AtButton, AtToast, AtMessage, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import NavBar from '../../components/navbar/index'
import './punch.scss'

// 引入图标图片
import UploadImage from '../../images/upload.png'
import DeleteImage from '../../images/delete.png'
import RegisterWhiteImage from '../../images/register-white.png'

// 引入绿色图片
import swimmingImage from '../../images/swimming.png'
import climbingStairsImage from '../../images/climbingStairs.png'
import gymImage from '../../images/gym.png'
import ballImage from '../../images/ball.png'
import stepCountingImage from '../../images/stepCounting.png'
import runningImage from '../../images/running.png'
import briskWalkingImage from '../../images/briskWalking.png'
import skippingImage from '../../images/skipping.png'
import ridingImage from '../../images/riding.png'
import othersImage from '../../images/others.png'
// 引入灰色图片
import swimmingImageGrey from '../../images/swimming-grey.png'
import climbingStairsImageGrey from '../../images/climbingStairs-grey.png'
import gymImageGrey from '../../images/gym-grey.png'
import ballImageGrey from '../../images/ball-grey.png'
import stepCountingImageGrey from '../../images/stepCounting-grey.png'
import runningImageGrey from '../../images/running-grey.png'
import briskWalkingImageGrey from '../../images/briskWalking-grey.png'
import skippingImageGrey from '../../images/skipping-grey.png'
import ridingImageGrey from '../../images/riding-grey.png'
import othersImageGrey from '../../images/others-grey.png'

const imageMap = {
    swimming: swimmingImage,
    climbingStairs: climbingStairsImage,
    gym: gymImage,
    ball: ballImage,
    stepCounting: stepCountingImage,
    running: runningImage,
    briskWalking: briskWalkingImage,
    skipping: skippingImage,
    riding: ridingImage,
    others: othersImage,
    swimmingGrey: swimmingImageGrey,
    climbingStairsGrey: climbingStairsImageGrey,
    gymGrey: gymImageGrey,
    ballGrey: ballImageGrey,
    stepCountingGrey: stepCountingImageGrey,
    runningGrey: runningImageGrey,
    briskWalkingGrey: briskWalkingImageGrey,
    skippingGrey: skippingImageGrey,
    ridingGrey: ridingImageGrey,
    othersGrey: othersImageGrey,
};
let itemWidth = 44 + 12; // 每一个运动类型图片的宽度及margin

export default class Index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,  // 用户信息
            userDetail: {    // 打卡信息
                kmCounts: 10,
                punchDays: 8
            },
            sportTypeArray: [ // 运动类型按钮组
                {sportType: 'swimming', title: '游泳'},
                {sportType: 'climbingStairs', title: '爬楼梯'},
                {sportType: 'gym', title: '健身房'},
                {sportType: 'ball', title: '球类'},
                {sportType: 'stepCounting', title: '计步'},
                {sportType: 'running', title: '跑步'},
                {sportType: 'briskWalking', title: '快走'},
                {sportType: 'skipping', title: '跳绳'},
                {sportType: 'riding', title: '自行车'},
                {sportType: 'others', title: '其他'},
            ],
            dateBtnArray: [ // 日期选择按钮组数据
                {title: '前天', date: ''},
                {title: '昨天', date: ''},
                {title: '今天', date: ''},
                {title: '自选', date: ''},
            ],
            currentSportIndex: 4, // 当前选择的运动类型序号
            selectedSportType: 'stepCounting', // 当前选择的运动类型: 默认为 计步
            valueBtnMap: { // 打卡公里数按钮组 
                stepCounting: ['5公里（≥10000步）', '10公里（≥20000步）'],
                skipping: ['5公里（≥30分钟）', '10公里（≥60分钟）'],
                swimming: ['5公里（≥30分钟）', '10公里（≥60分钟）'],
                riding: ['5公里（≥40分钟）', '10公里（≥80分钟）'],
                ball: ['5公里（≥40分钟）', '10公里（≥80分钟）'],
                climbingStairs: ['5公里（≥40分钟）', '10公里（≥80分钟）'],
                others: ['5公里（≥40分钟）', '10公里（≥80分钟）'],
                gym: ['5公里（≥50分钟）', '10公里（≥100分钟）'],
            },
            todayText: '', // 今日日期
            currentDateBtn: 2, // 日期按钮：默认为今天
            currentValueBtn: 0, // 公里值按钮：默认为5公里
            kmValue: null, // 公里数入框的值
            files: [], // 图片上传
            confirmModalVisible: false, // 打卡确认弹框是否显示
            confirmMap: null, // 确认弹框中的数据
            saving: false, // 上传中的状态
            saved: false, // 打卡成功提示
        };
    }

    componentDidMount () {
        wx.getStorage({
            key: 'userInfo',
            success: (res) => {
                this.setState({
                    userInfo: res.data
                });
            },
            error: (errorMsg) => {
                console.log(errorMsg);
            }
        });
        this.setDateBtns();
        itemWidth = (Taro.$screenWidth - 30) * 0.1173 + 12;
    }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '打卡',
        enablePullDownRefresh: false,
        usingComponents: {
            'navbar': '../../components/navbar/index', // 书写第三方组件的相对路径
        },
    }

    // 设置日期按钮组
    setDateBtns = () => {
        const dateBtnArray = this.state.dateBtnArray;
        const day1 = new Date();
        dateBtnArray[0].date = this.commonFormatDateText(new Date(day1.setDate(day1.getDate() - 2)));
        const day2 = new Date();
        dateBtnArray[1].date = this.commonFormatDateText(new Date(day2.setDate(day2.getDate() - 1)));
        const todayText = this.commonFormatDateText(new Date());
        dateBtnArray[2].date = todayText;
        this.setState({
            dateBtnArray,
            todayText: todayText
        });
    }

    // 处理 Date => 2020-01-29
    commonFormatDateText = (date: Date) => {
        let currentMonth = (date.getMonth() + 1) + '';
        if (parseInt(currentMonth) < 10) {
            currentMonth = '0' + currentMonth;
        }
        let currentDate = date.getDate() + '';
        if (parseInt(currentDate) < 10) {
            currentDate = '0' + currentDate;
        }
        return date.getFullYear() + '-' + currentMonth + '-' + currentDate;
    }
    
    // 运动类型选择事件: 根据滚动位移计算当前选中的类型
    onScroll = (e: {detail: {scrollLeft: number}}) => {
        const {scrollLeft} = e.detail;
        let sportIndex = Math.round(scrollLeft / itemWidth);
        this.setState({
            currentSportIndex: sportIndex,
            selectedSportType: this.state.sportTypeArray[sportIndex].sportType
        });
    }

    // 日期选择按钮
    handleDateBtnClick = (e: number) => {
        this.setState({
            currentDateBtn: e
        });
    }

    // 公里数选择按钮
    handleValueBtnClick = (currentValueBtn: number) => {
        this.setState({currentValueBtn});
    }

    // 公里数输入框
    handleKmValueChange = (kmValue: string) => {
        this.setState({kmValue});
    }

    // 上传图片
    handleUploadImage = () => {
        let files = this.state.files;
        const count = 3 - files.length;
        Taro.chooseImage({
            count: count
        }).then((res) => {
            if (res.errMsg === 'chooseImage:ok') {
                files = files.concat(res.tempFiles).slice(0, 3);
                this.setState({
                    files: files
                });
            }
        }).catch((reject) => {
            console.log(reject);
        });
    }

    // 删除图片
    handleDeleteImage = (index: number) => {
        let files = this.state.files;
        files.splice(index, 1);
        this.setState({
            files: files
        });
    }

    // 预览图片
    handlePreviewImage = (index: number) => {
        Taro.previewImage({
            current: this.state.files[index].path,
            urls: this.state.files.map(item => item.path)
        }).then(() => {
            // console.log('查看图片中');
        })
    }

    // 时间选择弹框里的变更事件
    handleCustomDateChange = (e: {detail: {value: string}}) => {
        const dateBtnArray = this.state.dateBtnArray;
        if (e.detail.value) {
            dateBtnArray[3].date = e.detail.value;
        }
        this.setState({
            dateBtnArray: dateBtnArray
        })
    }

    // 打卡按钮
    handlePunch = () => {
        const {
            userInfo, currentDateBtn, dateBtnArray, selectedSportType, currentSportIndex,
            valueBtnMap, currentValueBtn, kmValue, files, sportTypeArray
        } = this.state;
        // 需要收集的数据：用户名，打卡日期，打卡类型，打卡公里数，上传的截图
        let parameters = {
            userName: userInfo.nickName,
            punchType: selectedSportType,
            punchTypeName: sportTypeArray[currentSportIndex].title
        };
        if (!dateBtnArray[currentDateBtn].date) {
            this.commongErrorMsg('请选择要打卡的日期');
            return;
        }
        parameters.punchDate = dateBtnArray[currentDateBtn].date;
        if (selectedSportType === 'running' || selectedSportType === 'briskWalking') {
            if (!kmValue) {
                this.commongErrorMsg('请填写公里数');
                return;
            }
            if (kmValue < 5) {
                this.commongErrorMsg('公里数不能小于5');
                return;
            }
            parameters.punchValue = kmValue;
        } else {
            parameters.punchValue = parseInt(valueBtnMap[selectedSportType][currentValueBtn].split('公里')[0]);
        }
        if (!files.length) {
            this.commongErrorMsg('请上传截图');
            return;
        }
        parameters.files = files;
        // 显示打卡信息确认弹框
        this.setState({
            confirmModalVisible: true,
            confirmMap: parameters
        });
    }

    // 确认打卡
    confirmPunching = () => {
        this.setState({
            confirmModalVisible: false
        }, () => {
            // 上传打卡信息
            this.setState({
                saving: true
            });
            // 在这里调后台接口
            setTimeout(() => {
                this.setState({
                    saving: false,
                    saved: true
                });
                setTimeout(() => {
                    this.resetFormData();
                }, 1000);
            }, 2500);
        });
    }

    // 确认弹框取消事件
    handleModalCancle = () => {
        this.setState({
            confirmModalVisible: false
        });
    }

    // 显示错误信息
    commongErrorMsg = (msg: string) => {
        Taro.atMessage({
            'message': msg,
            'type': 'error',
        });
    }

    // 重置打卡信息：打卡类型，公里按钮，上传截图
    resetFormData = () => {
        this.setState({
            currentSportIndex: 4, // 当前选择的运动类型序号
            selectedSportType: 'stepCounting', // 当前选择的运动类型: 默认为 计步
            currentValueBtn: 0, // 公里值按钮：默认为5公里
            kmValue: null, // 公里数入框的值
            files: [], // 图片上传
            saved: false // 打卡成功提示
        });
        this.setDateBtns();
    }

    render () {
        const {
            userDetail, currentDateBtn, currentValueBtn, files, dateBtnArray,
            selectedSportType, valueBtnMap, todayText, sportTypeArray, currentSportIndex,
            kmValue, saving, saved, confirmModalVisible, confirmMap
        } = this.state;

        const scrollLeft = currentSportIndex * itemWidth;

        return (
            <View className='page-wrapper'>
                <NavBar title='打卡' />
                {/* 基本信息 */}
                <View className='user-info'>
                    <View className='avatar-wrapper'>
                        <OpenData type='userAvatarUrl'></OpenData>
                    </View>
                    <View className='user-detail'>
                        <View className='user-detail-item'>
                            <Text>本月记录：</Text>
                            {/* <Text className={userDetail.kmCounts >= 100 ? 'complete-color' : 'unComplete-color'}>{userDetail.kmCounts}</Text> */}
                            {/* 这里暂时总是显示为绿色 */}
                            <Text className='complete-color'>{userDetail.kmCounts}</Text>
                            <Text> km / 100 km</Text>
                        </View>
                        <View className='user-detail-item'>
                            <Text>运动天数：</Text>
                            <Text>{userDetail.punchDays} 天</Text>
                        </View>
                        <View className='user-detail-item margin-top-space'>
                            <Text>{todayText}</Text>
                        </View>
                    </View>
                </View>
                {/* 运动类型选择器 */}
                <View className='scrollview-wrapper'>
                    <ScrollView
                        className='scrollview'
                        scrollX
                        scrollWithAnimation
                        scrollLeft={scrollLeft}
                        onScroll={this.onScroll}>
                        {
                            sportTypeArray.map((sportItem: {sportType: string, title: string}, index: number) => {
                                const {sportType, title} = sportItem;
                                const indexDiff = index - currentSportIndex;
                                const isCurrentSport = indexDiff === 0;
                                let isLeft = false;
                                let isAlmostOpacity = false;
                                let isHalfOpacity = false;
                                // 如果是左边的，左侧更透明一些; 离得
                                if (indexDiff < 0) {
                                    isAlmostOpacity = indexDiff < -2;
                                    isHalfOpacity = indexDiff === -2;
                                    isLeft = true;
                                }
                                if (indexDiff > 0) {
                                    isAlmostOpacity = indexDiff > 2;
                                    isHalfOpacity = indexDiff === 2;
                                    isLeft = false;
                                }
                                let extraClassName = '';
                                if (!isCurrentSport) {
                                    extraClassName += isLeft ? 'left-item' : 'right-item';;
                                }
                                if (isAlmostOpacity) {
                                    extraClassName += ' almost-opacity';
                                }
                                if (isHalfOpacity) {
                                    extraClassName += ' half-opacity'
                                }
                                return (
                                    <View key={sportType} className='sport-item-wrapper' id={sportType}>
                                        <View className={`sport-flex-box ${extraClassName} ${isCurrentSport ? 'current-box' : ''}`}>
                                            <Image
                                                src={imageMap[`${isCurrentSport ? sportType : `${sportType}Grey`}`]}
                                                className={`sport-item-image ${isCurrentSport ? 'current-sport' : ''}`}
                                                mode='aspectFit'></Image>
                                            {
                                                isCurrentSport &&
                                                <View className='sport-title-wrapper'>
                                                    <View className='sport-item-divider'></View>
                                                    <View className='sport-item-title'>{title}</View>
                                                </View>
                                            }
                                            <View className='cover-view'></View>
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </ScrollView>
                </View>
                <View className='form-wrapper'>
                    {/* 打卡日期 */}
                    <View className='button-group'>
                        {
                            dateBtnArray.map((date: {title: string, date: string}, index: number) => {
                                let isCurrentBtn = currentDateBtn === index;
                                if (index == 3) {
                                    return (
                                        <View key={date.title} className={`button-item ${isCurrentBtn ? 'current' : ''}`} onClick={this.handleDateBtnClick.bind(this, index)}>
                                            <Picker
                                                mode='date'
                                                value={date.date}
                                                start='2018-01-01'
                                                end={todayText}
                                                onCancel={this.handleCustomDateChange}
                                                onChange={this.handleCustomDateChange}>
                                                <View className='picker'>
                                                    <View className='button-title'>{date.title}</View>
                                                    {
                                                        isCurrentBtn &&
                                                        <View className='button-date'>{date.date}</View>
                                                    }
                                                </View>
                                            </Picker>
                                        </View>
                                    );
                                }
                                return (
                                    <View key={date.title} className={`button-item ${isCurrentBtn ? 'current' : ''}`} onClick={this.handleDateBtnClick.bind(this, index)}>
                                        <View className='button-title'>{date.title}</View>
                                        {
                                            isCurrentBtn &&
                                            <View className='button-date'>{date.date}</View>
                                        }
                                    </View>
                                );
                            })
                        }
                    </View>
                    {/* 打卡公里数 */}
                    {
                        selectedSportType === 'running' || selectedSportType === 'briskWalking' ?
                            <View className='kmValue-input-wrapper'>
                                <View className='input-label'>公里数(km):</View>
                                <View className='input-content'>
                                    <AtInput
                                        name='kmValue'
                                        title=''
                                        type='digit'
                                        placeholder='请输入'
                                        value={kmValue}
                                        onChange={this.handleKmValueChange.bind(this)}
                                    />
                                </View>
                            </View>
                            :
                            <AtSegmentedControl
                                className='segmented-control'
                                values={valueBtnMap[selectedSportType]}
                                onClick={this.handleValueBtnClick.bind(this)}
                                current={currentValueBtn}
                                selectedColor='#008f4d'
                            />
                    }
                </View>
                {/* 上传截图 */}
                <View className='uploader-wrapper'>
                    {
                        files.map((file: {title: string, path: string}, index: number) => {
                            return (
                                <View key={file.path} className='image-wrapper'>
                                    <Image src={DeleteImage} className='delete-btn' onClick={this.handleDeleteImage.bind(this, index)}></Image>
                                    <Image src={file.path} className='image-item' mode='aspectFill' onClick={this.handlePreviewImage.bind(this, index)}></Image>
                                </View>
                            );
                        })
                    }
                    {
                        files.length < 3 &&
                            <View className='uploader-btn-wrapper'>
                                <View className='uploader-btn' onClick={this.handleUploadImage}>
                                    <Image src={UploadImage} mode='aspectFit'></Image>
                                </View>
                                {
                                    !files.length &&
                                    <View className='uploader-tip'>点击上传图片<Text className='red-text'>*</Text></View>
                                }
                            </View>
                    }
                </View>
                <View className='punch-btn-wrapper'>
                    <AtButton circle type='primary' onClick={this.handlePunch}><Image src={RegisterWhiteImage} mode='aspectFit'></Image>打  卡</AtButton>
                </View>
                <AtMessage />
                <AtToast isOpened={saving} text='正在上传...' status='loading' hasMask></AtToast>
                <AtToast isOpened={saved} text='打卡成功' icon='check-circle'></AtToast>
                <AtModal isOpened={confirmModalVisible} closeOnClickOverlay={false}>
                    <AtModalHeader>请确认打卡信息</AtModalHeader>
                    <AtModalContent>
                        <View className='confirm-row-item'>
                            <View className='confirm-item-label'>打卡日期：</View>
                            <View className='confirm-item-content'>{confirmMap.punchDate}</View>
                        </View>
                        <View className='confirm-row-item'>
                            <View className='confirm-item-label'>运动类型：</View>
                            <View className='confirm-item-content'>{confirmMap.punchTypeName}</View>
                        </View>
                        <View className='confirm-row-item'>
                            <View className='confirm-item-label'>公里数：</View>
                            <View className='confirm-item-content'>{confirmMap.punchValue} km</View>
                        </View>
                        <View className='confirm-row-item'>
                            <View className='confirm-item-label'>截图：</View>
                        </View>
                        <View className='confirm-row-item'>
                            {
                                confirmMap.files.map((file: {path: string}, index: number) => {
                                    return (
                                        <Image key={file.path} src={file.path} className='confirm-image' mode='aspectFill' onClick={this.handlePreviewImage.bind(this, index)}></Image>
                                    );
                                }) 
                            }
                        </View>
                    </AtModalContent>
                    <AtModalAction>
                        <AtButton className='modal-btn cancel' onClick={this.handleModalCancle}>取消</AtButton>
                        <AtButton className='modal-btn confirm' onClick={this.confirmPunching}>确定</AtButton>
                    </AtModalAction>
                </AtModal>
            </View>
        );
    }
}
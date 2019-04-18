//This is the tour that the user is brought to immediately after registration. It can also be accessed via burger menu
//GH65

var React = require('react');
var {
    Component,
} = require('react');
var {
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    Text
} = require('react-native');
var { connect } = require('react-redux');
var {width, height} = Dimensions.get('window');
var PLColors = require('PLColors');
import {Actions} from 'react-native-router-flux'
import {CachedImage} from "react-native-img-cache";
import GestureRecognizer from '../../components/GestureRecognizer';

var styles = {
    container: {
        backgroundColor: '#55C5FF',
        flex: 1,
        position: 'relative',
        justifyContent: 'flex-end'
    },
    img: (visible) =>  ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: visible ? 1 : 0,
        width: width,
        height: height,
        resizeMode: 'cover'
    }),
    bottomContainer: {
        marginBottom: 5,
        flexDirection: 'row'
    },
    skipContainer: {
        flex: 1,
        alignItems: 'flex-start'
    },
    nextContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    nextBtn: {
        color: 'white',
        backgroundColor: 'transparent',
        marginRight: 10
    },
    skitBtn: {
        color: 'white',
        backgroundColor: 'transparent',
        marginLeft: 10
    },

    goBtnContainer: {
        marginBottom: (height / 5),        
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: 45,
    },
    goBtn: {
        borderWidth: 2,
        borderColor: PLColors.activeText,
        borderRadius: 10,
        width: 140,
        height: 45,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goTxt: {
        color: '#006',
        textAlignVertical: 'top',
        fontSize: 20,
    }
};

class TourScene extends Component{
    static navigationOptions = {
        title: 'Tour',
        header: null
    }

    constructor(props){
        super(props);
        this.state = {
            pos: 0,
            screens: props.screens,
            maxPos: props.screens ? props.screens.length - 1 : 5
        };
    }

    componentDidMount(){
        if (this.props.screens){
            this.setState({maxPos: this.props.screens.length, pos: 0, ready: true})
        } else {
            AsyncStorage.getItem('onboarding').then(r => {
                if (r) {
                    r = JSON.parse(r);
                    this.setState({
                        pos: 0,
                        maxPos: r.length - 1,
                        screens: r,
                        ready: true
                    });
                } else {
                    this.setState({
                        pos: 0,
                        maxPos: 5,
                        ready: true
                    });
                }
            }).catch(e => {
                this.setState({
                    pos: 0,
                    maxPos: 5,
                    ready: true
                });
            })
        }
    }

    onNext = () => {
        var {pos, maxPos} = this.state;
        if(pos < maxPos){
            this.setState({
                pos: pos + 1
            });
        }
    };

    onPrev = () => {
        var {pos} = this.state;
        if(pos > 0){
            this.setState({
                pos: pos - 1
            });
        }
    };

    onSkip = () =>{
        console.log('=>', this.props);
        if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.callback){
            let { state } = this.props.navigation;
            let { params } = state;
            params.callback();
        }else{
                this.props.navigation.state.params.onBackPress();
           Actions.home();
        }      
    };

    render(){
        if (!this.state.ready){
            return <View style={styles.container} />     
        }

        console.log(this.props);
        let {pos} = this.state;
        let imgs = [];
        if (this.state.screens && this.state.screens.length > 0){
            imgs = this.state.screens.map((s, i) => {
                return <CachedImage source={{uri: s.image}} style={styles.img(pos === i)} />
            })
        } else {
            imgs = [
                <Image source={require('../../assets/1.png')} style={styles.img(pos === 0)}/>,
                <Image source={require('../../assets/2.png')} style={styles.img(pos === 1)}/>,
                <Image source={require('../../assets/3.png')} style={styles.img(pos === 2)}/>,
                <Image source={require('../../assets/4.png')} style={styles.img(pos === 3)}/>,
                <Image source={require('../../assets/5.png')} style={styles.img(pos === 4)}/>,
                <Image source={require('../../assets/6.png')} style={styles.img(pos === 5)}/>
            ];
        }

        return (
            <GestureRecognizer
              style={styles.container}
              onSwipeLeft={this.onNext}
              onSwipeRight={this.onPrev}
            >
                {imgs[pos]}
                <View style={styles.bottomContainer}>
                    {
                    pos < this.state.maxPos? 
                    <View style={styles.skipContainer}>
                        <TouchableOpacity onPress={this.onSkip}>
                            <Text style={styles.skitBtn}>Skip</Text> 
                        </TouchableOpacity> 
                    </View>: null
                    }
                    {
                    pos < this.state.maxPos?
                    <View style={styles.nextContainer}>
                        <TouchableOpacity onPress={this.onNext}>
                            <Text style={styles.nextBtn}>Next</Text> 
                        </TouchableOpacity>        
                    </View>: null
                    }
                    {
                    pos === this.state.maxPos ?
                    <View style={styles.goBtnContainer}>
                        <TouchableOpacity style={styles.goBtn} onPress={this.onSkip}>
                            <Text style={styles.goTxt}>Let's Go</Text>
                        </TouchableOpacity>
                    </View>: null
                    }
                </View>
            </GestureRecognizer>
        )
    }
}

module.exports = connect()(TourScene);
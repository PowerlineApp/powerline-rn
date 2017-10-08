//This is the tour that the user is brought to immediately after registration. It can also be accessed via burger menu
//GH

var React = require('react');
var {
    Component,
    PropTypes
} = require('react');
var {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Text
} = require('react-native');
var { connect } = require('react-redux');
var {width, height} = Dimensions.get('window');
var PLColors = require('PLColors');
import {
    NavigationActions
} from 'react-navigation';
import {Actions} from 'react-native-router-flux'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        justifyContent: 'flex-end'
    },
    img: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: width,
        height: height,
        resizeMode: 'stretch'
    },
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
        marginRight: 10
    },
    skitBtn: {
        color: 'white',
        marginLeft: 10
    },

    goBtnContainer: {
        marginBottom: (height / 5),        
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: 45
    },
    goBtn: {
        color: '#006',
        textAlign: 'center',
        width: 140,
        height: 45,
        borderWidth: 2,
        borderColor: PLColors.activeText,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 32
    }
});

class TourScene extends Component{
    static navigationOptions = {
        title: 'Tour',
        header: null
    }

    constructor(){
        super();
        this.state = {
            pos: 0
        };
    }

    componentDidMount(){
        this.setState({
            pos: 0
        });
    }

    onNext = () => {
        var {pos} = this.state;
        if(pos < 5){
            this.setState({
                pos: pos + 1
            });
        }
    }

    onSkip = () =>{
        var { navigation } = this.props;        
        if(navigation){
            var { state, dispatch } = navigation;
             var { params } = state;
            params.callback();
        }else{
           Actions.pop();
        }      
    }

    render(){
        var {pos} = this.state;
        return (
            <View style={styles.container}>                
                {pos==0?<Image source={require('../../assets/1.png')} style={styles.img}/>: null}  
                {pos==1?<Image source={require('../../assets/2.png')} style={styles.img}/>: null}
                {pos==2?<Image source={require('../../assets/3.png')} style={styles.img}/>: null}
                {pos==3?<Image source={require('../../assets/4.png')} style={styles.img}/>: null}
                {pos==4?<Image source={require('../../assets/5.png')} style={styles.img}/>: null}
                {pos==5?<Image source={require('../../assets/6.png')} style={styles.img}/>: null}
                <View style={styles.bottomContainer}>
                    {
                    pos < 5? 
                    <View style={styles.skipContainer}>
                        <TouchableOpacity onPress={this.onSkip}>
                            <Text style={styles.skitBtn}>Skip</Text> 
                        </TouchableOpacity> 
                    </View>: null
                    }
                    {
                    pos < 5?
                    <View style={styles.nextContainer}>
                        <TouchableOpacity onPress={this.onNext}>
                            <Text style={styles.nextBtn}>Next</Text> 
                        </TouchableOpacity>        
                    </View>: null
                    }
                    {
                    pos == 5?
                    <View style={styles.goBtnContainer}>
                        <TouchableOpacity onPress={this.onSkip}>
                            <Text style={styles.goBtn}>Let's GO</Text>
                        </TouchableOpacity>
                    </View>: null
                    }
                </View>
            </View>
        )
    }
}

module.exports = connect()(TourScene);
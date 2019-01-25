/**
 * @providesModule PLApp
 * @flow
 */

'use strict';

import React, {Component} from 'React';
import {View, Text, Image, AsyncStorage} from 'react-native';
import Stripe from 'tipsi-stripe';
import AppState from 'AppState';
import Platform from 'Platform';
import LoginScene from './scenes/auth/LoginScene';
import TermsPolicyScene from './scenes/auth/TermsPolicyScene';
import ForgotPasswordScene from './scenes/auth/ForgotPasswordScene';
import StyleSheet from 'StyleSheet';
import PLNavigator from 'PLNavigator';
import StatusBar from 'StatusBar';
// import SplashScreen from 'react-native-splash-screen';
import SplashScreen from 'react-native-splash-screen';

import { connect } from 'react-redux';
import { version, stripeAPIKey } from './PLEnv.js';
import { StackNavigator } from 'react-navigation';
import RegisterScene  from './scenes/auth/RegisterScene';
import TourScene from './scenes/auth/TourScene';
import {Root} from 'native-base';
import { RNSKBucket } from 'react-native-swiss-knife';
import {CachedImage} from "react-native-img-cache";
import {
  fetchConferences,
  listServices,
} from "PLActions";

// console.log = () => {};
// console.warn = () => {};

// import OneSignal from 'react-native-onesignal';
// console.log = (a1, a2, a3) => {
//     let str = a1 ? typeof a1 === 'object' ? JSON.stringify(a1, null, '    ') : a1 || '' : ``;
//     let str2 = a2 ? typeof a2 === 'object' ? JSON.stringify(a2, null, '    ') : a2 || '' : ``;
//     let str3 = a3 ? typeof a3 === 'object' ? JSON.stringify(a3, null, '    ') : a3 || '' : ``;
//     str.split('\n').map(s => console.warn('powerline', s));
//     str2.split('\n').map(s => console.warn('powerline', s));
//     str3.split('\n').map(s => console.warn('powerline', s));
// };
    // console.warn('powerline-log', a1 ? typeof a1 === 'object' ? JSON.stringify(a1, null, '\t') : a1 || '' : ``, a2 ? typeof a2 === 'object' ? JSON.stringify(a2, null, '\t') : a2 || '' : ``, a3 ? typeof a3 === 'object' ? JSON.stringify(a3, null, '\t') : a3 || '' : ``, a4 ? typeof a4 === 'object' ? JSON.stringify(a4, null, '\t') : a4 || '' : ``, a5 ? typeof a5 === 'object' ? JSON.stringify(a5, null, '\t') : a5 || '' : ``, a6 ? typeof a6 === 'object' ? JSON.stringify(a6, null, '\t') : a6 || '' : ``, a7 ? typeof a7 === 'object' ? JSON.stringify(a7, null, '\t') : a7 || '' : ``, a8 ? typeof a8 === 'object' ? JSON.stringify(a8, null, '\t') : a8 || '' : ``, a9 ? typeof a9 === 'object' ? JSON.stringify(a9, null, '\t') : a9 || '' : ``);};
// console.warn = (a1, a2, a3, a4, a5, a6, a7, a8, a9) => {console.warn('powerline-log', a1, a2, a3, a4, a5, a6, a7, a8, a9);};
// console.warn = () => {};

class PLApp extends Component {
    constructor(){
        super();
        this.state = {
            splash: null,
            conferences: null,
        };
    }
    
    async componentDidMount () {
        if (this.props.token){
            this.props.fetchConferences(this.props.token);
            let splash = await AsyncStorage.getItem('splashScreen');
            if (splash){
                this.setState({splash}, () => setTimeout(() => this.setState({splash: false}), 1500) );
            } else {
                this.setState({splash: false});
            }
        } else {
            this.setState({splash: false});
        }
        Stripe.init({
            publishableKey: stripeAPIKey
        });
        // console.log('=>', SplashScreen);
        SplashScreen.hide();

        const myGroup = 'group.ne.powerline.share';
        RNSKBucket.set('token', this.props.token, myGroup);

        this.props.fetchConferences(this.props.token);
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.conferences !== this.state.conferences) {
            console.log('componentWillReceiveProps at PLAPP', nextProps.conferences);
            this.setState({ conferences: nextProps.conferences });
        }
      
    }
    componentWillUnmount () {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange (appState) {
        if (appState === 'active') {
        }
    }

    render () {
        const { conferences } = this.state;
        
        if (this.state.splash === null) return null;
        if (this.state.splash){
            SplashScreen.hide();
            return <View style={{flex: 1, backgroundColor: '#fff'}}>
                {/* <Text>This is my fake SplashScreen</Text> */}
                <CachedImage style={{flex: 1}} source={{ uri: this.state.splash }} />

                {/* <Image source={{uri: this.state.splash}} onError={() => this.setState({splash: false})} /> */}
            </View>;
        }
        return <Root>
            {
                this.props.isLoggedIn && conferences && conferences.data && <PLNavigator isCustom={conferences.data.length > 0} />
            }
            {
                this.props.isLoggedIn && !conferences && <View />
            }
            {
                !this.props.isLoggedIn && <LoginStack />
            }
        </Root>;
    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

var LoginStack = StackNavigator({
    initialRouteName: { screen: LoginScene },
    Login: { screen: LoginScene },
    TermsAndPolicy: { screen: TermsPolicyScene },
    ForgotPassword: { screen: ForgotPasswordScene },
    Register: { screen: RegisterScene },
    Tour: { screen: TourScene },
});

TermsPolicyScene.navigationOptions = props => {
    var { navigation } = props;
    var { state, setParams } = navigation;
    var { params } = state;
    var navTitle = (params.isTerms === true) ? 'Terms of Service' : 'Privacy Policy';
    return {
        headerTitle: `${navTitle}`,
    };
};

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    token: state.user.token,
    conferences: state.conferences,
});

function bindAction(dispatch) {
  return {
    fetchConferences: token => dispatch(fetchConferences(token)),
  };
}

module.exports = connect(mapStateToProps, bindAction)(PLApp);

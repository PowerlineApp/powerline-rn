/**
 * @providesModule PLApp
 * @flow
 */

'use strict';

import React, {Component} from 'React';
import {View, Text} from 'react-native';
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


// import OneSignal from 'react-native-onesignal';
console.log = () => {};
console.warn = () => {};

class PLApp extends Component {
    constructor(){
        super();
        this.state = {
            splash: true
        };
    }
    // displayName: 'PLApp',
    componentDidMount () {
        setTimeout( () => {
            this.setState({splash: false});
        },1000);

        console.log('===========================, COMPONENT DID MOUNT ON PLAPP.JS');
        Stripe.init({
            publishableKey: stripeAPIKey
        });
        console.log('=>', SplashScreen);
        SplashScreen.hide();

        const myGroup = 'group.ne.powerline.share';
        RNSKBucket.set('token', this.props.token, myGroup);


        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount () {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange (appState) {
        if (appState === 'active') {
        }
    }

    render () {
        console.log('===>>><<<===', this.props);
        if (this.props.token && this.state.splash){ // if user is logged in, show fake splashscreen - also verify in his profile is has an agency
            return <View style={{flex: 1, backgroundColor: '#f0f'}}>
                <Text>This is my fake SplashScreen</Text>
                {
                    /*
                    here will enter an centered image, that we will need to cache when user logs in
                    */
                }
            </View>;
        }
        return <Root>
            {
                this.props.isLoggedIn
                ? <PLNavigator />
                : <LoginStack />
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
    token: state.user.token
});

module.exports = connect(mapStateToProps)(PLApp);

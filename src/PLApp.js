/**
 * @providesModule PLApp
 * @flow
 */

'use strict';

var React = require('React');
import Stripe from 'tipsi-stripe';
var AppState = require('AppState');
var Platform = require('Platform');
var LoginScene = require('./scenes/auth/LoginScene');
var TermsPolicyScene = require('./scenes/auth/TermsPolicyScene');
var ForgotPasswordScene = require('./scenes/auth/ForgotPasswordScene');
var StyleSheet = require('StyleSheet');
var PLNavigator = require('PLNavigator');
var View = require('View');
var StatusBar = require('StatusBar');
// var SplashScreen = require('react-native-splash-screen');
import SplashScreen from 'react-native-splash-screen';

var { connect } = require('react-redux');
var { version, stripeAPIKey } = require('./PLEnv.js');
var { StackNavigator } = require('react-navigation');
var RegisterScene  = require('./scenes/auth/RegisterScene');
var TourScene = require('./scenes/auth/TourScene');
import {Root} from 'native-base';
import { RNSKBucket } from 'react-native-swiss-knife';


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

var PLApp = React.createClass({
    displayName: 'PLApp',
    componentDidMount: function () { 
        // console.log('===========================, COMPONENT DID MOUNT ON PLAPP.JS');
        Stripe.init({
            publishableKey: stripeAPIKey
        });
        console.log('=>', SplashScreen);
        SplashScreen.hide();

        const myGroup = 'group.ne.powerline.share';
        RNSKBucket.set('token', this.props.token, myGroup);


        AppState.addEventListener('change', this.handleAppStateChange);
    },

    componentWillUnmount: function () {
        AppState.removeEventListener('change', this.handleAppStateChange);
    },

    handleAppStateChange: function (appState) {
        if (appState === 'active') {
        }
    },

    render: function () {
        console.log('===>>><<<===', this.props);
        return <Root>
            {
                this.props.isLoggedIn
                ? <PLNavigator />
                : <LoginStack />
            }
        </Root>;
    },

});

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

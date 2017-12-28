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
var SplashScreen = require('react-native-splash-screen');
var { connect } = require('react-redux');
var { version, stripeAPIKey } = require('./PLEnv.js');
var { StackNavigator } = require('react-navigation');
var RegisterScene  = require('./scenes/auth/RegisterScene');
var TourScene = require('./scenes/auth/TourScene');
import {Root} from 'native-base';
import OneSignal from 'react-native-onesignal';
// console.log = () => {};

var PLApp = React.createClass({
    displayName: 'PLApp',
    componentDidMount: function () { 
        Stripe.init({
            publishableKey: stripeAPIKey
        });
        // if (Platform.OS === 'android') {
        //     SplashScreen.hide();
      
        // }
        SplashScreen.hide();
        // alert('yoiyoyo');

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
        return <Root>
            {
                !this.props.isLoggedIn
                ? <LoginStack />
                : <PLNavigator />
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
    isLoggedIn: state.user.isLoggedIn
});

module.exports = connect(mapStateToProps)(PLApp);

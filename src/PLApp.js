/**
 * @providesModule PLApp
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
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
var { version } = require('./PLEnv.js');
var { StackNavigator } = require('react-navigation');
var RegisterScene  = require('./scenes/auth/RegisterScene');
var TourScene = require('./scenes/auth/TourScene');

class PLApp extends Component {
  // displayName: 'PLApp',

  componentDidMount (){ 

    if (Platform.OS === 'android') {
      SplashScreen.hide();
      
    }
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  

  handleAppStateChange (appState) {
    if (appState === 'active') {
    }
  }

  render() {
    if (!this.props.isLoggedIn) {
      return <LoginStack />;
    }
    return <PLNavigator />;
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
  isLoggedIn: state.user.isLoggedIn
});

module.exports = connect(mapStateToProps)(PLApp);

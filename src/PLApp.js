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


import StyleSheet from 'StyleSheet';
import PLNavigator from './PLNavigator';
import StatusBar from 'StatusBar';
// import SplashScreen from 'react-native-splash-screen';
import SplashScreen from 'react-native-splash-screen';

import { connect } from 'react-redux';
import { version, stripeAPIKey } from './PLEnv.js';
// import { createStackNavigator } from 'react-navigation';
import RegisterScene  from './scenes/auth/RegisterScene';
import TourScene from './scenes/auth/TourScene';
import {Root} from 'native-base';
import { RNSKBucket } from 'react-native-swiss-knife';
import {CachedImage} from "react-native-img-cache";
import {
  fetchConferences,
  listServices,
} from "./actions";
import { Router, Scene } from "react-native-router-flux";

class PLApp extends Component {
    constructor(){
        super();
        this.state = {
            splash: null,
            conferences: null,
            isCustom: null
        };
    }
    
    async componentDidMount () {
        try {
            console.log('alowww')
            
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
            Stripe.setOptions({
                publishableKey: stripeAPIKey
            });
            // console.log('=>', SplashScreen);
            SplashScreen.hide();

            const myGroup = 'group.ne.powerline.share';
            RNSKBucket.set('token', this.props.token, myGroup);
            
            // this.props.fetchConferences(this.props.token);
            // AppState.addEventListener('change', this.handleAppStateChange);
        } catch (error) {
            console.log('error ', error)   
        }
    }


    // shouldComponentUpdate (nextProps, nextState) {
    //     const currentData = (this.props.conferences || {data: []}).data.length
    //     const incomingData = (nextProps.conferences || {data: []}).data.length

        
    //     // console.log(incomingData , this.state.conferences , incomingData, currentData, (incomingData && !this.state.conferences ), (incomingData !== currentData), (incomingData && !this.state.conferences ) || (incomingData !== currentData))
    //     // if ((incomingData && !this.state.conferences ) || (incomingData !== currentData)) {
    //     //     console.log('yesss')
    //     //     this.setState({conferences: nextProps.conferences})
    //     //     return true
    //     // }
    //     // if ((nextState.conferences || {data: []}).data.length !== (this.state.conferences || {data: []}).data.length) {
    //     //     console.log('hm hmm')
    //     //     return true
    //     // }
    //     console.log('shouldComponentUpdate', incomingData !== currentData)
    //     if (incomingData !== currentData) {
    //         return false
    //     }
    //     return true
    // }



    componentWillUnmount () {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange (appState) {
        if (appState === 'active') {
        }
    }

    render () {
        // const { conferences } = this.state;
        const {conferences} = (this.props)

        if (this.state.splash === null) return null;
        if (this.state.splash){
            SplashScreen.hide();
            return <View style={{flex: 1, backgroundColor: '#fff'}}>
                <CachedImage style={{flex: 1}} source={{ uri: this.state.splash }} />
            </View>;
        }

            return (<Root>
                    <PLNavigator />
            </Root>)

    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

// var LoginStack = createStackNavigator({
//     initialRouteName: { screen: LoginScene },
//     Login: { screen:  },
//     TermsAndPolicy: { screen: TermsPolicyScene },
//     ForgotPassword: { screen: ForgotPasswordScene },
//     Register: { screen: RegisterScene },
//     Tour: { screen: TourScene },
// });



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

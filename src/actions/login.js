/**
 * @flow
 */

'use strict';

var ActionSheetIOS = require('ActionSheetIOS');
var { Platform, AsyncStorage, Keyboard  } = require('react-native');
var Alert = require('Alert');
var { API_URL, MixpanelToken } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
var FacebookSDK = require('FacebookSDK');
var { loadUserProfile } = require('./users');
import Mixpanel from 'react-native-mixpanel'


import OneSignal from 'react-native-onesignal';

async function queryFacebookAPI(path, ...args): Promise {
  return new Promise((resolve, reject) => {
    FacebookSDK.api(path, ...args, (response) => {
      if (response && !response.error) {
        resolve(response);
      } else {
        reject(response && response.error);
      }
    });
  });
}

function logInWithFacebook() {
  return new Promise((resolve, reject) => {
    FacebookSDK.login((result) => {
      console.log('logInWithFacebook result', result)
      if (result.error) {
        console.log(result.error);
        reject(result.error);
      } else {
        var response = result.authResponse;
        fetch(API_URL + `/secure/facebook/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              facebook_id: response.userID || response.userId,
              facebook_token: response.accessToken
            })
        })
        .then((res) => res.json())
        .then(user => {
            console.log('USER FROM LOGIN WITH FACEBOOK', user);
            if (user.token) {               
                var data = {
                    id: user.id,
                    username: user.username,
                    token: user.token,
                    is_registration_complete: user.is_registration_complete
                };
                //Mixpanel.identify(username);
                //Mixpanel.track("Facebook Login");
                resolve(data);
            }else{        
              //if user is not already registered with Facebook, but tries to login with Facebook, this gets information from user's FB account  
              FacebookSDK.api("/me", "get", {fields: 'email,first_name,last_name,picture,gender,location,hometown,birthday,link'}, function(data, err){
                    if(err){
                      console.log(err);
                      reject(err);
                    }
                    var payloadData = {
                      facebook_id: data.id,
                      facebook_token: response.accessToken,
                      email: data.email,
                      email_confirm: data.email,
                      first_name: data.first_name,
                      last_name: data.last_name,
                      avatar_file_name: data.pic,
                      sex: data.gender? data.gender[0].toUpperCase() + data.gender.slice(1, data.gender.last_name): '',
                      facebook_link: data.link
                    };
                    if(data.address){
                      payloadData.address1 = data.address.street;
                      payloadData.city = data.address.city;
                      payloadData.state = data.address.state;
                      payloadData.zip = data.address.zip;
                    }
                    if(data.birthday){
                      payloadData.birth = data.birthday;
                    }
                    if(data.picture && data.picture.data){
                      payloadData.avatar_file_name = data.picture.data.url;
                    }
                    if(data.email){
                      payloadData.username = data.email.split("@")[0];
                    }
                    //Mixpanel.identify(username);
                    //Mixpanel.track("Facebook Registration");
                    resolve(payloadData);
                });
            }
        })
        .catch(err => {
            reject(err);
        });        
      }
    }, {scope: 'public_profile,email,user_friends'});
  });
}

async function forgotPassword(email: string) {
  try {
    let response = await fetch(`${API_URL}/secure/forgot-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      })
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}


//for unregistering for push notifications with Powerline backend. NOT for OneSignal
function unregisterDevice(token, id) {
  console.log('oneSignal /this UNREGISTER', token, id);
  console.log('unregistering => ',API_URL + '/v2/devices/' + id,  ({
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
}))
  return new Promise((resolve, reject) => {
      fetch(API_URL + '/v2/devices/' + id, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
      })
          .then(data => {
              console.log("oneSignal Unregister Device API Success", data);
              resolve(data);
          })
          .catch(err => {
              console.log("oneSignal Unregister Device API Error", err);
              reject(err);
          });
  });
}

function sendRecoveryEmail(data){
  console.log('=>', data);
  return new Promise((resolve, reject) => {
    fetch(API_URL + '/v2/security/recovery', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'      
      },
      body: JSON.stringify(data)
    }).then(r => {
      if (r.status === 200){
        resolve(r)
      }
      else {
        reject(r)
      }
    }).catch(e => {
      console.log(e);
      reject(e);
    })
  })
}


function logOut(token): ThunkAction {
  return (dispatch) => {
    FacebookSDK.logout();
    OneSignal.setSubscription(false);
    AsyncStorage.getItem('pushId', (err, pushId) => {        
      unregisterDevice(token, pushId)          
      AsyncStorage.setItem('pushId', '')
    });
    AsyncStorage.clear();
    return dispatch({
      type: 'LOGGED_OUT',
    });
    Mixpanel.track("Logout");
  };
}

function logOutWithPrompt(token): ThunkAction {
  return (dispatch, getState) => {
    let name = getState().user.username || 'there';

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Hi, ${name}`,
          options: ['Log out', 'Cancel'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            dispatch(logOut(token));
          }
        }
      );
    } else {
      Alert.alert(
        `Hi, ${name}`,
        'Log out from Powerline?',
        [
          { text: 'Cancel' },
          { text: 'Log out', onPress: () => dispatch(logOut(token)) },
        ]
      );
    }
  };
}
Mixpanel.sharedInstanceWithToken(MixpanelToken);

module.exports = { 
  logInWithFacebook,
  forgotPassword,
  logOut,
  logOutWithPrompt,
  sendRecoveryEmail,
  finishRecovery: sendRecoveryEmail
};

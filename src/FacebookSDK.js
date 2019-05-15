/**
 * @flow
 * @providesModule FacebookSDK
 */
'use strict';
import { Platform } from 'react-native';
var {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = require('react-native-fbsdk');

var {FBLoginManager} = require('react-native-facebook-login');

const emptyFunction = () => { };
const mapObject = require('fbjs/lib/mapObject');
import { API_URL } from './PLEnv'


type AuthResponse = {
  userID: string;
  accessToken: string;
  expiresIn: number;
};
type LoginOptions = { scope: string };
type LoginCallback = (result: { authResponse?: AuthResponse, error?: Error }) => void;

let _authResponse: ?AuthResponse = null;

async function loginWithFacebookSDK(options: LoginOptions): Promise<AuthResponse> {
  return new Promise((fullfill, reject) => {
    const scope = options.scope || 'public_profile';
    const permissions = scope.split(',');
    if(Platform.OS == 'ios') {
      console.log('opening in system mode');
      FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
    }
    console.log('will login')
    LoginManager.logInWithReadPermissions(["public_profile", "email", "user_friends"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with result: ",
              result
          );
          FacebookSDK.api("/me", "get", {fields: 'email,first_name,last_name,picture,gender,location,hometown,birthday,link'}, async function(data, err){
              if(err){
                console.log(err);
                reject(err);
              }
              try {
                const fb_token = await AccessToken.getCurrentAccessToken()
                const {accessToken} = JSON.parse(JSON.stringify(fb_token))
                console.log(fb_token, accessToken)
                const requestBody = JSON.stringify({
                  facebook_id: data.id,
                  facebook_token: accessToken
                })
                console.log('request body', requestBody)
                const user = await fetch(API_URL + `/secure/facebook/login`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: requestBody
                })

                const userJson = await user.json()
                console.log('request result', userJson)
                if (userJson.token) {               
                  var data = {
                      id: userJson.id,
                      username: userJson.username,
                      token: userJson.token,
                      is_registration_complete: userJson.is_registration_complete
                  };
                  fullfill(data);
                } else { 
                  let payloadData = {
                    facebook_id: data.id,
                    facebook_token: accessToken,
                    email: data.email,
                    email_confirm: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    avatar_file_name: data.picture && data.picture[0] && data.picture[0].url || '',
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
    
                  fullfill(payloadData);
                }
            } catch (error) {
                reject(error) 
            }
          });

        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
        reject(error)
      }
    );
  })
}

var FacebookSDK = {

  login(callback: LoginCallback, options: LoginOptions) {
    loginWithFacebookSDK(options).then(authResponse =>
      callback({ authResponse })
    ).catch(error => {
      callback({ error })
    });
  },

  getAuthResponse(): ?AuthResponse {
    return _authResponse;
  },

  logout() {
    LoginManager.logOut();
  },

  api: function (path: string, ...args: Array<mixed>) {
    const argByType = {};
    args.forEach((arg) => { argByType[typeof arg] = arg; });

    const httpMethod = (argByType['string'] || 'get').toUpperCase();
    const params = argByType['object'] || {};
    const callback = argByType['function'] || emptyFunction;

    // FIXME: Move this into RNFBSDK
    // GraphRequest requires all parameters to be in {string: 'abc'}
    // or {uri: 'xyz'} format
    const parameters = mapObject(params, (value) => ({ string: value }));

    function processResponse(error, result) {
      // FIXME: RNFBSDK bug: result is Object on iOS and string on Android
      if (!error && typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch (e) {
          error = e;
        }
      }

      const data = error ? { error } : result;
      callback(data);
    }

    const request = new GraphRequest(path, { parameters, httpMethod }, processResponse);
    new GraphRequestManager().addRequest(request).start();
  },

  getFriendsIds: function() {
    return new Promise((fullfill, reject) => {
      const auth = FacebookSDK.getAuthResponse();
      if (auth && auth.accessToken) {
        fetch('https://graph.facebook.com/v2.10/me?fields=friends&access_token=' + auth.accessToken)
          .then(response => response.json())
          .then(data => {
              WARN('OKI', data);
              if (data && data.friends && Array.isArray(data.friends.data) && data.friends.data.length > 0) {
                const friendsIds = data.friends.data.map(friend => friend.id);
                fullfill(friendsIds);
              } else {
                reject(data.error.message);
              }
          })
          .catch(error => {
              reject(error);
          });
      } else {
        reject('No facebook access token');
      }
    });
  }
};

module.exports = FacebookSDK;

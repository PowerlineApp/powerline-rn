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

type AuthResponse = {
  userID: string;
  accessToken: string;
  expiresIn: number;
};
type LoginOptions = { scope: string };
type LoginCallback = (result: { authResponse?: AuthResponse, error?: Error }) => void;

let _authResponse: ?AuthResponse = null;

async function loginWithFacebookSDK(options: LoginOptions): Promise<AuthResponse> {
  const scope = options.scope || 'public_profile';
  const permissions = scope.split(',');
  if(Platform.OS == 'ios') {
    console.log('opening in system mode');
    FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
  }
  
  FBLoginManager.loginWithPermissions(permissions, function(error, data){
    if (!error) {
      console.log("Login data: ", data);
      // const accessToken = AccessToken.getCurrentAccessToken();
      // if (!accessToken) {
      //   throw new Error('No access token');
      // }

      _authResponse = {
        userID: data.credentials.userId, // FIXME: RNFBSDK bug: userId -> userID
        accessToken: data.credentials.token,
        expiresIn: Math.round((data.credentials.tokenExpirationDate - Date.now()) / 1000),
      };
      return _authResponse;
    } else {
      console.log("Error: ", error);
    }

  })
  return null;
  
}

var FacebookSDK = {

  login(callback: LoginCallback, options: LoginOptions) {
    loginWithFacebookSDK(options).then(
      (authResponse) => callback({ authResponse }),
      (error) => callback({ error })
    );
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
    return new Promise((resolve, reject) => {
      const auth = FacebookSDK.getAuthResponse();
      if (auth && auth.accessToken) {
        fetch('https://graph.facebook.com/v2.10/me?fields=friends&access_token=' + auth.accessToken)
          .then(response => response.json())
          .then(data => {
              WARN('OKI', data);
              if (data && data.friends && Array.isArray(data.friends.data) && data.friends.data.length > 0) {
                const friendsIds = data.friends.data.map(friend => friend.id);
                resolve(friendsIds);
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

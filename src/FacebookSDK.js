/**
 * @flow
 * @providesModule FacebookSDK
 */
'use strict';
import { Platform, Alert } from 'react-native';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';


const emptyFunction = () => { };
const mapObject = require('fbjs/lib/mapObject');
import { API_URL, OAUTH_URL, clientId, clientSecret } from './PLEnv'

type AuthResponse = {
  userID: string;
  accessToken: string;
  expiresIn: number;
};
type LoginOptions = { scope: string };
type LoginCallback = (result: { authResponse?: AuthResponse, error?: Error }) => void;

let _authResponse: ?AuthResponse = null;

const alow = (msg) => {
  return new Promise((f, r) => {
    Alert.alert('alow',
        JSON.stringify(msg),
        [
            {text: 'Ok', onPress: () => {
                f()
            }}
        ],
        {cancelable: false}
        )
  })
}

async function loginWithFacebookSDK(options: LoginOptions): Promise<AuthResponse> {
  return new Promise((fullfill, reject) => {
    const scope = options.scope || 'public_profile';
    const permissions = scope.split(',');
    // if(Platform.OS == 'ios') {
    //   console.log('opening in system mode');
    //   FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
    // }

    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        console.log('result', result)
        if (result.isCancelled) {
          console.log("Login cancelled");
          reject(new Error('Login cancelled.'))
        } else {
          console.log(
            "Login success with result: ",
              result
          );
          FacebookSDK.api("/me", "get", {fields: 'email,first_name,last_name,picture,gender,location,hometown,birthday,link'}, async function(data, err){
              if(err){
                reject(err);
              }
              try {
                const fb_token = await AccessToken.getCurrentAccessToken()
                const {accessToken} = JSON.parse(JSON.stringify(fb_token))


                let access_token = null
                let IsRegistrationComplete = null

                try {
                  const requestBody = JSON.stringify({
                    facebook_id: data.id,
                    facebook_token: accessToken,
                    grant_type: "urn:ietf:params:oauth:grant-type:facebook",
                    client_id: clientId,
                    client_secret: clientSecret,
                  })
                  console.log('request body', requestBody)
                  const user = await fetch(OAUTH_URL + '/v2/token', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: requestBody
                  })
                  // const text = await user.text()
                  const resJson = await user.json()
                  console.log('response from api facebook login > ', resJson)
                  access_token = resJson.access_token
                  IsRegistrationComplete = resJson.is_registration_complete
                } catch (error) {
                  console.log('failed to get access_token from api', error)
                }
                if (access_token) {               
                  fullfill({token: access_token});
                } else {
                  let payloadData = {
                    token: access_token, IsRegistrationComplete,
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
                  console.log('final user json before register')
                  fullfill(payloadData);
                }
            } catch (error) {
                console.error('error :', error)
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

  login : loginWithFacebookSDK,

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

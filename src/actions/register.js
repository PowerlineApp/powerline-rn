import axios from 'axios';
import { API_URL, OAUTH_URL, clientId, clientSecret } from '../PLEnv';
import { loadUserProfile } from './users';
import {fetchConferences} from './conferences'

//For checking if username taken
function findByUsernameEmailOrPhone({username, email, phone}){
    let query = '';
    if (!!username) {
        query = `username=${username}`;
        // body={username: username};
    } else if (!!email){
        // body={email: email};
        query = `email=${email}`;
    } else {
        // body={phone: phone};
        query = `phone=${phone}`;
    }
    console.log(API_URL +`-public/users?${query}`);
    return new Promise((resolve, reject) => {
        fetch(API_URL +`-public/users?${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then((res) => {
            console.log('res => ', res);
            if (res.status === 404){
                resolve(res);
            } else {
                reject(`${!!username ? 'Username' : !!email ? 'Email' : 'Phone'} already taken.`);
            }
        }).catch(e => {
            reject(e);
        });
    });
}

function register(data){
    return new Promise((resolve, reject) => {
        fetch(API_URL + `/secure/registration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then(user => {
            if (user.token) {               
                var data = {
                    id: user.id,
                    username: user.username,
                    token: user.token,
                    is_registration_complete: user.is_registration_complete
                };
                resolve(data);
            }else{
                reject(user);
            }
        })
        .catch(err => {
            reject(err);
        });
    });
}
async function register2(data){
    console.log('registering user: ' + API_URL + `/v2/security/registration`, data);
    return new Promise((fullfill, reject) => {
        fetch(API_URL + `/v2/security/registration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => {
            console.log('res register', res);
            if (res.status === 200){
                res.json().then(r => fullfill(r));
            } else {
                res.json().then(r => reject(r));
            }
        }).catch(e => {console.log('hey'); reject(e);});
    });
    
    
    // try {
    //     let res = await fetch(API_URL + `/v2/security/registration`, {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data)
    //     });
    //     return res.json();
    // } catch (error) {
    //     return new Error(error);
    // }
}

async function getZipCode(GEO_KEY){
    return new Promise((fullfill, reject) => {
        let position = navigator.geolocation.getCurrentPosition(async function (position) {
            let geoInfo = fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&result_type=street_address&key=${GEO_KEY}`);
            geoInfo = await geoInfo.json(); 
            fullfill(geoInfo);
        },
        (error) => console.log(new Date(), error),
        {enableHighAccuracy: false, timeout: 25000, maximumAge: 3600000});

    });
    console.log('position', position);
}

function registerFromFB(data){
    delete data.token
    // console.log('registering w/ fb', '/secure/registration-facebook', {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // });
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/secure/registration-facebook', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then(user => {
            if (user.token) {
                var data = {
                    id: user.id,
                    username: user.username,
                    token: user.token,
                    is_registration_complete: user.is_registration_complete
                };
                resolve(data);
            }else{
                reject(user);
            }
        })
        .catch(err => {
            reject(err);
        });
    });
}
function verifyCode ({phone, username, password, code}) {
    console.log('~>' + API_URL + `/v2/security/login`, API_URL + '/v2/security/login', {
        method: 'POST',
        body: JSON.stringify({username, phone, password, code}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });
    
    return new Promise((fullfill, reject) => {
        fetch(API_URL + '/v2/security/login', {
            method: 'POST',
            body: JSON.stringify({phone, username, password, code}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => {
            console.log(res);
            if (res.status === 200){
                fullfill(res);
            } else {
                reject(res);
            }
        }).catch(e => {reject(e);});
    });
}
function login2 (username, password) {
    console.log(API_URL + '/v2/security/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }});
    return new Promise((fullfill, reject) => {
        fetch(API_URL + '/v2/security/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => {
            console.log('login res', res);
            if (res.ok){
                fullfill(res);
            } else {
                reject(res);
            }
        }).catch(e => {
            console.log('error on login > ', e);
            reject(e);
        });
    });
}


function verifyNumber (phone) {
    console.log('~>' + API_URL + `-public/phone/verification`, phone);
    return new Promise((fullfill, reject) => {
        fetch(API_URL + '-public/phone/verification', {
            method: 'POST',
            body: JSON.stringify({phone}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => {
            console.log(res);
            if (res.status === 200){
                // res.json().then(r => fullfill(r));
                fullfill(res);
            } else {
                // res.json().then(r => reject(r));
                reject(res);
            }
        }).catch(e => {reject(e);});
    });

}

const oauthLogin = (username, code) => dispatch => {
    const params = {
        url: OAUTH_URL + '/v2/token',
        method: 'POST',
        data: {
            "grant_type": "urn:ietf:params:oauth:grant-type:phone_code",
            "client_id": clientId,
            "client_secret": clientSecret,
            username,
            code
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    console.log(params);
    return axios(params)
      .then(response => {
          console.log('oauth login response', response);
          if (response.status === 200) {
              dispatch({
                  type: 'GET_OAUTH_TOKEN_SUCCESS',
                  payload: response.data,
              });
              loadUserProfile(response.data.access_token).then(dispatch);
              dispatch(fetchConferences(response.data.access_token, true))

          } else {
              dispatch({
                  type: 'GET_OAUTH_TOKEN_SUCCESS',
              });
          }
      });
};

module.exports = {
    findByUsernameEmailOrPhone,
    register,
    register2,
    verifyNumber,
    registerFromFB,
    verifyCode,
    sendCode: verifyCode,
    login2,
    getZipCode,
    oauthLogin,
};
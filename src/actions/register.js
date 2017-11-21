var { API_URL } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

//For checking if username taken
function findByUsernameOrEmail({username, email}){
    let query = '';
    if (username) {
        query = `username=${username}`;
    } else {
        query = `email=${email}`;
    }
    // console.log(API_URL +`-public/users/?${query}`);
    return new Promise((resolve, reject) => {
        fetch(API_URL +`-public/users/?${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((res) => res.json())
        .then(users => {
            resolve(users);
        })
        .catch(err => {
            reject(err);
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
    console.log('~>' + API_URL + `/v2/security/registration`, data);
    try {
        let res = await fetch(API_URL + `/v2/security/registration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log(res);
        return res.json();
    } catch (error) {
        return new Error(error);
    }
    // return new Promise((resolve, reject) => {
    //     .then((res) => res.json())
    //     .catch(err => {
    //         reject(err);
    //     });
    // });
}

function registerFromFB(data){
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
function verifyCode (phone, code) {
    console.log('~>' + API_URL + `/v2/security/login`, phone, code);
    console.log('request:', {
        endpoint: API_URL + '/v2/security/login',
        method: 'POST',
        body: JSON.stringify({phone, code})
    });
    return fetch(API_URL + '/v2/security/login', {
        method: 'POST',
        body: JSON.stringify({phone, code})
    });    
}

module.exports = {
    findByUsernameOrEmail,
    register,
    register2,
    registerFromFB,
    verifyCode,
    sendCode: verifyCode
};
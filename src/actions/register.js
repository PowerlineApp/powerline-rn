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

module.exports = {
    findByUsernameOrEmail,
    register,
    registerFromFB
};
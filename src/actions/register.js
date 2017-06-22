var { API_URL } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

function findByUsername(username: string){
    return new Promise((resolve, reject) => {
        fetch(`https://api-staging.powerli.ne/api-public/users/?username=` + username, {
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
        fetch(`https://api-staging.powerli.ne/api/secure/registration`, {
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
    findByUsername,
    register
};
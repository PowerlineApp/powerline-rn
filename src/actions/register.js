var { API_URL } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

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
    console.log('~>' + API_URL + `/v2/security/registration`, data);
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
    return new Promise((fullfill, reject) => {
        fetch(API_URL + '/v2/security/login', {
            method: 'POST',
            body: JSON.stringify({phone, code}),
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

module.exports = {
    findByUsernameEmailOrPhone,
    register,
    register2,
    verifyNumber,
    registerFromFB,
    verifyCode,
    sendCode: verifyCode,
    getZipCode
};
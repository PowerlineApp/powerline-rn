var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function loadUserProfile(token: string): Promise<Action> {
    try {
        var response = await fetch(`${API_URL}/v2/user?_format=json`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        if (json.full_name) {
            const action = {
                type: 'LOADED_USER_PROFILE',
                data: json,
            };
            return Promise.resolve(action);
        }
        else {
            return Promise.reject(json);
        }
    } catch (error) {
        // TEST PURPOSE:
        console.error(error);
        return Promise.reject(error);
    }
}

function loadUserData(token){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user?_format=json', {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Load User Profile Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Load User Profile Error", err);
            reject(err);
        })
    });
}

function loadUserProfileById(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/users/' + id, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Load User Profile Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Load User Profile Error", err);
            reject(err);
        })
    });
}

function getInvites(token){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/invites', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Get Invites API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Get Invites API Error", err);
            reject(err);
        })
    });
}

//for registering for push notifications with Powerline backend. NOT for OneSignal
function registerDevice(token, params){
    return new Promise((resolve, reject) => {
        console.log({
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(params)
        });
        fetch(API_URL + '/v2/devices', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(params)
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Register Device API Success", JSON.stringify(data));
            resolve(data);
        })
        .catch(err => {
            console.log("Register Device API Error", JSON.stringify(err));
            reject(err);
        });
    })
}

//for unregistering for push notifications with Powerline backend. NOT for OneSignal
function unregisterDevice(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/devices/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then(data => {
            console.log("Unregister Device API Success", JSON.stringify(data));
            resolve(data);
        })
        .catch(err => {
            console.log("Unregistere Device API Error", JSON.stringify(err));
            reject(err);
        });
    });
}

function search(token, query){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/search?query=' + query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Search Results API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Search Results Error Error", err);
            reject(err);
        })
    });
}

module.exports = {
    loadUserProfile,
    loadUserProfileById,
    loadUserData,
    getInvites,
    registerDevice,
    unregisterDevice,
    search
}
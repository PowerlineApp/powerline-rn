var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
var FacebookSDK = require('FacebookSDK');
import api from '../utils/api';

async function loadUserCards(token) {
    try {
        let res = await fetch(`${API_URL}/v2/cards`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        })
        return res.json();
    } catch (error) {
        console.warn(error);   
    }
}

async function userAddCard (token, data) {
    console.log(API_URL + '/v2/cards', token, data);
    try {
        let res = await fetch(API_URL + '/v2/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(data)
        });
        console.log('res on adding card', res)
        return res.json();
    } catch (error) {
        console.warn(error);
    }
}

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

function loadUserData(token) {
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

function loadUserProfileById(token, id) {
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

function getInvites(token) {
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
function registerDevice(token, params) {
    console.log('/this REGISTERING : ', token, params)
    return new Promise((resolve, reject) => {
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

function search(token, query) {
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

async function getFriendsSuggestions(token: string) {
    const friendsIds = await FacebookSDK.getFriendsIds();
    const friends = await api.post(token, '/profile/facebook-friends', friendsIds);
    if (friends.status === 200) {
        return await friends.json();
    }
}

module.exports = {
    loadUserProfile,
    loadUserCards,
    userAddCard,
    loadUserProfileById,
    loadUserData,
    getInvites,
    registerDevice,
    search,
    getFriendsSuggestions
}
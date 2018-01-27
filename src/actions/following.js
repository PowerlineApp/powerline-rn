var { API_URL } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
import { showToast } from 'PLToast';


//Shows who the user is following (User A is following User B... User B returned)
function getFollowings(token, page, per_page){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followings?_format=json&page='+ page +'&per_page=' + per_page, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Following API call Success:", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Following API call Error", err);
            reject(err);
        });
    });    
}

//Shows who follows the logged-in user (User A is following User B... User A is returned)
function getFollowers(token, page,per_page){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followers?_format=json&page='+page +'&per_page=' + per_page, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Followers API call Success:", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Following API call Error", err);
            reject(err);
        });
    });
}

//To stop allowing a user to follow you. All users must be approved to be followers. this undoes an approved follower
function unFollowers(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followers/' + id, {
            method: 'DELETE',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })        
        .then(() => {
            console.log("UnFollowing API call Success:");
            resolve();
        })
        .catch(err => {
            console.log("UnFollowing API call Error", err);
            reject(err);
        });
    });
}

//To accept a follower request
function acceptFollowers(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followers/' + id, {
            method: 'PATCH',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })        
        .then(() => {
            console.log("Accept Following API call Success:");
            resolve();
        })
        .catch(err => {
            console.log("Accept Following API call Error", err);
            reject(err);
        });
    });
}

//To search for users that the logged-in user is not already following
function searchForUsersFollowableByCurrentUser(token, queryText, page = 0, max_count = 20){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/users/?unfollowing=1&page='+ page +'&max_count=' + max_count + '&q=' + queryText, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })      
        .then((res) => res.json())  
        .then((data) => {
            console.log("Seach Followable users API call Success:", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Seach Followable users API call Error", err);
            reject(err);
        });
    });
}

function putFollowings(token, id, activityId: number){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followings/' + id, {
            method: 'PUT',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })      
        .then(() => {
            console.log("Following a user,  API call Success:");
            showToast('Follow request sent!')
            resolve({
                type: 'CHANGE_FOLLOW_STATUS',
                data: { id: activityId, follow_status: 'pending' },
            });
        })
        .catch(err => {
            console.log("Following a user, API call Error", err);
            reject(err);
        });
    });
}

//To stop following someone
function unFollowings(token, id, activityId: number){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followings/' + id, {
            method: 'DELETE',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })        
        .then(() => {
            showToast('User unfollowed')
            console.log("UnFollowing API call Success:");
            resolve({
                type: 'CHANGE_FOLLOW_STATUS',
                data: { id: activityId, follow_status: null },
            });
        })
        .catch(err => {
            console.log("UnFollowing API call Error", err);
            reject(err);
        });
    });
}

function getFollowingUser(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followings/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Following user profile API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Following user profile API Error", err);
            reject(err);
        });
    });
}

function editFollowers(token, id, notifying, time){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/followers/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                notifying: notifying,
                do_not_disturb_till: time
            })
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Edit Followers API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Edit Followers API Error", err);
            reject(err);
        });
    });
}

module.exports = {
    getFollowings,
    getFollowers,
    unFollowings,
    unFollowers,
    acceptFollowers,
    searchForUsersFollowableByCurrentUser,
    putFollowings,
    getFollowingUser,
    editFollowers
};
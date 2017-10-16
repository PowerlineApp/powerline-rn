
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function loadUserGroups(token: string, page: ?number = 0, perPage: ?number = PER_PAGE): Promise<Action> {
    try {
        var response = await fetch(`${API_URL}/v2/user/groups?_format=json&page=${page + 1}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        });
        var groups = await response.json();
        if (groups.items) {
            var action = {
                type: 'LOADED_GROUPS',
                data: {
                    page: groups.page,
                    items: groups.items,
                    payload: groups.payload,
                },
            };
            if (groups.payload.length === 0) {
                action = {
                    type: 'LOADED_GROUPS',
                    data: {
                        page: groups.page - 1,
                        items: 0,
                        payload: [],
                    },
                };
            }
            return Promise.resolve(action);
        }
        else {
            return Promise.reject(groups);
        }
    } catch (error) {
        console.error(error);
    }
}

function clearGroupsInCache(): ThunkAction {
    return (dispatch) => {
        return dispatch({
            type: 'CLEAR_CACHED_GROUPS',
        });
    };
}

function createGroup(token, groupData){
    return new Promise((resolve, reject) => {
        var payload = JSON.stringify(groupData);
        console.log(payload);
        fetch(API_URL + '/v2/user/groups', {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            },
            body: payload
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Create Group API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Create Group API Error", err);
            reject(err);
        });
    });
}

function getGroups(token){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/groups', {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Get My Groups API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Get My Groups API Error", err);
            reject(err);
        });
    });
}

function getGroupsBySort(token, sort){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/groups/' + sort, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Get Groups By sort API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Get Groups By sort API Error", err);
            reject(err);
        });
    });
}

function searchGroup(token, query){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups?query='  + query, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Search Group API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Search Group API Error", err);
            reject(err);
        });
    });
}

function getGroupDetails(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Get Group profile API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Get Group profile API Error", err);
            reject(err);
        });
    });
}

function getGroupMembers(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + id + '/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Get Group Members API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Get Group Members API Error", err);
            reject(err);
        });
    });
}

function inviteAllFollowers(token, id, users){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + id + '/invites', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                users: users
            })
        })
        .then(data => {
            console.log("InviteAllFollowers API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("InviteAllFollowers API Error", err);
            reject(err);
        })
    });
}

function followAllMembers(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/group-followers/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then(data => {
            console.log("Group Followers API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Group Followers API Error", err);
            reject(err);
        })
    });
}

function unJoinGroup(token, id){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/groups/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        
        .then(data => {
            console.log("UnJoin Group API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("UnJoin Group API Error", err);
            reject(err);
        });
    });
}

function joinGroup(token, id, passcode, answeredFields){
    var payload = {};
    if(passcode){
        payload['passcode'] = passcode;
    }
    if(answeredFields){
        payload['answered_fields'] = answeredFields.map(function(f){
            return {
                'id': f.field.id,
                'value': f.field_value
            }
        })
    }
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/groups/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(payload)
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Join Group API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Join Group API Error", err);
            reject(err);
        })
    });
}

function loadFieldsToFillOnJoin(token, groupId){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + groupId + '/fields', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("loadFieldsToFillOnJoin API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("loadFieldToFillOnJoin API Error", data);
            reject(err);
        })
    });
}

function getGroupPermissions(token, groupId){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + groupId + '/permission-settings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("get Group Permission API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("get Group Permission API Error", err);
            reject(err);
        });
    })
}

function getUsersByGroup(token, groupId, query){
    return new Promise((resolve, reject) => {
        
        fetch(API_URL + '/v2/groups/' + groupId + '/users?query=' + query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("get Group Users API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("get Group Users API Error", err);
            reject(err);
        });
    })
}



module.exports = {
    loadUserGroups,
    clearGroupsInCache,
    createGroup,
    getGroups,
    getGroupsBySort,
    searchGroup,
    getGroupDetails,
    getGroupMembers,
    inviteAllFollowers,
    followAllMembers,
    unJoinGroup,
    joinGroup,
    loadFieldsToFillOnJoin,
    getGroupPermissions,
    getUsersByGroup,
    
}
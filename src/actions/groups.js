
import api from '../utils/api';
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
import { ActionTypes } from '../reducers/groupManagement'
//Loads user's current joined groups
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

//I think this only happens on logout, but cache should be updated whenever user joins/leaves a group or logs in so that group selector is up to date
function clearGroupsInCache(): ThunkAction {
    return (dispatch) => {
        return dispatch({
            type: 'CLEAR_CACHED_GROUPS',
        });
    };
}

//User can create a new group. He is owner of group by default.
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

async function inviteUpvotersToGroup(token: string, id: number, groupId: number, type: string): Promise<Action> {
    console.log("Invite upvoters to group API");
    return await api.put(
        token,
        `/v2/groups/${groupId}/invites`,
        { [type]: id }
    );
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

async function searchPostsByHashtab(token: string, tag: string): Promise<Action> {
    console.log("search Hashtag API", tag);
    return await api.get(
        token,
        `/v2/activities?hash_tag=${tag}`
    );
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

function getGroupRequiredFields(token, id){
    return new Promise((resolve, reject) => {
        const url = API_URL + '/v2/groups/' + id + '/fields'
        console.log('API_URL', url)
        console.log('API_URL', token)
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Get Group fields Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Get Group fields API Error", err);
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

//Invites all followers to a group
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

//Function to follow all members of a group at once
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
    console.log('joinGroup')
    console.log(token)
    console.log(id)
    console.log(passcode)
    console.log(answeredFields)
    var payload = {};
    //user must provide correct passcode if required
    if(passcode){
        payload['passcode'] = passcode;
    }
    //user must provide info in required fields if requested
    if(answeredFields){
        payload['answered_fields'] = answeredFields.map(item => {
            return {
                id: item.id,
                value: item.answer
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

//User must provide info in required fields if requested
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

//User must be alerted to information shared with group when joining. User must accept to be joined.
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
            // console.log("get Group Users API Success", data);
            resolve(data);
        })
        .catch(err => {
            // console.log("get Group Users API Error", err);
            reject(err);
        });
    })
}

function updateGroupAvatar(token, groupId, image) {
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + groupId + '/avatar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({avatar: image})
        })
        .then((res) => res.json())
        .then(data => {
            // console.log("get Group Users API Success", data);
            resolve(data);
        })
        .catch(err => {
            // console.log("get Group Users API Error", err);
            reject(err);
        });
    })
}


const getGroupPendingUsers = (groupId) => (dispatch, getState) => {
    const token = getState().user.token;
    dispatch({type: ActionTypes.FETCH_GROUP_MEMBERS_LOADING, payload: true})
    fetch(API_URL + '/v2/groups/' + groupId + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    })
    .then((res) => res.json())
    .then(data => {
        console.log('getGroupPendingUsers', data)
        dispatch({type: ActionTypes.FETCH_GROUP_MEMBERS_SUCCESS, payload: data.payload})
        dispatch({type: ActionTypes.FETCH_GROUP_MEMBERS_LOADING, payload: false})
    })
    .catch(err => {
        console.log("get Group Users API Error", err);
        dispatch({type: ActionTypes.FETCH_GROUP_MEMBERS_LOADING, payload: false})
        dispatch({type: ActionTypes.FETCH_GROUP_MEMBERS_ERROR, payload: err})        
    });
}

const promoteUserToManager = (groupId, userId) => (dispatch, getState) => {
    const token = getState().user.token;
    dispatch({type: ActionTypes.GROUP_PROMOTE_USER_LOADING, payload: true})
    fetch(API_URL + '/v2/groups/' + groupId + '/managers/' + userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    })
    .then((res) => res.json())
    .then(data => {
        console.log('promoteUser', data)
        if(data.code) {
            dispatch({type: ActionTypes.GROUP_PROMOTE_USER_ERROR, payload: data.message})        
            return;
        }
        dispatch({type: ActionTypes.GROUP_PROMOTE_USER_SUCCESS, payload: userId})
        dispatch({type: ActionTypes.GROUP_PROMOTE_USER_LOADING, payload: false})
    })
    .catch(err => {
        console.log("promoteUser API Error", err);
        dispatch({type: ActionTypes.GROUP_PROMOTE_USER_LOADING, payload: false})
        dispatch({type: ActionTypes.GROUP_PROMOTE_USER_ERROR, payload: err})        
    });
}

const unPromoteUserToMember = (groupId, userId) => (dispatch, getState) => {
    const token = getState().user.token;
    dispatch({type: ActionTypes.GROUP_UNPROMOTE_USER_LOADING, payload: true})
    fetch(API_URL + '/v2/groups/' + groupId + '/managers/' + userId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    })
    .then(data => {
        console.log('promoteUser', data)
        if(data.code) {
            dispatch({type: ActionTypes.GROUP_UNPROMOTE_USER_ERROR, payload: data.message})        
            return;
        }
        dispatch({type: ActionTypes.GROUP_UNPROMOTE_USER_SUCCESS, payload: userId})
        dispatch({type: ActionTypes.GROUP_UNPROMOTE_USER_LOADING, payload: false})
    })
    .catch(err => {
        console.log("UNPROMOTEUser API Error", err);
        dispatch({type: ActionTypes.GROUP_UNPROMOTE_USER_LOADING, payload: false})
        dispatch({type: ActionTypes.GROUP_UNPROMOTE_USER_ERROR, payload: err})        
    });
}

const approveUserToGroup = (groupId, userId) => (dispatch, getState) => {
    const token = getState().user.token;
    dispatch({type: ActionTypes.GROUP_ACCEPT_USER_LOADING, payload: true})
    fetch(API_URL + '/v2/groups/' + groupId + '/users/' + userId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    })
    .then((res) => res.json())
    .then(data => {
        console.log('approveUserToGroup', data)
        dispatch({type: ActionTypes.GROUP_ACCEPT_USER_SUCCESS, payload: {data, userId}})
        dispatch({type: ActionTypes.GROUP_ACCEPT_USER_LOADING, payload: false})
    })
    .catch(err => {
        console.log("approveUserToGroup API Error", err);
        dispatch({type: ActionTypes.GROUP_ACCEPT_USER_LOADING, payload: false})
        dispatch({type: ActionTypes.GROUP_ACCEPT_USER_ERROR, payload: err})        
    });
}

const removeUserFromGroup = (groupId, userId) => (dispatch, getState) => {
    const token = getState().user.token;
    dispatch({type: ActionTypes.GROUP_REMOVE_USER_LOADING, payload: true})
    fetch(API_URL + '/v2/groups/' + groupId + '/users/' + userId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    })
    .then(data => {
        console.log('removeUserFromGroup', data)
        dispatch({type: ActionTypes.GROUP_REMOVE_USER_SUCCESS, payload: userId})
        dispatch({type: ActionTypes.GROUP_REMOVE_USER_LOADING, payload: false})
    })
    .catch(err => {
        console.log("removeUserFromGroup API Error", err);
        dispatch({type: ActionTypes.GROUP_REMOVE_USER_LOADING, payload: false})
        dispatch({type: ActionTypes.GROUP_REMOVE_USER_ERROR, payload: err})        
    });
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
    searchPostsByHashtab,
    unJoinGroup,
    joinGroup,
    loadFieldsToFillOnJoin,
    getGroupPermissions,
    getUsersByGroup,
    inviteUpvotersToGroup,
    getGroupRequiredFields,
    updateGroupAvatar,

    // REAL ACTIONS
    getGroupPendingUsers,
    promoteUserToManager,
    approveUserToGroup,
    removeUserFromGroup,
    unPromoteUserToMember
}
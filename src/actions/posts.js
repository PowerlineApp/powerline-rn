import api from '../utils/api';
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function loadPost(token: string, entityId: number): Promise<Action> {
    try {
        var response = await fetch(`${API_URL}/v2/posts/${entityId}`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        if (json && json.body) {
            return Promise.resolve(json);
        }
        else {
            return Promise.reject(json);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

async function votePost(token: string, postId: string, option: string) {
    try {
        let response = await fetch(`${API_URL}/v2/posts/${postId}/vote`, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                option: option,
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        handleError(error);
    }
}

async function addCommentToPost(token: string, postId: string, comment: string, parentId: ?string = '0', privacy: ?string = 'public') {
    try {
        let response = await fetch(`${API_URL}/v2/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment_body: comment,
                parent_comment: parentId,
                privacy: privacy,
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        handleError(error);
    }
}

async function loadPostComments(token: string, entityId: number, page: ?number = 0, perPage: ?number = PER_PAGE, sort: ?string = 'default', sortDir: ?string = 'DESC'): Promise<Action> {
    try {
        var response = await fetch(`${API_URL}/v2/posts/${entityId}/comments?_format=json&page=${page + 1}&per_page=${perPage}&sort=${sort}&sort_dir=${sortDir}`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        if (json && json.payload) {
            return Promise.resolve(json);
        }
        else {
            return Promise.reject(json);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

async function ratePostComment(token: string, commentId, rateValue: string) {
    try {
        let response = await fetch(`${API_URL}/v2/post-comments/${commentId}/rate`, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rate_value: rateValue,
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        handleError(error);
    }
}

function handleError(error) {
    const message = error.message || error;
    alert(message);
}

function createPostToGroup(token, groupId, content){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + groupId + '/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({body: content})
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Create Post To Group API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Create Post To Group API Error", err);
            reject(err);
        })
    });
}

function createPetition(token, groupId, title, content){
    var data = {petition_title: title, 
        petition_body: content, 
        subject: '.',
        type: 'petition'
    };

    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + groupId + '/polls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body:  JSON.stringify(data)
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Create Petition To Group API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Create Petition To Group API Error", err);
            reject(err);
        })
    });
}

function getPetitionConfig(token, groupId){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/groups/' + groupId + '/micro-petitions-config', {
            method: 'GET',
            headers: {
                'Content-Type': 'application',
                'token':  token
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("get Petition API  Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("get Petition API Error", err);
            reject(err);
        });
    });
}

function deletePost(token: string, postId: number, activityId: number): ThunkAction {
    return async (dispatch) => {
        try {
            const response = await api.delete(token, `/v2/posts/${postId}`);
            console.log("delete Post API  Success", response);

            if (response.status === 204 && response.ok) {
                dispatch({ type: 'DELETE_ACTIVITY', id: activityId });
            }
        } catch (error) {
            console.log("delete Post API Error", error);
        }
    };
}

function deletePetition(token: string, petitionId: number, activityId: number): ThunkAction {
    return async (dispatch) => {
        try {
            const response = await api.delete(token, `/v2/micro-petitions/${petitionId}`);
            console.log("delete Petition API  Success", response);

            if (response.status === 204 && response.ok) {
                dispatch({ type: 'DELETE_ACTIVITY', id: activityId });
            }
        } catch (error) {
            console.log("delete Petition API Error", error);
        }
    };
}

module.exports = {
    votePost,
    loadPostComments,
    addCommentToPost,
    ratePostComment,
    createPostToGroup,
    createPetition,
    getPetitionConfig,
    loadPost,
    deletePost,
    deletePetition,
};
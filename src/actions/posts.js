import api from '../utils/api';
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
import { showToast } from 'PLToast';
import { showAlertYesNo } from 'PLAlert';

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
    return fetch(`${API_URL}/v2/posts/${postId}/vote`, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                option: option,
            })
        });
}

async function undoVotePost(token: string, postId: string) {
    console.log(token, postId, 'undo');
    return fetch(`${API_URL}/v2/posts/${postId}/vote`, {
            method: 'DELETE',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });
}




async function unsubscribeFromPost(token: string, postId: string) {
    try {
        let response = await fetch(`${API_URL}/v2/user/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            })
        });
        response = response.ok;
        return response;
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

        if (responseJson.status === 200) {
            showToast('Comment Successful!');
        }
        
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

function createPostToGroup(token, groupId, content, base64image) {
    return new Promise((resolve, reject) => {
        const body = { body: content };
        if (base64image) {
            body.image = base64image;
        }
        fetch(API_URL + '/v2/groups/' + groupId + '/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(body)
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

function createPetition(token, groupId, title, content, base64image) {
    var data = {
        title: title,
        body: content
    };

    if (base64image) {
        data.image = base64image;
    }

    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2.2/groups/' + groupId + '/user-petitions', {
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

function deletePost(postId: number, activityId: number): ThunkAction {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const response = await api.delete(token, `/v2/posts/${postId}`);
            console.log("delete Post API  Success", response);

            if (response.status === 204 && response.ok) {
                showToast('Item Deleted');
                dispatch({ type: 'DELETE_ACTIVITY', id: activityId });
            } else {
                handleError(response);
            }
        } catch (error) {
            console.log("delete Post API Error", error);
            handleError(error);
        }
    };
}

function deletePetition(petitionId: number, activityId: number): ThunkAction {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token; 
            const response = await api.delete(token, `/v2/user-petitions/${petitionId}`);
            console.log("delete Petition API  Success", response);

            if (response.status === 204 && response.ok) {
                showToast('Item Deleted');
                dispatch({ type: 'DELETE_ACTIVITY', id: activityId });
            } else {
                handleError(response);
            }
        } catch (error) {
            console.log("delete Petition API Error", error);
            handleError(error);
        }
    };
}

function updateActivityDescription(dispatch, id, description) {
    dispatch({
        type: 'CHANGE_ACTIVITY_DESCRIPTION',
        data: {
            id,
            description,
        },
    });
}

function changePost(postId: number, activityId: number, value: string): ThunkAction {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const response = await api.put(
                token,
                `/v2/posts/${postId}`,
                { body: value }
            );
            console.log("put Post API  Success", response);

            if (response.status === 200 && response.ok) {
                showToast('Edits saved');
                updateActivityDescription(dispatch, activityId, value);
            } else {
                handleError(response);
            }
        } catch (error) {
            console.log("put Post API Error", error);
            handleError(error);
        }
    };
}

function changePetition(petitionId: number, activityId: number, value: string): ThunkAction {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const response = await api.put(
                token,
                `/v2/user-petitions/${petitionId}`,
                { body: value }
            );
            console.log("put Petition API  Success", response);

            if (response.status === 200 && response.ok) {
                showToast('Edits saved');
                updateActivityDescription(dispatch, activityId, value);
            } else {
                handleError(response);
            }
        } catch (error) {
            console.log("put Petition API Error", error);
            handleError(error);
        }
    };
}

function boostPost(type: string, postId: number, groupId: number, activityId: number): ThunkAction {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const members = await api.get(token, `/v2/groups/${groupId}`);
            const { total_members } = await members.json();

            if (typeof total_members !== 'number') {
                return;
            }

            showAlertYesNo(`All ${total_members} group members will get a notification about this item immediately. Are you sure? Use sparingly!`, async () => {
                const boost = await api.patch(token, `/v2/${type}s/${postId}`);
                if (boost.ok && boost.status === 200) {
                    console.log("boost Post/Petition API Success");
                    dispatch({ type: 'BOOST_ACTIVITY', id: activityId });
                } else {
                    handleError(response);
                }
            });
        } catch (error) {
            console.log("boost Post/Petition API Error", error);
            handleError(error);
        }
    };
}

function handleError(error) {
    const message = error.message || error;
    alert(message);
}

module.exports = {
    votePost,
    undoVotePost,
    loadPostComments,
    addCommentToPost,
    ratePostComment,
    createPostToGroup,
    createPetition,
    getPetitionConfig,
    unsubscribeFromPost,
    loadPost,
    deletePost,
    deletePetition,
    changePost,
    changePetition,
    boostPost,
};
import api from '../utils/api';
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

//Allows user to add a comment to an item
async function addComment(token: string, type: string, id: string, comment: string, parentId: ?string = '0', privacy: ?string = 'public') {
    let url = `${API_URL}/v2/${type}s/${id}/comments`;
    // console.log('addcomment => ', url, {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         comment_body: comment,
    //         parent_comment: parentId,
    //         privacy: privacy,
    //     })
    // });
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment_body: comment,
                parent_comment: parentId,
                privacy: privacy,
            })
        });
        let responseJson = await response.json();
        console.log('response from adding comment', responseJson)
        return responseJson;
    } catch (error) {
        handleError(error);
    }
}

async function editComment(type: string, token: string, commentId: number, value: string): Promise<Action> {
    console.log("edit Comment API", type, commentId, value);
    return await api.put(
        token,
        `/v2/${type}-comments/${commentId}`,
        { comment_body: value }
    );
}

async function deleteComment(type: string, token: string, commentId: number): Promise<Action> {
    console.log("delete Comment API", commentId);
    return await api.delete(token, `/v2/${type}-comments/${commentId}`);
}

async function getComments(token: string, type: string, id: number, cursor = 0, perPage: number = PER_PAGE): Promise<Action> {
    var url = '';
    if (cursor === 0) {
        url = `${API_URL}/v2.2/${type}s/${id}/comments?cursor=${cursor}&limit=${perPage}`;
    } else {
        url = cursor;
    }
    try {
        var response = await fetch(url, {
            method: 'GET',
            headers: {
                 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        let nextCursor = response.headers.get('X-Cursor-Next');
        let action = {
            nextCursor: nextCursor,
            comments: json,
        };
        return Promise.resolve(action);
    } catch (error) {
        return Promise.reject(error);
    }
}

//Shows the replies to a parent comment
async function getChildComments(token: string, type: string, id: number, cursor = 0, perPage: number = PER_PAGE): Promise<Action> {
    var url = '';
    if (cursor === 0) {
        url = `${API_URL}/v2.2/${type}-comments/${id}/comments?cursor=${cursor}&limit=${perPage}`;
    } else {
        url = cursor;
    }
    try {
        var response = await fetch(url, {
            method: 'GET',
            headers: {
                 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        let nextCursor = response.headers.get('X-Cursor-Next');
        let action = {
            nextCursor: nextCursor,
            comments: json,
        };
        return Promise.resolve(action);
    } catch (error) {
        return Promise.reject(error);
    }
}

//Upvote/downvote a COMMENT
async function rateComment(token: string, type: string, commentId: string, rateValue: string) {
    try {
        let response = await fetch(`${API_URL}/v2/${type}-comments/${commentId}/rate`, {
            method: 'POST',
            headers: {
                 'Authorization': `Bearer ${token}`,
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

module.exports = {
    addComment,
    getComments,
    getChildComments,
    rateComment,
    deleteComment,
    editComment,
};
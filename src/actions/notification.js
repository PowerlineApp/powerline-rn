//For notification feed tab
import api from '../utils/api';
var { API_URL } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');


//Called Social Activities on backend. Called Notification Feed tab on frontend
function getActivities(token, page = 1, per_page = 50){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/user/social-activities?_format=json&tab=you&&page='+page +'&per_page=' + per_page, {
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

async function sharePost(token: string, postId: number): Promise<Action> {
    try {
        const response = await api.put(token, `/v2/user/shared-posts/${postId}`);
        const responseJson = await response.json();

        alert(responseJson.message);
    } catch(err) {

    }
}

module.exports = {
    getActivities,
    sharePost
};
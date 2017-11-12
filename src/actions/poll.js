var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');


// trying new req pattern
function createPoll(token, groupId, body){
    console.log('creating poll - ', `${API_URL}/v2/groups/${groupId}/polls`, token, groupId, body)
    return fetch(`${API_URL}/v2/groups/${groupId}/polls`, {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}

async function unsubscribeFromPoll(token: string, pollId: string) {
    try {
        let response = await fetch(`${API_URL}/v2/poll/${pollId}`, {
            method: 'DELETE',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            })
        });
        response = response.ok
        return response;
    } catch (error) {
        handleError(error);
    }
}

async function sendAttachment(token, pollId, attachment){
    console.log('about to attach => ',`${API_URL}/v2/polls/${pollId}/educational-contexts`, token, pollId, attachment )
    return fetch(`${API_URL}/v2/polls/${pollId}/educational-contexts`, {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attachment)
    })
}


function handleError(error) {
    const message = error.message || error;
    alert(message);
}

module.exports = {
    unsubscribeFromPoll,
    createPoll,
    sendAttachment
};
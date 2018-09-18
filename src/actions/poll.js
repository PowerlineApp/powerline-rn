var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function signLeaderPetition(token, pollId, option, amount) {
    console.log('to the api => ', token, pollId, option, ' --- ' + `${API_URL}/v2/polls/${pollId}/answers/${option}`, amount)
    try {
        let response = await fetch(`${API_URL}/v2/polls/${pollId}/answers/${option}`, {
            method: 'PUT',
            headers: {
                 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_amount: amount ? amount : null
            })
        });
        console.log('real response: x=x=>', response);
        
        // let responseJson = await response.json();
        return response;
    } catch (error) {
        console.log('real error =x=x=> ', error);
        
        handleError(error);
    }
}
async function answerPollPut(token, pollId, option, amount) {
    console.log('to the api => ', token, pollId, option, ' --- ' + `${API_URL}/v2/poll-options/${pollId}`)
    console.log('===>> ' + `${API_URL}/v2/poll-options/${pollId}`, {
        method: 'PUT',
        headers: {
             'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: option,
            is_user_amount: !!amount,
            amount: amount ? amount : null
        })
    });
    try {
        let response = await fetch(`${API_URL}/v2/poll-options/${pollId}`, {
            method: 'PUT',
            headers: {
                 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value: option,
                is_user_amount: !!amount,
                amount: amount ? amount : null
            })
        });
        console.log('response from API', response);
        
        // let responseJson = await response.json();
        return response;
    } catch (error) {
        console.log('real error =x=x=> ', error);
        
        handleError(error);
    }
}





async function loadPollByEntityId(token, entityId) {
    console.log('fetching poll - ', `${API_URL}/v2/polls/${entityId}`, token, entityId)
    let res = await fetch(`${API_URL}/v2/polls/${entityId}`, {
        method: 'GET',
        headers: {
             'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return res.json();
}


// trying new req pattern
function createPoll(token, groupId, body){
    console.log('creating poll - ', `${API_URL}/v2/groups/${groupId}/polls`, token, groupId, body)
    return fetch(`${API_URL}/v2.2/groups/${groupId}/polls`, {
        method: 'POST',
        headers: {
             'Authorization': `Bearer ${token}`,
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
                 'Authorization': `Bearer ${token}`,
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
             'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attachment)
    })
}

async function publishPoll(token, pollId, attachment){
    console.log('about to publish => ',`${API_URL}/v2/polls/${pollId}`, token, pollId, attachment )
    return fetch(`${API_URL}/v2/polls/${pollId}`, {
        method: 'PATCH',
        headers: {
             'Authorization': `Bearer ${token}`,
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
    sendAttachment,
    publishPoll,
    loadPollByEntityId,
    signLeaderPetition,
    answerPoll: signLeaderPetition,
    answerPollPut: signLeaderPetition
};
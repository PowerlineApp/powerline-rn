var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function signPetition(token: string, petitionId: string) {
    try {
        let response = await fetch(`${API_URL}/v2/micro-petitions/${petitionId}/sign`, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        handleError(error);
    }
}

async function unsubscribeFromPetition(token: string, petitionId: string) {
    try {
        let response = await fetch(`${API_URL}/v2/user/user-petitions/${petitionId}`, {
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


function handleError(error) {
    const message = error.message || error;
    alert(message);
}


module.exports = {
    signPetition,
    unsubscribeFromPetition
};
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function signUserPetition(token: string, petitionId: string) {
    try {
        let response = await fetch(`${API_URL}/v2/user-petitions/${petitionId}/sign`, {
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
async function signLeaderPetition(token: string, petitionId: string, option: string) {
    try {
        let response = await fetch(`${API_URL}/v2/polls/${petitionId}/answers/${option}`, {
            method: 'PUT',
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

async function unsubscribeFromUserPetition(token: string, petitionId: string) {
    try {
        let response = await fetch(`${API_URL}/v2/user/user-petitions/${petitionId}/sign`, {
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
    signUserPetition,
    unsubscribeFromUserPetition,
    signLeaderPetition
};
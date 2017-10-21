var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function signUserPetition(token: string, petitionId: string) {
    try {
        console.log('to the api => ', token, petitionId, 'sign')
        let response = await fetch(`${API_URL}/v2/user-petitions/${petitionId}/sign`, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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

async function unsignUserPetition(token: string, petitionId: string) {
    console.log('to the api => ', token, petitionId, 'delete')
    try {
        let response = await fetch(`${API_URL}/v2/user-petitions/${petitionId}/sign`, {
            method: 'DELETE',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            })
        });
        console.log('real response: x=x=>', response);
        
        // response = response.ok;
        // let responseJson = await response.json();
        
        return response;
    } catch (error) {
        console.log('real error =x=x=> ', error);
        
        handleError(error);
    }
}

async function signLeaderPetition(token: string, petitionId: string, option: string) {
    console.log('to the api => ', token, petitionId, option)
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
        console.log('real response: x=x=>', response);
        
        // let responseJson = await response.json();
        return response;
    } catch (error) {
        console.log('real error =x=x=> ', error);
        
        handleError(error);
    }
}




function handleError(error) {
    const message = error.message || error;
    alert(message);
}


module.exports = {
    signUserPetition,
    unsignUserPetition,
    signLeaderPetition
};
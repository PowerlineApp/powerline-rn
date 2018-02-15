var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function signUserPetition(token, petitionId) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('request: ', `${API_URL}/v2/user-petitions/${petitionId}/sign`, {
                method: 'POST',
                headers: {
                     'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                })
            });
            let response = await fetch(`${API_URL}/v2/user-petitions/${petitionId}/sign`, {
                method: 'POST',
                headers: {
                     'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                })
            });
            console.log('response', response);
            // if (response.status !== 204){
            //     throw new Error('Signing failed.');
            // }
            // let responseJson = await response.json();
            resolve(response);
        } catch (error) {
            console.log('real error =x=x=> ', error);
            handleError(error);
            reject(error);
        }
    });
    
}

async function unsignUserPetition(token, petitionId) {
    console.log('to the api => ', token, petitionId, 'delete --- ' +  `${API_URL}/v2/user-petitions/${petitionId}/sign`);
    try {
        let response = await fetch(`${API_URL}/v2/user-petitions/${petitionId}/sign`, {
            method: 'DELETE',
            headers: {
                 'Authorization': `Bearer ${token}`,
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


function handleError(error) {
    const message = error.message || error;
    alert(message);
}


module.exports = {
    signUserPetition,
    unsignUserPetition
};
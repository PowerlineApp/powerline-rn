var { Action, ThunkAction } = require('./types');
var { API_URL } = require('../PLEnv');

async function fetchConferences (token: string) => (dispatch, getState) => {
    console.log('\n\n==================== fetch conferences')
    console.log('current state => ', getState())
    try {
        var response = await fetch(`${API_URL}/v2.2/conferences`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        var json = await response.json();
        console.log('fetchConferences result from api', json);
        const action = {
            type: 'LOADED_CONFERENCES',
            data: json,
        };
        return Promise.resolve(action);
       
    } catch (error) {
        console.log('error-----------', error);
        return Promise.reject(error);
    }
}

module.exports = {
    fetchConferences,
}

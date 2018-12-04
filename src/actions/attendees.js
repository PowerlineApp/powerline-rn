var { Action, ThunkAction } = require('./types');
var { API_URL } = require('../PLEnv');

async function fetchAttendees (token: string, id: string): Promise<Action> {
    try {

        var response = await fetch(`${API_URL}/v2.2/${id}/attendees`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        var json = await response.json();
        console.log('fetchAttendees', json);
        const action = {
            type: 'LOADED_ATTENDEES',
            data: json,
        };
        return Promise.resolve(action);
       
    } catch (error) {
        console.log('error-----------', error);
        return Promise.reject(error);
    }
}

module.exports = {
    fetchAttendees,
}

var { API_URL } = require('../PLEnv');

async function fetchEvents (token: string, id: string): Promise<Action> {
    try {
        console.log('id-----------', id);
        var response = await fetch(`${API_URL}/v2.2/conferences/${id}/events`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        var json = await response.json();
        console.log('fetchEvents', json);
        const action = {
            type: 'LOADED_EVEMTS',
            data: json,
        };
        return Promise.resolve(action);
       
    } catch (error) {
        console.log('error-----------', error);
        return Promise.reject(error);
    }
}

module.exports = {
    fetchEvents,
}

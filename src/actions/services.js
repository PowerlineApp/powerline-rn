var { API_URL } = require('../PLEnv');

async function listServices(token): Promise<Action> {
    try {
        var response = await fetch(`${API_URL}/v2.2/user/concierge-services`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        var json = await response.json();
        const action = {
            type: 'LOADED_CONCIERGE_SERVICES',
            data: json,
        };
        return Promise.resolve(action);
       
    } catch (error) {
        return Promise.reject(error);
    }
 };

async function setService(token, serviceId, service) {
    console.log('set service request', {
        url: `${API_URL}/v2.2/user/concierge-services/${serviceId}`,
        method: 'PUT',
        headers: {
                'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(service)
    });
    try {
        let response = await fetch(`${API_URL}/v2.2/user/concierge-services/${serviceId}`, {
            method: 'PUT',
            headers: {
                 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service)
        });
        // const res = await response.json();
        // console.log('set service response', res);
        const action = {
            type: 'SET_STATUS',
            data: response
        };
        return Promise.resolve(action);
    } catch (error) {
        console.log('set service error', error);
        return Promise.reject(error);
    }
}

 module.exports = {
     listServices,
     setService,
 }; 
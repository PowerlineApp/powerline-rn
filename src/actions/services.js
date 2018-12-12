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
        console.log('listServices', json);
        const action = {
            type: 'LOADED_CONCIERGE_SERVICES',
            data: json,
        };
        return Promise.resolve(action);
       
    } catch (error) {
        console.log('error-----------', error);
        return Promise.reject(error);
    }
 };

function setService(service) {
  return {
    type: 'SET_SERVICE',
    payload: service
  };
}

 module.exports = {
     listServices,
     setService,
 }; 
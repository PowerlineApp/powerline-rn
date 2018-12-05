var { API_URL } = require('../PLEnv');

 function listServices(token) {
     return new Promise((fullfill, reject) => {
         fetch(`${API_URL}/v2.2/user/concierge-services`, {
             method: 'GET',
             headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`
             }
         }).then(res => {
             if (res.ok){
                 fullfill(res);
             } else {
                 reject(res);
             }
         }).catch(e => {
             console.log('error while getting service list > ', e);
             reject(e);
         });
     });
 };

 module.exports = {
     listServices
 }; 
var { API_URL, PER_PAGE } = require('../PLEnv');


function createAnnouncement(token, groupId, body){
    console.log('creating announcement - ', `${API_URL}/v2/groups/${groupId}/announcements`, token, groupId, body)
    
    return fetch(`${API_URL}/v2/groups/${groupId}/announcements`, {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}

module.exports = {
    createAnnouncement
};
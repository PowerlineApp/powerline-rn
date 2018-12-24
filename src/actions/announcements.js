var { API_URL, PER_PAGE } = require('../PLEnv');


function createAnnouncement(token, groupId, body){
    //console.log('creating announcement - ', `${API_URL}/v2/groups/${groupId}/announcements`, token, groupId, body)
    
    return fetch(`${API_URL}/v2/groups/${groupId}/announcements`, {
        method: 'POST',
        headers: {
             'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}

async function publishAnnouncement(token, announcementId, attachment){
    //console.log('about to publish => ',`${API_URL}/v2/announcements/${announcementId}`, token, announcementId, attachment )
    return fetch(`${API_URL}/v2/announcements/${announcementId}`, {
        method: 'PATCH',
        headers: {
             'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attachment)
    })
}

module.exports = {
    createAnnouncement,
    publishAnnouncement
};
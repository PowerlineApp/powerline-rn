
import api from '../utils/api';
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
import { showToast } from 'PLToast';

async function updateProfileSetup(token: string, id: number, data: object): Promise<Action> {
    LOG('Update Profile API', id, data);
    const response = await api.put(token, `/v2/groups/${id}`, data);
    return response;
}

async function sendGroupInvites(token: string, id: number, emails: string): Promise<Action> {
    LOG('Send Group Invites API', id, emails);
    if (emails == null || emails.length == 0) {
        return;
    }

    const emailsAsArray = emails.split(',');
    const response = await api.put(token, `/v2/groups/${id}/users`, { users: emailsAsArray });
    LOG(response, emailsAsArray);
    if (response.status === 204 && response.ok) {
        showToast(`Invitations send successfully to ${emailsAsArray.length} user(s).`)
    }
    return response;
}

async function exportReports(token: string, id: number): Promise<Action> {
    LOG('Export Reports API', id);

    const response = await api.get(token, `/v2/groups/${id}/responses`)
    LOG(response);
    return response;
}

module.exports = {
    updateProfileSetup,
    sendGroupInvites,
    exportReports,
}
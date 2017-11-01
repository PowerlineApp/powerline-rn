
import _ from 'lodash';
import { API_URL, PER_PAGE } from 'PLEnv';
import { showToast } from 'PLToast';

import { getGroupPermissions } from './groups';
import { Action, ThunkAction } from './types';
import api from '../utils/api';

async function updateProfileSetup(token: string, id: number, data: object): Promise<Action> {
  LOG('Update Profile API', id, data);
  const response = await api.put(token, `/v2/groups/${id}`, data);
  return response;
}

// GROUP PERMISSIONS
const permissionsLabels = {
  "permissions_name": "Name",
  "permissions_address": "Street Address",
  "permissions_city": "City",
  "permissions_state": "State",
  "permissions_country": "Country",
  "permissions_zip_code": "Zip Code",
  "permissions_email": "Email",
  "permissions_phone": "Phone Number",
  "permissions_responses": "Responses"
};

async function loadGroupPermissions(token: string, id: number): Promise<Action> {
  LOG('Get Group Permissions API', id);

  const settings = await getGroupPermissions(token, id);
  const respPerm = await api.get(token, `/v2/groups/${id}/permissions`);
  const permissions = await respPerm.json();

  const requiredPermissions = {};
  for (let perm in permissions) {
    if (permissionsLabels[perm]) {
      requiredPermissions[perm] = permissions[perm];
    }
  }


  let result = {};
  for (let perm in requiredPermissions) {
    let finded = false;
    settings.required_permissions.forEach((req) => {
      if (req === perm) {
        finded = true;
      }
    })

    result[perm] = finded;
  }

  return result;
}

async function updateGroupPermissions(token: string, id: number, permissions: string): Promise<Action> {
  LOG('Update Group Invites API', id, permissions);
  if (permissions.length == 0) {
    return;
  }

  const response = await api.put(token, `/v2/groups/${id}/permission-settings`, { required_permissions: permissions });
  LOG(response);
  return response;
}

// GROUP INVITES
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

async function getUserContentSettings(token: string, id: number): Promise<Action> {
  LOG('GET User Content Settings API', id);

  const response = await api.get(token, `/v2/groups/${id}/micro-petitions-config`)
  LOG(response);
  return response;
}

async function updateUserContentSettings(token: string, id: number, values: object): Promise<Action> {
  LOG('Update User Content Settings API', id, values);

  const response = await api.put(token, `/v2/groups/${id}/micro-petitions-config`, values);

  if (response.status === 403) {
    alert("You are not allowed to access this resource");
  }
  LOG(response);
  return response;
}


module.exports = {
  updateProfileSetup,
  loadGroupPermissions,
  updateGroupPermissions,
  getUserContentSettings,
  updateUserContentSettings,
  sendGroupInvites,
  exportReports,
}
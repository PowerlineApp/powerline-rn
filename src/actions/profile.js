
import _ from 'lodash';
import { API_URL, PER_PAGE } from 'PLEnv';
import { showToast } from 'PLToast';

import { getGroupPermissions } from './groups';
import { Action, ThunkAction } from './types';
import api from '../utils/api';

// PROFILE SETUP
async function updateProfileSetup(token: string, id: number, data: object): Promise<Action> {
  LOG('Update Profile API', id, data);
  return api.put(token, `/v2/groups/${id}`, data);
}

// MEMBERSHIP CONTROL
async function updateMembershipControl(token: string, id: number, control: string, passcode: string): Promise<Action> {
  LOG('Update Memebership Control API', id);
  const data = { membership_control: control };
  if (passcode) data.membership_passcode = passcode;

  return await api.put(token, `/v2/groups/${id}/membership`, data);
}

async function getMembershipFields(token: string, id: number): Promise<Action> {
  LOG('Get Memebership Fields API', id);
  const response = await api.get(token, `/v2/groups/${id}/fields`);
  return await response.json();
}

async function addMembershipField(token: string, id: number, value: string): Promise<Action> {
  LOG('Add Memebership Fields API', id);
  const response = await api.post(token, `/v2/groups/${id}/fields`, { field_name: value });
  return await response.json();
}

async function deleteMembershipField(token: string, id: number): Promise<Action> {
  LOG('Delete Memebership Fields API', id);
  return await api.delete(token, `/v2/group-fields/${id}`);
}

async function updateMembershipField(token: string, id: number, value: string): Promise<Action> {
  LOG('Update Memebership Fields API', id);
  const response = await api.put(token, `/v2/group-fields/${id}`, { field_name: value });
  return await response.json();
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

  return api.put(token, `/v2/groups/${id}/permission-settings`, { required_permissions: permissions });
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
  updateMembershipControl,
  getMembershipFields,
  addMembershipField,
  deleteMembershipField,
  updateMembershipField,
  loadGroupPermissions,
  updateGroupPermissions,
  getUserContentSettings,
  updateUserContentSettings,
  sendGroupInvites,
  exportReports,
}
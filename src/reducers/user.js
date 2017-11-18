/**
 *
 * @flow
 */

'use strict';

var type = require('../actions/types');
var Action = require('../actions/types');

export type State = {
  isLoggedIn: boolean;
  is_registration_complete: ?boolean;
  id: ?string;
  username: ?string;
  token: ?string;
  profile: ?object;
};

var initialState = {
  isLoggedIn: false,
  is_registeration_complete: null,
  id: null,
  username: null,
  token: null,
  profile: null
};

function user(state: State = initialState, action: Action): State {
  console.log('STATE', state)
  if (action.type === 'LOGGED_IN') {
    let { id, username, token } = action.data;
    return {
      ...state,
      isLoggedIn: true,
      token,
      id,
      username,
    };
  }
  if (action.type === 'LOADED_USER_PROFILE') {
    return {
      ...state,
      is_registration_complete: action.data.is_registration_complete,
      profile: action.data,
    };
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  return state;
}

module.exports = user;

import _ from "lodash";

var type = require("../actions/types");
var Action = require("../actions/types");

export type State = {
  isLoggedIn: boolean,
  is_registration_complete: ?boolean,
  id: ?string,
  username: ?string,
  token: ?string,
  expiresAt: ?Date,
  tokenType: ?'bearer',
  scope: ?string,
  refreshToken: ?string,
  profile: ?Object,
  blockedList: Array<any>,
};

const initialState: State = {
  isLoggedIn: false,
  is_registeration_complete: null,
  id: null,
  username: null,
  token: null,
  expiresAt: null,
  tokenType: null,
  scope: null,
  refreshToken: null,
  profile: null,
  blockedList: []
};

function user(state: State = initialState, action: Action): State {
  console.warn("=====<<<>>>====", action);
  switch (action.type) {
    case 'GET_OAUTH_TOKEN_SUCCESS':
      const date = new Date();
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.access_token,
        expiresAt: date.setSeconds(date.getSeconds() + action.payload.expires_in),
        tokenType: action.payload.token_type,
        scope: action.payload.scope,
        refreshToken: action.payload.refresh_token,
      };
    case 'GET_OAUTH_TOKEN_FAIL':
      return {
        ...state,
        isLoggedIn: false,
      };
    case 'LOGGED_IN':
      let { id, username, token } = action.data;
      return {
        ...state,
        isLoggedIn: true,
        token,
        id,
        username,
      };
    case 'LOADED_USER_PROFILE':
      return {
        ...state,
        id: action.data.id,
        username: action.data.username,
        is_registration_complete: action.data.is_registration_complete,
        profile: action.data,
      };
    case 'LOGGED_OUT':
      return initialState;
    case 'BLOCKED_LIST':
      return {
        ...state,
        blockedList: action.payload,
      };
    case 'USER_STATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

module.exports = user;

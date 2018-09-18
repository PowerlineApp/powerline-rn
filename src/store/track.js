'use strict';

// const {AppEventsLogger} = require('react-native-fbsdk');

import type {Action } from '../actions/types';

function track(action: Action): void {
  switch (action.type) {
    case 'LOGGED_IN':
      // AppEventsLogger.logEvent('Login', 1, {source: action.source || ''});
      break;

    case 'LOGGED_OUT':
      // AppEventsLogger.logEvent('Logout', 1);
      break;
  }
}

module.exports = track;

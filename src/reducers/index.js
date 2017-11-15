/**
 * @flow
 */

'use strict';

var { combineReducers } = require('redux');

import drawer from './drawer';
import user from './user';
import groups from './groups';
import bookmarks from './bookmarks';
import activities from './activities';
import notifications from './notifications';
import followers from './followers';

module.exports = combineReducers({
  user,
  drawer,
  groups,
  bookmarks,
  activities,
  notifications,
  followers
});
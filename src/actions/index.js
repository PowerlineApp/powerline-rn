/**
 * @providesModule PLActions
 * @flow
 */

'use strict';

const navigationActions = require('./navigation');
const loginActions = require('./login');
const groupActions = require('./groups');
const bookmarkActions = require('./bookmarks');
const activityActions = require('./activities');
const postActions = require('./posts');
const registerActions = require('./register');

module.exports = {
  ...loginActions,
  ...navigationActions,
  ...groupActions,
  ...bookmarkActions,
  ...activityActions,
  ...postActions,
  ...registerActions,
};

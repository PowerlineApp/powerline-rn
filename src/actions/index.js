/**
 * @providesModule PLActions
 * @flow
 */

'use strict';

const navigationActions = require('./navigation');
const loginActions = require('./login');
const groupActions = require('./groups');
const conferenceActions = require('./conferences');
const bookmarkActions = require('./bookmarks');
const activityActions = require('./activities');
const postActions = require('./posts');
const userActions = require('./users');
const registerActions = require('./register');
const followingActions = require('./following');
const notificationActions = require('./notification');
const representativesActions = require('./representatives');
const drawerActions = require('./drawer');
const commentActions = require('./comments');
const petitionActions = require('./petition');
const profileActions = require('./profile');
const representativesFormActions = require('./representativesForm');
const pollActions = require('./poll');
const announcementActions = require('./announcements');
const attendeesActions = require('./attendees');
const eventsActions = require('./events');

module.exports = {
    ...loginActions,
    ...navigationActions,
    ...groupActions,
    ...conferenceActions,
    ...bookmarkActions,
    ...activityActions,
    ...postActions,
    ...userActions,
    ...registerActions,
    ...followingActions,
    ...notificationActions,
    ...representativesActions,
    ...drawerActions,
    ...commentActions,
    ...petitionActions,
    ...profileActions,
    ...representativesFormActions,
    ...pollActions,
    ...announcementActions,
    ...attendeesActions,
    ...eventsActions
};

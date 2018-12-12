/**
 * @flow
 */

"use strict";

var { combineReducers } = require("redux");

import drawer from "./drawer";
import user from "./user";
import groups from "./groups";
import bookmarks from "./bookmarks";
import conferences from "./conferences";
import activities from "./activities";
import notifications from "./notifications";
import followers from "./followers";
import analytics from "./analytics";
import groupManagement from "./groupManagement";
import representativesForm from "./representativesForm";
import privacySettings from "./privacySettings";
import agency from "./agency";
import conciergeServices from "./services";

module.exports = combineReducers({
  user,
  drawer,
  analytics,
  groups,
  bookmarks,
  conferences,
  activities,
  notifications,
  followers,
  groupManagement,
  representativesForm,
  privacySettings,
  agency,
  conciergeServices,
});

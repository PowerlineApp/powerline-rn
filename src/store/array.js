'use strict';

module.exports = store => next => action => {
  console.warn(Array.isArray(action), action);
  return Array.isArray(action)
    ? action.map(next)
    : next(action)
};

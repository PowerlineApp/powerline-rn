/**
 * @flow
 */
'use strict';

var type = require('../actions/types');
var Action = require('../actions/types');

export type Tab =
  'newsfeed'
  | 'friends'
  | 'new'
  | 'messages'
  | 'notifications'
  ;

type State = {
  tab: Tab;
};

var initialState: State = { tab: 'newsfeed' };

function navigation(state: State = initialState, action: Action): State {
  if (action.type === 'SWITCH_TAB') {
    return { ...state, tab: action.tab };
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  return state;
}

module.exports = navigation;

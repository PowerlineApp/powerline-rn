/**
 *
 * @flow
 */

'use strict';

export type Action =
  { type: 'LOGGED_IN', source: ?string; data: { id: string; username: string; token: string; is_registeration_complete: ?boolean; } }
  | { type: 'LOGGED_OUT' }
  | { type: 'PUSH_NEW_ROUTE', route: string }
  | { type: 'POP_ROUTE' }
  | { type: 'POP_TO_ROUTE', route: string }
  | { type: 'REPLACE_ROUTE', route: string }
  | { type: 'REPLACE_OR_PUSH_ROUTE', route: string }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'LOADED_GROUPS', data: { page: number; items: number; payload: Array<Object> } }
  | { type: 'CLEAR_CACHED_GROUPS' }
  | { type: 'LOADED_BOOKMARKS', data: { page: number; totalPages: number; totalItems: number; items: Array<Object> } }
  | { type: 'RESET_BOOKMARKS' }
  | { type: 'LOADED_ACTIVITIES', data: { page: number; items: number; totalItems: number; payload: Array<Object> } }
  | { type: 'RESET_ACTIVITIES' }
  | { type: 'LOADED_USER_PROFILE', data: Object }
  | { type: 'DELETE_ACTIVITY', id: number }
  | { type: 'CHANGE_ACTIVITY_DESCRIPTION', data: { id: number, description: string }}
  | { type: 'BOOST_ACTIVITY', id: number }
  | { type: 'CHANGE_FOLLOW_STATUS', data: { id: number, follow_status: 'pending' | 'active' | null }};

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

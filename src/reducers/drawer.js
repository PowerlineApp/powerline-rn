
import type { Action } from '../actions/types';
import { OPEN_DRAWER, CLOSE_DRAWER } from '../actions/drawer';

export type State = {
    drawerState: string,
    drawerDisabled: boolean
}

const initialState = {
  drawerState: 'closed',
  drawerDisabled: false,
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === OPEN_DRAWER) {
    return {
      ...state,
      drawerState: 'opened',
      drawerDisabled: false
    };
  }
  
  if (action.type === CLOSE_DRAWER) {
    return {
      ...state,
      drawerState: 'closed',
      drawerDisabled: false
    };
  }

  return state;
}

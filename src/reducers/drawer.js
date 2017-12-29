
import { Action } from '../actions/types';
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
  
  if (action.type === 'REACT_NATIVE_ROUTER_FLUX_RESET' && action.key === 'home') {
    return {
      ...state,
      shouldResetHome: true
    };
  }
  if (action.type === 'HOME_WAS_RESET') {
    return {
      ...state,
      shouldResetHome: action.payload
    };
  }


  return state;
}

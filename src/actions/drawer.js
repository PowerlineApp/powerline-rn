
import type { Action } from './types';

export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

let openDrawerGambiarra = () => {}

export function openDrawer():Action {
  // return {
  //   type: OPEN_DRAWER,
  // };
  try {
    openDrawerGambiarra()
  } catch (error) {
    console.log(error, drawerRef)
  }
  return {type: 'bla'}
}

export function setDrawer (newDrawerRef) {
  openDrawerGambiarra = newDrawerRef;
}

export function closeDrawer():Action {
  return {
    type: CLOSE_DRAWER,
  };
}

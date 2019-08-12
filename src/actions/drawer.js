
import type { Action } from './types';

export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

let openDrawerGambiarra = () => {}
let closeDrawerGambiarra = () => {}

export function openDrawer():Action {
  try {
    openDrawerGambiarra()
  } catch (error) {
    console.log(error, drawerRef)
  }
  return {type: 'gambiarra', open: true}
}
export function closeDrawer():Action {
  try {
    closeDrawerGambiarra()
  } catch (error) {
    console.log(error, drawerRef)
  }
  return {type: 'gambiarra', open: false}
}

export function setDrawer (newDrawerRefOpen, newDrawerRefClose) {
  openDrawerGambiarra = newDrawerRefOpen;
  closeDrawerGambiarra = newDrawerRefClose;
}

// export function closeDrawer():Action {
//   return {
//     type: CLOSE_DRAWER,
//   };
// }

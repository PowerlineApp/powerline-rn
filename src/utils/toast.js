/**
 * @providesModule PLToast
 * @flow
 */

import Toast from 'react-native-root-toast';

export const showToast = (text: string) => {
  Toast.show(text, {
    duration: 2500,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {}, // calls on toast's appear animation start
    onShown: () => {}, // calls on toast's appear animation end
    onHide: () => {}, // calls on toast's hide animation start
    onHidden: () => {} // calls on toast's hide animation end
  });
};



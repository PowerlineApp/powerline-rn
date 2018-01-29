/**
 * @providesModule PLToast
 * @flow
 */

import {Toast} from 'native-base';

export const showToast = (text) => {
    Toast.show({
        text,
        position: 'bottom',
        // position: Toast.positions.BOTTOM,
        animation: true,
        shadow: true,
        delay: 0,
        hideOnPress: true,
        style: {color: '#f0f'},
        duration: 2500
    });
  // Toast.show(text, {
  //   duration: 2500,
  //   onShow: () => {}, // calls on toast's appear animation start
  //   onShown: () => {}, // calls on toast's appear animation end
  //   onHide: () => {}, // calls on toast's hide animation start
  //   onHidden: () => {} // calls on toast's hide animation end
  // });
};

// function eternityOfToasts(){
//     setTimeout(() => {
//         showToast('hello there');
//         eternityOfToasts();
//     }, 1000);
// }

// eternityOfToasts();
// export default showToast;






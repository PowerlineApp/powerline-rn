/**
 * @providesModule PLToast
 * @flow
 */

import { Toast as NativeToast } from 'native-base';

export const showToast = (text: string) => {
  NativeToast.show({
    text,
    position: 'bottom',
    duration: 1000,
  });
};


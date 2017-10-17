// @flow

import color from 'color';

let hexFunc = 'hex';
if (color.prototype.hex === undefined) {
  hexFunc = 'hexString';
}

export const darkenHex = (colorValue: string, darkenValue: number = 0.2): string => {
  return color(colorValue).darken(darkenValue)[hexFunc]();
};

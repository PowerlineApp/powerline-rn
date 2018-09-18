/**
 * @providesModule PLTouchable
 * @flow
 */

'use strict';

var React = require('react');
var { TouchableHighlight, TouchableNativeFeedback, Platform } = require('react-native');

function PLTouchableIOS(props: Object): ReactElement {
  return (
    <TouchableHighlight
      accessibilityTraits="button"
      underlayColor="#3C5EAE"
      {...props}
    />
  );
}

var PLTouchable = Platform.OS === 'android'
  ? TouchableNativeFeedback
  : PLTouchableIOS;

module.exports = PLTouchable;

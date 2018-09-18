/**
 *
 * @providesModule PLText
 * @flow
 */

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var { StyleSheet, Dimensions } = require('react-native');
var PLColors = require('PLColors');

function Text({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.font, style]} {...props} />;
}

function Heading1({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.font, styles.h1, style]} {...props} />;
}

function Paragraph({ style, ...props }: Object): ReactElement {
  return <ReactNative.Text style={[styles.font, styles.p, style]} {...props} />;
}

var scale = Dimensions.get('window').width / 375;

function normalize(size: number): number {
  return Math.round(scale * size);
}

var styles = StyleSheet.create({
  font: {
    fontFamily: require('../PLEnv').fontFamily,
    backgroundColor: 'transparent'
  },
  h1: {
    fontSize: normalize(24),
    lineHeight: normalize(27),
    color: PLColors.darkText,
    fontWeight: 'bold',
    letterSpacing: -1
  },
  p: {
    fontSize: normalize(15),
    lineHeight: normalize(23),
    color: PLColors.lightText
  },
});

module.exports = { Text, Heading1, Paragraph };
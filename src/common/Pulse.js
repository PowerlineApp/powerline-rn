import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

export default class Pulse extends React.Component {
  constructor(props) {
    super(props);

    this.anim = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: this.props.interval,
      easing: Easing.in,
    }).start();
  }

  render() {
    const { size, small, pulseMaxSize, borderColor, position, backgroundColor, getStyle } = this.props;
    let max = pulseMaxSize;
    if (small) {
      max = pulseMaxSize / 3;
    }

    const isCenter = position === 'center';
    const top = { top: height / 2, marginTop: -max / 2 };

    return (
      <View style={[{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: width / 2,
        width: max,
        height: max,
        marginLeft: -max / 2,
      }, Platform.OS === 'android' && { top: 18 }, isCenter && top]}>
        <Animated.View
          style={[styles.circle, {
            borderColor,
            backgroundColor,
            width: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [isCenter ? size : 50, max]
            }),
            height: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [isCenter ? size : 50, max]
            }),
            borderRadius: max / 2,
            opacity: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })
          }, getStyle && getStyle(this.anim)]}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  circle: {
    borderWidth: 4 * StyleSheet.hairlineWidth,
  },
});
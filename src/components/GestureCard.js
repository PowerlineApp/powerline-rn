import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';
import { Card } from 'native-base';

const directions = {
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT',
  LONG_PRESS: 'LONG_PRESS'
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
  longPressDelay: 1000,
};

function isValidSwipe(velocity, velocityThreshold, directionalOffset, directionalOffsetThreshold) {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold;
}

class GestureCard extends Component {
  static directions = directions;

  constructor(props, context) {
    super(props, context);
    this.swipeConfig = Object.assign(swipeConfig, props.config);
    this.startTime = null;
  }

  componentWillReceiveProps(props) {
    this.swipeConfig = Object.assign(swipeConfig, props.config);
  }

  componentWillMount() {
    const responderEnd = this._handlePanResponderEnd.bind(this);
    const shouldSetResponder = this._handleShouldSetPanResponder.bind(this);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: shouldSetResponder,
      onMoveShouldSetPanResponder: shouldSetResponder,
      onPanResponderRelease: responderEnd,
      onPanResponderTerminate: responderEnd
    });
  }

  _handleShouldSetPanResponder(evt, gestureState) {
    this.startTime = new Date();

    return evt.nativeEvent.touches.length === 1;
  }

  _gestureIsClick(gestureState) {
    return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
  }

  _handlePanResponderEnd(evt, gestureState) {
    const difference = new Date() - this.startTime;

    if (difference > this.swipeConfig.longPressDelay - 1000) {
      this._triggerSwipeHandlers(directions.LONG_PRESS, gestureState);
      return;
    }
    const swipeDirection = this._getSwipeDirection(gestureState);
    this._triggerSwipeHandlers(swipeDirection, gestureState);
  }

  _triggerSwipeHandlers(swipeDirection, gestureState) {
    const { onSwipeLeft, onSwipeRight, onLongPress } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT, LONG_PRESS } = directions;

    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState);
        break;
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState);
        break;
      case LONG_PRESS:
        onLongPress && onLongPress(gestureState);
        break;
    }
  }

  _getSwipeDirection(gestureState) {
    const { SWIPE_LEFT, SWIPE_RIGHT } = directions;
    const { dx, dy } = gestureState;

    if (this._isValidHorizontalSwipe(gestureState)) {
      return (dx > 0) ? SWIPE_RIGHT : SWIPE_LEFT;
    }

    return null;
  }

  _isValidHorizontalSwipe(gestureState) {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;

    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  }

  render() {
    return (
      <View
        {...this.props}
        {...this._panResponder.panHandlers}
      >
        <Card>
          {this.props.children}
        </Card>
      </View>
    );
  }
};

export default GestureCard;

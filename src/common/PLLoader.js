/**
 * @providesModule PLLoader
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import Pulse from './Pulse';
import PLColors from './PLColors';
import themeStyle from '../../native-base-theme/variables/platform';

export default class PLLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      circles: []
    };

    this.counter = 1;
    this.setInterval = null;
    this.anim = new Animated.Value(1);
  }

  componentDidMount() {
    this.setCircleInterval();
  }

  setCircleInterval() {
    this.setInterval = setInterval(this.addCircle.bind(this), this.props.interval);
    this.addCircle();
  }

  addCircle() {
    this.setState({ circles: [...this.state.circles, this.counter] });
    this.counter++;
  }

  onPressIn() {
    Animated.timing(this.anim, {
      toValue: this.props.pressInValue,
      duration: this.props.pressDuration,
      easing: this.props.pressInEasing,
    }).start(() => clearInterval(this.setInterval));
  }

  onPressOut() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: this.props.pressDuration,
      easing: this.props.pressOutEasing,
    }).start(this.setCircleInterval.bind(this));
  }

  render() {
    const { position, size, avatar, avatarBackgroundColor, padder, interval } = this.props;
    const isCenter = position === 'center';

    let containerStyle = {};
    if (isCenter) {
      containerStyle = {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      };
    }
    if (position === 'bottom') {
      containerStyle = {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
      };
    }

    return (
      <View style={containerStyle}>
        {this.state.circles.map((circle) => (
          <Pulse
            key={circle}
            position={position}
            small={!isCenter}
            {...this.props}
            padder={padder ? themeStyle.contentPadding : 0}
          />
        ))}

        <TouchableOpacity
          activeOpacity={1}
          style={{
            transform: [{
              scale: this.anim
            }],
            paddingTop: Platform.OS === 'ios' ? 0 : 20,
          }}
        >
          <View style={{
            width: isCenter ? 80 : 40,
            height: isCenter ? 80 : 40,
            backgroundColor: PLColors.main,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: isCenter ? 40 : 20,
          }}>
            <Image
              source={require("img/p_logo.png")}
              style={{
                tintColor: 'white',
                width: isCenter ? 26 : 13,
                height: isCenter ? 40 : 20,
                resizeMode: 'cover',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

PLLoader.propTypes = {
  interval: PropTypes.number,
  size: PropTypes.number,
  pulseMaxSize: PropTypes.number,
  avatarBackgroundColor: PropTypes.string,
  pressInValue: PropTypes.number,
  pressDuration: PropTypes.number,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  position: PropTypes.oneOf(['center', 'bottom']),
  getStyle: PropTypes.func,
};

PLLoader.defaultProps = {
  interval: 2000,
  size: 100,
  pulseMaxSize: 250,
  avatarBackgroundColor: 'white',
  pressInValue: 0.8,
  pressDuration: 150,
  pressInEasing: Easing.in,
  pressOutEasing: Easing.in,
  borderColor: '#D8335B',
  backgroundColor: '#ED225B55',
  getStyle: undefined,
};


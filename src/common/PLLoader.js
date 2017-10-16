/**
 * @providesModule PLLoader
 */
import React from 'react';
import { View, Image, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import Pulse from './Pulse';
import PLColors from './PLColors';


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
    const { size, avatar, center, avatarBackgroundColor, interval } = this.props;

    return (
      <View style={{
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {this.state.circles.map((circle) => (
          <Pulse
            key={circle}
            center={center}
            {...this.props}
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
            width: 80,
            height: 80,
            backgroundColor: PLColors.main,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
          }}>
            <Image
              source={require("img/p_logo.png")}
              style={{
                tintColor: 'white',
                width: 26,
                height: 40,
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
  interval: React.PropTypes.number,
  size: React.PropTypes.number,
  pulseMaxSize: React.PropTypes.number,
  avatarBackgroundColor: React.PropTypes.string,
  pressInValue: React.PropTypes.number,
  pressDuration: React.PropTypes.number,
  borderColor: React.PropTypes.string,
  backgroundColor: React.PropTypes.string,
  getStyle: React.PropTypes.func,
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


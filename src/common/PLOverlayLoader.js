/**
 * @providesModule PLOverlayLoader
 */
import React, { Component } from 'react';
import {
  Modal,
  ActivityIndicator,
  View,
  Text,
  StyleSheet
} from 'react-native';
import PLLoader from './PLLoader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  innerContainer: {
    // borderRadius: 10,
    alignItems: 'center',
    // padding: 20
  },
  indicator: {
    marginBottom: 15
  },
  message: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400'
  }
});

const SIZES = ['small', 'normal', 'large'];

export default class PLOverlayLoader extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    visible: React.PropTypes.bool,
    color: React.PropTypes.string,
    logo: React.PropTypes.bool,
    indicatorSize: React.PropTypes.oneOf(SIZES),
    messageFontSize: React.PropTypes.number,
    message: React.PropTypes.string
  };

  static defaultProps = {
    visible: false,
    color: 'white',
    logo: false,
    indicatorSize: 'large',
    messageFontSize: 24,
    message: '',
  };

  render() {
    const messageStyle = {
      color: this.props.color,
      fontSize: this.props.messageFontSize
    };
    return null;
    if (this.props.logo) {
      return (
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.visible}
          supportedOrientations={['portrait', 'landscape']}
          onOrientationChange={
            evt => this.setState({ currentOrientation: evt.nativeEvent.orientation })
          }
        >
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
          }}>
            <PLLoader position="center" />
          </View>
        </Modal>
      );
    } else {
      return (
        <Modal
          onRequestClose={() => this.close()}
          animationType={'fade'}
          transparent={true}
          visible={this.props.visible}
          supportedOrientations={['portrait', 'landscape']}
          onOrientationChange={
            evt => this.setState({ currentOrientation: evt.nativeEvent.orientation })
          }
        >
          <View style={[styles.container]}>
            <View style={[styles.innerContainer]}>
              <ActivityIndicator
                style={[styles.indicator]}
                size={this.props.indicatorSize}
                color={this.props.color}
              />
              <Text style={[styles.message, messageStyle]}>
                {this.props.message}
              </Text>
            </View>
          </View>
        </Modal>
      );
    }
  }
}

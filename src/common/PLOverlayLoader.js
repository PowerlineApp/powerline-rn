/**
 * @providesModule PLOverlayLoader
 */
import React, { Component } from 'react';
import {
  Modal,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform
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
        this.state = {
            blocked: false,
            visible: false
        };
    }

    // componentWillReceiveProps(nextProps){
    //     console.log('nextProps');
    //     if (!nextProps.visible){
    //         this.setState({blocked: true, visible: false}, () => {
    //             setTimeout(() => {
    //                 this.setState({blocked: false});
    //             }, 1000);
    //         });
    //     }

    //     if (nextProps.visible){
    //         if (this.state.blocked) return;
    //         this.setState({visible: true});
    //     }
    // }

  // static propTypes = {
  //   visible: React.PropTypes.bool,
  //   color: React.PropTypes.string,
  //   logo: React.PropTypes.bool,
  //   indicatorSize: React.PropTypes.oneOf(SIZES),
  //   messageFontSize: React.PropTypes.number,
  //   message: React.PropTypes.string
  // };

  // static defaultProps = {
  //   visible: false,
  //   color: 'white',
  //   logo: false,
  //   indicatorSize: 'large',
  //   messageFontSize: 24,
  //   message: '',
  // };

    render() {
        // console.log('pulse loader', this.props.visible, new Date());
        const messageStyle = {
            color: this.props.color,
            fontSize: this.props.messageFontSize
        };
        if (this.props.logo) {
            return (
                    Platform.OS === 'android'
                        ? <Modal
                            animationType={'fade'}
                            onRequestClose={() => this.close()}
                            transparent
                            visible={this.props.visible}
                            supportedOrientations={['portrait', 'landscape']}
                            onOrientationChange={
                            evt => this.setState({ currentOrientation: evt.nativeEvent.orientation })
                            }>
                            <View style={{
                                position: 'absolute',
                                flex: 1,
                                width: '100%',
                                height: 1000,
                                marginTop: -200,
                                overflow: 'visible',
                                zIndex: 2,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                flex: 1,
                            }}>
                                <PLLoader marginTop={this.props.marginTop} position='center' />
                            </View>
                        </Modal>
            :
            this.props.visible &&
                <View style={{
                    position: 'absolute',
                    flex: 1,
                    width: '100%',
                    height: 1000,
                    marginTop: -200,
                    overflow: 'visible',
                    zIndex: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    flex: 1,
                }}>
                    <PLLoader marginTop={this.props.marginTop} position='center' />
                </View>);
        } else {
            return (
                <Modal
                    onRequestClose={() => this.close()}
                    animationType={'fade'}
                    transparent
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

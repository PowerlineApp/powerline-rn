import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

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
            useNativeDriver: true
        })
		.start();
    }

    render() {
        const { size, pulseMaxSize, borderColor, backgroundColor, getStyle } = this.props;
        const maxTransform = pulseMaxSize / size;
        return (
            <View style={[styles.circleWrapper, {
                width: pulseMaxSize,
                height: pulseMaxSize,
                marginLeft: -pulseMaxSize/2,
                marginTop: -pulseMaxSize/2,
            }]}>
                <Animated.View
                    style={[{
                        borderColor,
                        backgroundColor,
                        // borderWidth: 2,
                        width: size,
                        height: size,
                        borderRadius: size/2,
                        transform: [
                          {scale: this.anim.interpolate({inputRange: [0,1], outputRange: [1, maxTransform]})}
                        ],
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
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: width/2,
        top: height/2,
    },
    circle: {
        borderWidth: 4 * StyleSheet.hairlineWidth,
    },
});
import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default class Pulse extends React.Component {
    constructor(props) {
        super(props);

        this.anim = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.loop(
            Animated.timing(this.anim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.in,
                useNativeDriver: true
            })
        )
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
                        backgroundColor: '#020860',
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
                <View style={{marginTop: -90}}>
                    {this.props.children}
                </View>
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
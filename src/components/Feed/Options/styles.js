import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    checkboxTitle: {
        flex: 1,
        paddingLeft: 20,
        height: '100%'
    },
    paymentButtonBorder: {
        marginVertical: 5,
        padding: 1,
        borderRadius: 10,
    },
    paymentButtonBackground: {
        borderRadius: 10
    },
    paymentButtonContainer: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentButtonSlider: {
        margin: 6,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        borderRadius: 5
    },
    paymentButtonIcon: {
        textShadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        textShadowRadius: 1,
    },
    paymentButtonText: {
        color: '#e9e9e9',
        fontSize: 18,
        marginLeft: 52,
    },
});
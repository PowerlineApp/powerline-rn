
const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const PLColors = require('../../common/PLColors');

export default {
    sidebar: {
        paddingTop: 30,
        flex: 1,
        backgroundColor: PLColors.main,
    },
    drawerCover: {
        alignSelf: 'stretch',
    // resizeMode: 'cover',
        height: deviceHeight / 3.5,
        width: null,
        position: 'relative',
        marginBottom: 10,
    },
    drawerImage: {
        position: 'absolute',
    // left: (Platform.OS === 'android') ? 30 : 40,
        left: (Platform.OS === 'android') ? deviceWidth / 10 : deviceWidth / 9,
    // top: (Platform.OS === 'android') ? 45 : 55,
        top: (Platform.OS === 'android') ? deviceHeight / 13 : deviceHeight / 12,
        width: 210,
        height: 75,
        resizeMode: 'cover',
    },
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    iconContainer: {
        width: 37,
        height: 37,
        borderRadius: 18,
        marginRight: 12,
        paddingTop: (Platform.OS === 'android') ? 7 : 5,
    },
    sidebarIcon: {
        fontSize: 21,
        color: '#fff',
        lineHeight: (Platform.OS === 'android') ? 21 : 25,
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    text: {
        fontWeight: (Platform.OS === 'ios') ? '500' : '400',
        fontSize: 16,
        marginLeft: 20,
        color: 'white',
    },
    badgeText: {
        fontSize: (Platform.OS === 'ios') ? 13 : 11,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: (Platform.OS === 'android') ? -3 : undefined,
    },

    background: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    prompt: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '20%',
        width: '80%',
        elevation: 2
    },
    promptTitle: {
        color: '#000',
        fontWeight: '500',
        alignSelf: 'flex-start',
        padding: 20,
        paddingBottom: 0,
        fontSize: 16
    },
    promptContent: {
        alignSelf: 'flex-start',
        paddingLeft: 20,
        paddingTop: 0,
        fontWeight: '400',
        fontSize: 14

    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        borderRadius: 0,
        backgroundColor: '#020860'
    },
    textInput: {
        padding: 20,
        width: '100%'
    }
};


const React = require('react-native');
const PLColors = require('../../../common/PLColors');
const { StyleSheet } = React;
const { Platform } = require('react-native');
const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#f5f9fc',
    },
    header: {
        backgroundColor: PLColors.main,
    },
    searchBar: {
        backgroundColor: '#030747',
        marginLeft: 15,
        paddingHorizontal: 10,
    },
    searchInput: {
        fontSize: 12,
        color: 'white',
    },
    titleText: {
        fontSize: 20,
        color: '#2e3f50',
        marginLeft: 10,
        fontWeight: '500',
    },
    buttonText: {
        fontSize: 12,
        color: PLColors.main,
        marginLeft: -7,
    },
    buttonIcon: {
        fontSize: 15,
        color: PLColors.main,
    },
    thumbnail: {
        borderWidth: 1,
        borderColor: PLColors.cellBorder,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: -3,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: PLColors.cellBorder,
    },
    icon: {
        color: 'black',
        fontSize: (platform === 'ios') ? 18 : 15,
    },
    cellText: {
        color: PLColors.cellText,
        fontWeight: '300',
        fontSize: 14,
    },
};

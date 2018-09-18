var PLColors = require('PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1
    },
    
    header: {
        backgroundColor: PLColors.main
    },

    searchBar: {
        backgroundColor: '#030747',
        paddingHorizontal: 10,
        marginLeft: 0,
        color: 'white'
    },

    searchInput: {
        fontSize: 14,
        color: 'white'
    },

    searchIcon: {
        color: 'white'
    },

    text1: {
        color: PLColors.main,
        fontSize: 16
    },

    listItem: {
        marginLeft: 0,
        paddingLeft: 17,
        paddingRight: 20,
        borderBottomWidth: 0.6
    },

    itemHeaderStyle: {
        backgroundColor: '#f1f7f9',
        paddingBottom: 12
    },

    itemHeaderText: {
        color: PLColors.lightText,
        fontSize: 15
    },

    joinBtn: {
        color: '#11c1f3',
        fontSize: 25
    }
}
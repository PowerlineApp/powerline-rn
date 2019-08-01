var PLColors = require('../../common/PLColors')
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1
    },

    backdrop: {
        backgroundColor: 'black',
        opacity: 0.5,
    },

    header: {
        backgroundColor: PLColors.main
    },

    tabsStyle: {
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
    }
}
var PLColors = require('PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1,
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

    tabStyle: {
        backgroundColor: PLColors.main
    }
};

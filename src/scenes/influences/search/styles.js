var PLColors = require('../../../common/PLColors');
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

    itemRightContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonContainer: {
        flexDirection: 'row'
    },

    activeIconLarge: {
        color: '#11c1f3',
        fontSize: 30,
        width: 18,
        marginRight: 0
    },

    activeIconSmall: {
        color: PLColors.lightText,
        fontSize: 10,
        width: 10,
        marginTop: 15,
        marginRight: 5
    },

}
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

    listItem: {
        backgroundColor: 'white',
        marginLeft: 0,
        paddingLeft: 17
    },

    avatar: {
        width: 80,
        height: 80
    },

    followBtn: {
        marginLeft: 12,
        marginTop: 10,
        backgroundColor: PLColors.main
    },
    activeIconLarge: {
        color: '#11c1f3',
        fontSize: 25,
        width: 15,
        marginRight: 0
    },

    activeIconSmall: {
        color: PLColors.lightText,
        fontSize: 8,
        width: 8,
        marginTop: 15,
        marginRight: 5
    },
    acceptIcon: {
        color: '#35cd60',
        fontSize: 25,
        width: 25,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 10
    },
    rejectIcon: {
        color: '#ef473a',
        fontSize: 25,
        width: 25,
        paddingLeft: 5,
        paddingRight: 5
    },
    followButtonContainer: {
        flexDirection: 'row'
    },
};
import PLColors from '../../../common/PLColors'
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1,
    },
    filterContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '50%'
    },
    filterContent: {
        backgroundColor: '#e2e7ea',
        width: '90%',
        alignItems: 'flex-start',
        shadowColor: 'black',
        shadowOpacity: 0.9,
        shadowOffset: {height: 2, width: 0},
        padding: 20
    },
    header: {
        backgroundColor: PLColors.main,
    },

    avatar: {
        width: 80,
        height: 80
    },

    unjoinBtn: {
        marginLeft: 12,
        marginTop: 10,
        backgroundColor: '#802000'
    },

    joinBtn: {
        marginLeft: 12,
        marginTop: 10,
        backgroundColor: PLColors.main
    },

    listItem: {
        backgroundColor: 'white',
        marginLeft: 0,
        paddingLeft: 17
    },

    groupDescription: {
        fontSize: 14,
        color: PLColors.lightText
    },

    listItemTextField: {
        color: PLColors.lightText,
        fontSize: 10
    },
    listItemValueField: {
        color: PLColors.main,
        fontSize: 16
    }
};

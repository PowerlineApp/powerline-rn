var PLColors = require('PLColors');
var { StyleSheet } = require('react-native');

export default {
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

    disableIconLarge: {
        color: PLColors.lightText,
        fontSize: 25,
        width: 15,
        marginRight: 0
    },
    disableIconSmall: {
        color: '#11c1f3',
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
    }
};
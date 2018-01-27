var PLColors = require('PLColors');
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
        backgroundColor: PLColors.main,
        justifyContent: 'space-between'
    },

    itemHeaderStyle: {
        backgroundColor: '#f1f7f9',
        paddingBottom: 12
    },

    itemHeaderText: {
        color: '#11c1f3',
        fontSize: 15
    },

    text1: {
        fontSize: 16,
        color: PLColors.main
    },

    listItem: {
        marginLeft: 0,
        paddingLeft: 17,
        borderBottomWidth: 0.6
    }
}
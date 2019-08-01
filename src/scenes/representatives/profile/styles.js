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

    text: {
        fontSize: 13,
        color: PLColors.main
    },

    text1: {
        fontSize: 10
    },

    icon: {
        color: PLColors.main
    }
}
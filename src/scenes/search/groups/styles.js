var PLColors = require('PLColors');
var { Platform } = require('react-native');
import {
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1
    },

    listItem: {
        marginLeft: 0,
        paddingLeft: 17,
        borderBottomWidth: 0.6
    },

    text1: {
        fontSize: 16,
        color: PLColors.main
    }
}
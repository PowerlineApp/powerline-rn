var PLColors = require('PLColors');
var { Platform } = require('react-native');
import {
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: 'white',
        flex: 1
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
    }
}
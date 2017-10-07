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
    }
}
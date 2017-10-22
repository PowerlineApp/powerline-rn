var PLColors = require('PLColors');
var { Platform } = require('react-native');
import {
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');

export default {
    textarea: {
        width: width - 20,
        height: (height - 234),
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
        zIndex: 5
    }
};

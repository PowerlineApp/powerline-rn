var PLColors = require('PLColors');
var { Platform } = require('react-native');
import {
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');

import variables from '../../../../native-base-theme/variables/platform';

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    
    header: {
        backgroundColor: PLColors.main
    },
    community_container:{
        borderBottomWidth: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginLeft: 0,
        backgroundColor: PLColors.main
    },

    avatar_container: {
        width: 67,
        height: 50,
        flexDirection: 'row'
    },

    avatar_wrapper: {
        width: 50,
        height: 50,
        backgroundColor: '#444477',
        alignItems: 'center',
        justifyContent: 'center'
    },

    avatar_img: {
        width: 30,
        height: 30
    },

    avatar_subfix: {
        borderLeftWidth: 16, 
        borderLeftColor: '#444477', 
        borderTopWidth: 25, 
        borderTopColor: 'transparent', borderBottomWidth: 25, borderBottomColor: 'transparent'
    },

    community_text_container: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    community_text: {
        fontSize: 14,
        color: '#fff'
    },

    communicty_icon_container: {
        paddingTop: 10, 
        paddingBottom: 10,
        flex: 0.1
    },

    main_content: {
        width: width, 
        height: height - 55 - variables.toolbarHeight,
        backgroundColor: '#fff',
        position: 'relative',
    },

    textarea: (definedHeight) => ({
        // flex: 1,
        // paddingTop: 70,
        // // height: 200,
        // marginTop: 0,
        // textAlignVertical: 'top',
        // width: width, 
        // // height: '100%',
        height: definedHeight,
        flex: 1,
        fontSize: 18, 
        color: 'rgba(0,0,0,0.6)',
        textAlignVertical:'top',
        zIndex: 5,
    }),

    deleteIconContainer: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                right: -4,
                top: -4,
                height: 22,    
            },
            android: {
                right: -1,
                top: -2,
                height: 24,
            }
        }),
        width: 22,
        borderRadius: 12,
        overflow: 'hidden',
        
    },
    deleteIcon: {
        fontSize: 25,
        ...Platform.select({
            ios: {  backgroundColor: '#e2e7ea' }
        }),
    }

}
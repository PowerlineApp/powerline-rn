var PLColors = require('PLColors');
var { Platform } = require('react-native');
import {
    Dimensions
} from 'react-native';
import variables from '../../../../native-base-theme/variables/platform';

const { width, height } = Dimensions.get('window');

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
        paddingBottom: 10
    },

    communicty_icon_container: {
        paddingTop: 10, 
        paddingBottom: 10
    },

    main_content: {
        width: width, 
        height: height - 55 - variables.toolbarHeight,
        position: 'relative'
    },

    textarea: {
        width: width, 
        height: (height - 185), 
        fontSize: 14, 
        color: 'rgba(0,0,0,0.6)', 
        zIndex: 5,
        marginTop: 0
    },

    community_list_container: {
        position: 'absolute',
        flex: 1,
        left: 0,
        top: 0,
        width: width,
        height: (height  - 185),
        zIndex: 10,
        paddingLeft: (width - 250)/ 2,
        paddingTop: 40,
    },

    community_list_back: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.4
    },

    input_text: {
        height: 44,
        width: (width - 20),
        color: 'black',
        margin: 0,
        backgroundColor: '#e2e7ea',
        fontSize: 14,
        paddingLeft: 12,
        paddingRight: 5,
        marginTop: 0
    },

    main_wrapper: {
        padding: 10,
        width: (width - 20),
        height: (height - 131)
    },


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
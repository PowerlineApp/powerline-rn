import PLColors from '../../../common/PLColors'
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
    input_text: {
        textAlignVertical: 'center',
        alignContent: 'center',
        alignItems: 'center',
        // textAlign: 'center',
        height: 44,
        margin: 16,
        flex: 1,
        color: 'black',
        margin: 0,
        backgroundColor: 'white',
        fontSize: 14,
        paddingLeft: 12,
        paddingRight: 5,
        marginTop: 0
    },
    deleteIconContainer: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                right: -2,
                top: -2,
                height: 22,    
            },
            android: {
                right: -2,
                top: -2,
                height: 24,
            }
        }),
        width: 22,
        borderRadius: 12,
        overflow: 'hidden',
    },
    deleteIconButtonContainer: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                right: -6,
                top: -6,
                height: 24,    
            },
            android: {
                right: -6,
                top: -6,
                height: 24,
            }
        }),
        width: 24,
        overflow: 'hidden',
        
    },
    deleteIcon: {
        fontSize: 20,
        backgroundColor: '#e2e7ea',
        borderRadius: 10
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
        paddingBottom: 10
    },

    main_content: {
        width: width, 
        height: (height - 185), 
        position: 'relative'
    },

    textarea: {
        paddingTop: 0,
        marginTop: 16,
        textAlignVertical: 'top',
        // width: width,
        height: height / 2 - 185,
        fontSize: 18, 
        color: 'rgba(0,0,0,0.6)',
        zIndex: 5,
    },
    wrappedTextarea: {
        marginTop: 8,
        padding: 8,
        textAlignVertical: 'top',
        // width: width,
        // flexWrap: 'wrap',
        height: 150,
        // paddingRight: 25,
        fontSize: 18,
        backgroundColor: '#fff',
        color: 'rgba(0,0,0,0.6)',
        zIndex: 5,
    },
    community_list_container: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: (height  - 185),
        zIndex: 10,
        paddingLeft: (width - 250)/ 2
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
    answerInput: {
        flex: 2,
        backgroundColor: '#fff',
        padding: 6,
        alignSelf: 'center',
        height: 35
    },

    /// answer component
    answerOptionContainer: {
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 35,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    answerMainContainer: {
        marginTop: 16,
        alignItems: 'center'
    },
    answersRemoveOptionIcon: {
        color: '#bbb',
        height: 25,
        width: 25
    },
    answersRemoveOptionButton: {
        flex: 1,
        alignSelf: 'center'
    },
    
    
    // event (date/time pickers) component
    eventMainContainer: {
        marginTop: 16
    },

    inputContainerWithSuffix: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    numericInput: {
        width: 70,
        padding: 4,
        height: '100%',
        overflow: 'visible',
        backgroundColor: '#fff',
    },
    suffix: {
        color: '#bbb'
    },
    suffixContainer: {
        width: 50,
        backgroundColor: '#fff',
        height: 35,
        textAlign: 'center',
        textAlignVertical: 'center',
        justifyContent: 'center',
        marginRight: 3
    },
    bottomPanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    allowUserAmountSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1
    },
    allowUserAmountTag: {
        color: '#aaa'
    },

    // crowdfunding
    crowdfundingSwitch: {
        marginTop: 6,
        marginBottom: 6,
        padding: 8,
        backgroundColor: '#fff',
        alignContent: 'flex-start'
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    crowdfundingGoal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    crowdfundingGoalInput: {
        width: 70,
        overflow: 'visible',
        backgroundColor: '#eee',
    },
    crowdFundingDeadLine: {
        marginTop: 20
    },
    crowdfundingDateTitle: {
        color: '#999'
    },
    crowdfundingDate: {
        fontWeight: '400', padding: 4
    },
    crowdfundingDateContainer: {
        backgroundColor: '#fff', marginTop: 8, padding: 8
    }
}
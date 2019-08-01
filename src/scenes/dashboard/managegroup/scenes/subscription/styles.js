import PLColors from '../../../../../common/PLColors';
import { StyleSheet, PixelRatio, Dimensions } from 'react-native';

import variables from '../../../../../../native-base-theme/variables/platform';

const { width } = Dimensions.get('window');

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1,
    },

    menuContextStyles: {
        menuContextWrapper: {
            backgroundColor: '#e2e7ea',
            flex: 1,
        },
        backdrop: {
            backgroundColor: 'black',
            opacity: 0.5,
        }
    },

    optionContainter: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: PLColors.lightText,
    },

    header: {
        backgroundColor: PLColors.main,
    },

    groupHeaderContainer: {
        backgroundColor: 'white',
        marginLeft: 0,
        paddingLeft: 17
    },

    avatar: {
        width: 80,
        height: 80
    },

    list: {
        marginLeft: 17,
        marginTop: 17,
        marginRight: 17,
        marginBottom: 17,
    },

    borderList: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: PLColors.lightText,
    },

    listItem: {
        backgroundColor: 'white',
        marginLeft: 0,
    },

    sectionText: {
        fontSize: 18,
        color: PLColors.darkGreyText,
    },

    contentItem: {
        backgroundColor: 'white',
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8,
        borderBottomWidth: (1 / PixelRatio.getPixelSizeForLayoutSize(1)),
        borderColor: '#c9c9c9',
    },

    dashLine: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#c9c9c9',
        borderStyle: 'dashed',
    },

    inputText: {
        color: PLColors.darkGreyText,
        fontSize: 18,
        fontWeight: '300'
    },

    inputContainer: {
        height: variables.inputHeightBase,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: PLColors.darkGreyText,
        borderStyle: 'dashed',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },

    popupText: {
        color: PLColors.darkGreyText,
        fontSize: 18,
        marginHorizontal: 6,
        fontWeight: '300',
    },

    popupIcon: {
        color: PLColors.blueArrow,
        marginRight: 6,
    },

    optionsContainer: {
        optionsContainer: {
            backgroundColor: '#fafafa',
            width
        }
    },

    menuText: { color: '#293f53' },

    submitButtonContainer: {
        backgroundColor: PLColors.main,
        marginTop: 20,
        marginBottom: 12
    },

    submitButtonText: { color: 'white' },

    membershipInputContainer: { marginTop: 8, flexDirection: 'row', backgroundColor: '#F2F2F2', justifyContent: 'center' },
    membershipDeleteIcon: { fontSize: 20, color: 'red' },
    membershipInput: { flex: 1, borderWidth: 0 },
    memebershipAddContainer: { marginTop: 8, flexDirection: 'row', justifyContent: 'center' },
    membershipAddIcon: { fontSize: 24, color: PLColors.main }
};

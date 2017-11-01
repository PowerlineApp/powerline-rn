let PLColors = require('PLColors');
let { StyleSheet, Dimensions, Platform } = require('react-native');

let { WINDOW_WIDTH: viewportWidth, WINDOW_HEIGHT: viewportHeight } = require('PLConstants');
let { width, height } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.3;
const slideWidth = (viewportWidth -  61 * 2);
const itemHorizontalMargin = wp(2);
const metaHeight = viewportHeight * 0.35;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default {
    container: {
        ...Platform.select({
            android: { marginBottom: -20 }
        })
    },
    title: {
        color: '#21354a',
        fontSize: 12,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#8694ab',
        fontSize: 10,
    },
    description: {
        color: '#21354a',
        fontSize: 12,
    },
    dropDownIcon: {
        color: PLColors.lightText,
        fontSize: 14,
        fontWeight: '100',
        paddingHorizontal: 5,
    },
    dropDownIconContainer: {
        width: 30,
        alignItems: 'flex-end',
    },
    zoneIcon: {
        fontSize: 15,
        color: '#5fc7fa',
    },
    commentCount: {
        fontSize: 12,
        color: '#8694ab',
    },
    footerIcon: {
        fontSize: 15,
        color: '#8694ab',
        marginRight: 5,
    },
    footerIconBlue: {
        fontSize: 15,
        color: '#53a8cd',
        marginRight: 5,
    },
    footerText: {
        fontSize: 11,
        color: '#8694ab',
        fontWeight: '500',
    },
    footerTextBlue: {
        fontSize: 11,
        color: '#53a8cd',
        fontWeight: '500',
    },
    footerButton: {
        marginHorizontal: 5,
    },
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainerEven: {
        backgroundColor: 'black'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    descLeftContainer: {
        width: 36,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    descBodyContainer: {
        alignSelf: 'flex-start',
    },
    metaContainer: {
        height: metaHeight,
        borderWidth: 1,
        borderColor: PLColors.cellBorder,
    },
    player: {
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'stretch',
        backgroundColor: 'black',
    },
    borderContainer: {
        height: 1,
        backgroundColor: PLColors.cellBorder,
    },
    menuIcon: {
        color: '#223549',
        width: 25,
    },
    menuText: {
        color: '#293f53',
    },

    CFooter: {
        backgroundColor: 'transparent',
        height: 55,
        marginBottom: 55
    },

    CFooterItem: {
        width: width,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        paddingLeft: 10
    },

    sendBtn: {
        height: 56,
        color: '#ccc'
    },

    CFooterItemInput: {
        paddingLeft: 15,
        fontSize: 20
    },
    CFooterItemInputDisabled: {
        paddingLeft: 15,
        fontSize: 20,
        color: '#ccc'
    },

    groupAvatarFull: {
        paddingBottom: 10
    },
    groupAvatarSmall: {
        paddingBottom: 10,
        marginRight: 10
    },

    groupName: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500'
    },

    groupFullHeaderContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    groupSmallHeaderContainer: {
        backgroundColor: '#fff',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },

    activityTime: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.4)',
        marginTop: 5
    }
}
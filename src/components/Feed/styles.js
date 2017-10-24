var PLColors = require('PLColors');
var { StyleSheet } = require('react-native');

const { WINDOW_WIDTH: viewportWidth, WINDOW_HEIGHT: viewportHeight } = require('PLConstants');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.3;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const metaHeight = viewportHeight * 0.35;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default {
    title: {
        color: '#21354a',
        fontSize: 12,
        fontWeight: 'bold'
    },
    subtitle: {
        color: '#8694ab',
        fontSize: 10
    },
    description: {
        color: '#21354a',
        fontSize: 12
    },
    dropDownIcon: {
        color: PLColors.lightText,
        fontSize: 14,
        fontWeight: '100',
        paddingHorizontal: 5
    },
    dropDownIconContainer: {
        width: 30,
        alignItems: 'flex-end'
    },
    zoneIcon: {
        fontSize: 15,
        color: '#5fc7fa'
    },
    commentCount: {
        fontSize: 12,
        color: '#8694ab'
    },
    footerIcon: {
        fontSize: 15,
        color: '#8694ab',
        marginRight: 5
    },
    footerIconBlue: {
        fontSize: 15,
        color: '#53a8cd',
        marginRight: 5
    },
    footerText: {
        fontSize: 11,
        color: '#8694ab',
        fontWeight: '500'
    },
    footerTextBlue: {
        fontSize: 11,
        color: '#53a8cd',
        fontWeight: '500'
    },
    footerButton: {
        marginHorizontal: 5
    },
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    imageContainerEven: {
        backgroundColor: 'black'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    descLeftContainer: {
        width: 36,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    descBodyContainer: {
        alignSelf: 'flex-start'
    },
    metaContainer: {
        height: metaHeight,
        borderWidth: 1,
        borderColor: PLColors.cellBorder
    },
    player: {
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'stretch',
        backgroundColor: 'black'
    },
    borderContainer: {
        height: 1,
        backgroundColor: PLColors.cellBorder
    },
    menuIcon: {
        color: '#223549',
        width: 25,
        height: 25,
    },
    menuText: {
        color: '#293f53'
    },
    url: {
        color: PLColors.main,
        fontWeight: '500'
    },
    username: {
        color: PLColors.main,
        fontWeight: '500'
    },
    hashtag: {
        color: PLColors.main,
        fontWeight: '500'
    },
    commentPreviewContainer: {
        backgroundColor: '#F8F8F8',
        minHeight: 64
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    activeIconLarge: {
        color: '#223549',
        fontSize: 25,
        width: 15,
        marginRight: 0
    },
    activeIconSmall: {
        color: PLColors.lightText,
        fontSize: 8,
        width: 8,
        marginTop: 15,
        marginRight: 12
    },
};

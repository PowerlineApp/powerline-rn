var PLColors = require('PLColors');
var { StyleSheet } = require('react-native');

const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('PLConstants');

export const MAX_HEIGHT = 170;
export const MIN_HEIGHT = 80;

export const optionsStyles = {
    optionsContainer: {
        backgroundColor: '#fafafa',
        paddingLeft: 5,
        width: WINDOW_WIDTH,
    },
};

function wp(percentage) {
    const value = (percentage * WINDOW_WIDTH) / 100;
    return Math.round(value);
}

const slideHeight = WINDOW_HEIGHT * 0.3;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const metaHeight = WINDOW_HEIGHT * 0.35;

export const sliderWidth = WINDOW_WIDTH;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default {
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backdrop: {
        backgroundColor: 'black',
        opacity: 0.5,
    },
    headerImage: {
        height: MAX_HEIGHT,
        width: WINDOW_WIDTH,
        alignSelf: 'stretch',
        resizeMode: 'cover',
        backgroundColor: 'gray',
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
    titleContainer: {
        flex: 1,
        alignSelf: 'stretch',
        paddingTop: 20,
    },
    imageTitle: {
        marginTop: 8,
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: 'bold',
    },
    navTitleView: {
        height: MIN_HEIGHT,
        paddingTop: 16,
        opacity: 0,
    },
    navTitle: {
        color: 'white',
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    thumbnail: {
        borderWidth: 1,
        borderColor: PLColors.cellBorder,
    },
    dropDownIcon: {
        color: PLColors.lightText,
        fontSize: 14,
        fontWeight: '100',
        paddingHorizontal: 5,
    },
    menuIcon: {
        color: '#223549',
        width: 25,
    },
    menuText: {
        color: '#293f53',
    },
    descLeftContainer: {
        width: 36,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    descBodyContainer: {
        alignSelf: 'flex-start',
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
    borderAllRepliesContainer: {
        height: 1,
        backgroundColor: PLColors.cellBorder,
        marginHorizontal: 20,
    },
    addCommentTitle: {
        color: '#8694ab',
        fontSize: 12,
        fontWeight: '100',
    },
    commentMoreIcon: {
        color: PLColors.lightText,
        fontSize: 24,
        paddingHorizontal: 5,
    },
    commentFooterContainer: {
        alignSelf: 'flex-start',
        width: 120,
        height: 25,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: -13,
        marginTop: -5,
    },
    allRepliesButtonText: {
        fontSize: 15,
        color: '#8694ab',
        fontWeight: '500',
    },
    commentInput: {
        fontSize: 12,
        fontWeight: '100',
        flex: 1,
    },
    commentSendText: {
        fontSize: 12,
        alignSelf: 'center',
        color: PLColors.main,
        fontWeight: 'bold',
    },
    commentSendIcon: {
        fontSize: 12,
        alignSelf: 'flex-end',
        marginLeft: 5,
        color: PLColors.main,
    },
    textarea: {
        color: '#21354a',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#8694ab'
    },
    editIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    editIcon: {
        fontSize: 26,
        marginRight: 10,
        color: PLColors.main
    },
    attachedImage: {
        height: WINDOW_HEIGHT*0.35,
        borderWidth: 1,
        borderColor: PLColors.cellBorder,
    }
}
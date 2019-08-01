import PLColors from '../../../common/PLColors'
var { StyleSheet } = require('react-native');

const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('../../../common/PLConstants');

export const MAX_HEIGHT = 170;
export const MIN_HEIGHT = 80;

export const optionsStyles = {
    optionsContainer: {
        backgroundColor: '#55c5ff',
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    rootTitle: {
        color: '#21354a',
        fontSize: 15,
        fontWeight: '900',
    },
    childTitle: {
        color: '#21354a',
        fontSize: 15,
        fontWeight: '200',
    },
    subtitle: {
        color: '#8694ab',
        fontSize: 10,
    },
    description: {
        color: '#21354a',
        fontSize: 16,
    },
    rootDescription: {
        color: '#21354a',
        fontSize: 13,
    },
    childDescription: {
        color: '#21354a',
        fontSize: 13,
    },
    descriptionTitle: {
        color: '#21354a',
        fontSize: 16,
        fontWeight: '500'        
    },
    commentTitle: {
        color: '#21354a',
        fontSize: 15,
        fontWeight: 'bold'
    },
    commentPreviewText: {
        color: '#21354a',
        fontSize: 14,
    },
    commentAddField: {
        paddingLeft: 5,
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
        alignSelf: 'flex-start',
        paddingLeft: 2,
    },
    descBodyContainer: {
        alignSelf: 'flex-start',
        marginLeft: -1,
        paddingLeft: 0,
        marginTop: -1,
        paddingTop: 0,
    },
    zoneIcon: {
        fontSize: 17,
        color: '#ED1727',
        //paddingTop: 1,
    },
    commentCount: {
        fontSize: 14,
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
        fontSize: 14,
        color: '#8694ab',
        fontWeight: '500',
    },
    footerTextBlue: {
        fontSize: 14,
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
        height: 2,
        width: '100%',
        backgroundColor: PLColors.cellBorder
    },
    borderAllRepliesContainer: {
        height: 1,
        backgroundColor: PLColors.cellBorder,
        marginHorizontal: 20,
    },
    addCommentTitle: {
        color: '#8694ab',
        fontSize: 14,
        fontWeight: '100',
    },
    commentMoreIcon: {
        color: PLColors.lightText,
        fontSize: 20,
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
        backgroundColor: '#fff',
        // height: 20,
        padding: 0,
        margin: 0,
        flex: 1
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
    },
    commentRootContainer: {
        width: 36, // ??
        alignSelf: 'flex-start',
        paddingLeft: 2
    },
    commentChildContainer: {
        //ignore
    },
}
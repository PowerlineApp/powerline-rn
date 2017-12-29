//Evidently this file controls the styles for the newsfeeds...JC
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

//
const optionStyles = {
    optionTouchable: {
        underlayColor: 'red',
        activeOpacity: 40,
    },
    optionWrapper: {
        backgroundColor: 'pink',
        margin: 5,
    },
    optionText: {
        color: 'black',
    },
};
//

export default {
    // this contains the whole thing
    container: {
        backgroundColor: '#fff',
    },
    // this is the author name
    title: {
        color: '#21354a',
        fontSize: 16,
        fontWeight: 'bold'
    },

    commentTitle: {
        color: '#21354a',
        fontSize: 14,
        fontWeight: 'bold'
    },
    commentPreviewText: {
        color: '#21354a',
        fontSize: 14
    },
    subtitle: {
        color: '#8694ab',
        fontSize: 12,
    },
    // this is the main content of post/petition/etc
    description: {
        color: '#21354a',
        fontSize: 16
    },
    // this is the title of post/peititon/etc
    descriptionTitle: {
        color: '#21354a',
        fontSize: 16,
        fontWeight: '500'        
    },
    dropDownIcon: {
        color: PLColors.lightText,
        fontSize: 20,
        fontWeight: '100',
        paddingHorizontal: 5
    },
    dropDownIconContainer: {
        width: 30,
        alignItems: 'flex-end'
    },
    zoneIcon: {
        fontSize: 17,
        color: '#ED1727'
    },
    commentCount: {
        fontSize: 14,
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
        fontSize: 14,
        color: '#8694ab',
        fontWeight: '500'
    },
    footerTextBlue: {
        fontSize: 14,
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
        alignSelf: 'flex-start',
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
    upvotersIcon: {
        width: 25,
        height: 25,
        marginLeft: -2,
        marginRight: 12
    },
    img: {
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
        minHeight: 45,
        paddingLeft: 5
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
    attachedImage: {
        width: 80,
        marginRight: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'flex-start'
    }
};

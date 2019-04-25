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
        flexDirection: 'column',
        padding: 8,
        paddingBottom: 45,
        marginBottom: 0,
        elevation: 2
        // sha
        // width: '100%',
        // marginHorizontal: 80,
        // marginBottom: 40
    },
    // this is the author name
    title: {
        color: '#21354a',
        fontSize: 19,
        fontWeight: 'bold'
    },

    commentTitle: {
        color: '#21354a',
        fontSize: 15,
        fontWeight: 'bold'
    },
    commentPreviewText: {
        color: '#21354a',
        fontSize: 15
    },
    subtitle: {
        color: '#8694ab',
        fontSize: 14,
    },
    // this is the main content of post/petition/etc
    description: {
        color: '#21354a',
        fontSize: 19
    },
    // this is the title of post/peititon/etc
    descriptionTitle: {
        color: '#21354a',
        fontSize: 19,
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
        fontSize: 20,
        // color: '#f0e',
        color: '#ff1727'
        // position: 'absolute',
        // zIndex: 5,
        // alignSelf: 'center',
        // bottom: -14
    },
    commentCount: {
        fontSize: 14,
        color: '#8694ab'
    },
    footerIcon: {
        fontSize: 20,
        color: '#8694ab',
        marginRight: 5
    },
    footerIconBlue: {
        fontSize: 15,
        color: '#53a8cd',
        // marginRight: 5
    },
    footerText: {
        fontSize: 13,
        color: '#8694ab',
        fontWeight: '500',
        // backgroundColor: '#00c',
        margin: 0
    },
    commentText: {
        fontSize: 15,
        color: '#8694ab',
        alignSelf: 'flex-end',
        fontWeight: '500'
    },
    footerTextBlue: {
        fontSize: 15,
        color: '#53a8cd',
        fontWeight: '500'
    },
    footerButton: {
        // marginHorizontal: 5,
        // backgroundColor: '#c00',
        margin: 0,
        padding: 0
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
        minHeight: 50,
        alignItems: 'center',
        // justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1,
        width: '100%'
    },
    metaContainer: {
        // backgroundColor: '#f0f',
        // padding: 20,
        width: '100%',
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
        height: 2,
        width: '100%',
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
        paddingLeft: 5,
        padding: 0,
        marginHorizontal: 2,
        elevation: 3,
        marginBottom: 8
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
        paddingBottom: 6,
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'flex-end'
    }
};


const React = require('react-native');
const PLColors = require('PLColors');
const { StyleSheet } = React;
const { Platform } = require('react-native');
const platform = Platform.OS;

export default {
    container: {
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: PLColors.main,
    },
    rootContainer: {
        backgroundColor: '#f5f9fc',
        paddingLeft: 5,
    },
    backdrop: {
        backgroundColor: 'black',
        opacity: 0.5,
    },
    title: {
        color: '#21354a',
        fontSize: 12,
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
        fontSize: 14,
    },
    rootDescription: {
        color: '#21354a',
        fontSize: 13,
    },
    childDescription: {
        color: '#21354a',
        fontSize: 13,
    },
    childCommentContainer: {
        paddingBottom: 0, 
        marginLeft: 20, 
        marginTop: 5, 
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
        fontSize: 17,
        color: '#ED1727',
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
        fontSize: 10,
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
        backgroundColor: '#fff',
        margin: 0,
        padding: 0,
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
};

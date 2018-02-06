var PLColors = require('PLColors');
var { Platform } = require('react-native');

const platform = Platform.OS;

export default {
    container: {
        backgroundColor: '#e2e7ea',
        flex: 1,
    },
    header: {
        backgroundColor: PLColors.main,
    },

    formContainer: {
        marginTop: 10
    },

    itemContainer: {
        marginTop: 5,
        height: 44,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: PLColors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },

    inputText: {
        paddingVertical: 0,
        height: 44,
        fontSize: 14,
        color: PLColors.lightText
    },

    formItem: {
        borderWidth: 1,
        borderColor: 'red'//PLColors.textInputBorder
    },
    termsContainner: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    termsText: {
        color: PLColors.lightText,
        fontSize: 9,
        backgroundColor: 'transparent'
    },
    termsUnderlineText: {
        color: PLColors.lightText,
        fontSize: 9,
        textDecorationLine: 'underline',
        backgroundColor: 'transparent'
    },
};

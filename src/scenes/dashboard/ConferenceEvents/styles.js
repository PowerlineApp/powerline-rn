import ScaleSheet from 'react-native-scalesheet'
import Theme from '../../../configs/theme'
import commonColor from "../../../configs/commonColor";

export default ScaleSheet.create({
    container: {
        ...Theme.pageContainer,
        marginBottom: 0,
        backgroundColor: 'white'
    },
    header: {
        height: 50,
        backgroundColor: Theme.main,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    headerLabel: {
        color: 'white',
        fontSize: 18,
        flex: 1,
        textAlign: 'center'
    },
    btnLabel: {
        color: 'white'
    },
    item: {
        marginTop: 10,
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: '#C6C6C6',
        borderBottomWidth: 2,
        borderBottomColor: '#C6C6C6',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    location: {
        fontSize: 13,
        color: '#444'
    },
    label: {
        fontSize: 14,
        marginTop: 10
    },
    times: {
        marginTop: 20,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    iosHeader: {
        backgroundColor: '#fff'
    },
    aHeader: {
        backgroundColor: '#fff',
        borderColor: '#aaa',
        elevation: 3
    },
    iosHeaderTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: commonColor.brandPrimary
    },
    aHeaderTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 26,
        marginTop: -5,
        color: commonColor.brandPrimary
    }
})

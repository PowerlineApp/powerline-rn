import ScaleSheet from 'react-native-scalesheet'
import Theme from '../../../configs/theme'
import commonColor from "../../../configs/commonColor";

export default ScaleSheet.create({
    container: {
        ...Theme.pageContainer,
        marginBottom: 0,
        backgroundColor: 'white'
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

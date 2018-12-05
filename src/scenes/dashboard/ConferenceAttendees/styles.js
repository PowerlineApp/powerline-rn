import ScaleSheet from 'react-native-scalesheet'
import Theme from '../../../configs/theme'

export default ScaleSheet.create({
    container: {
        ...Theme.pageContainer,
        marginBottom: 0,
        backgroundColor: 'white'
    }
})

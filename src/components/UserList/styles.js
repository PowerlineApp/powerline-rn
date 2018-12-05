import ScaleSheet from 'react-native-scalesheet'
import Theme from '../../configs/theme'

const actionButton = {
    paddingHorizontal: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2
}

export default ScaleSheet.create({
    container: {
        ...Theme.pageContainer,
        marginBottom: 0,
        backgroundColor: 'white'
    },
    item: {
        height: 60,
        width: '100vw',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    actionButtonContainer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    avatarContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        color: 'black',
        fontSize: 15
    },
    subText: {
        color: '#444',
        fontSize: 13
    },
    actionButton: {
        ...actionButton,
        backgroundColor: Theme.main
    },
    actionButtonRed: {
        ...actionButton,
        backgroundColor: 'rgb(128, 34, 0)'
    },
    actionButtonLabel: {
        color: 'white'
    }
})

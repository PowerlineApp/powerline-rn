import ScaleSheet from 'react-native-scalesheet'

export default ScaleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 0
    },
    header: {
        width: '100vw',
        height: '40vh'
    },
    wrapper: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: '1vh'
    },
    item: {
        width: '30%',
        height: '14vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: '3%'
    },
    iconContainer: {
        width: '7.5vh',
        height: '7.5vh',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '7.5vh',
        height: '7.5vh',
        resizeMode: 'cover',
    },
    label: {
        textAlign: 'center',
        color: '#333',
        marginTop: 10,
        fontSize: 16
    }
})

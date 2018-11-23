import ScaleSheet from 'react-native-scalesheet'

export default ScaleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2E7EA',
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
        borderRadius: '3.75vh',
        backgroundColor: '#61C1FF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        textAlign: 'center',
        color: '#333',
        marginTop: 10,
        fontSize: 16
    }
})

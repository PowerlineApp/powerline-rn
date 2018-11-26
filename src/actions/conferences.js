import _ from 'lodash'
import { AsyncStorage } from 'react-native'
import { redux, privateAPI } from '../instances'
import { to } from '../utils'

export const fetchConferences = async () => {
    const getConferences = await to(
        privateAPI.get('/v2.2/conferences'),
        'conferences'
    )

    console.warn('conferences:', getConferences)

    var conferences = getConferences.conferences
    if (!getConferences.success) {
        var cache = await AsyncStorage.getItem('@app:cache:state:conferences')
        conferences = JSON.parse(cache || '[]')
    }

    AsyncStorage.setItem(`@app:cache:state:conferences`, JSON.stringify(conferences))

    conferences = _.mapKeys(conferences, (val, key) => val.id)

    redux.store.dispatch({
        type: 'CONFERENCES_STATE',
        payload: conferences
    })

    if (Object.values(conferences).length > 0) {
        const conference = Object.values(conferences)[0]
        const getAttendees = await to(
            privateAPI.get('/v2.2/conferences/' + conference.id + '/attendees'),
            'attendees'
        )
        var attendees = getAttendees.attendees
        if (!getAttendees.success) {
            cache = await AsyncStorage.getItem('@app:cache:state:attendees')
            attendees = JSON.parse(cache || '[]')
        }

        AsyncStorage.setItem(`@app:cache:state:attendees`, JSON.stringify(attendees))

        redux.store.dispatch({
            type: 'SET_ATTENDEES_STATE',
            payload: attendees
        })

        const getEvents = await to(
            privateAPI.get('/v2.2/conferences/' + conference.id + '/events'),
            'events'
        )

        console.warn('Events:', getEvents)

        var events = getEvents.events
        if (!getEvents.success) {
            cache = await AsyncStorage.getItem('@app:cache:state:events')
            events = JSON.parse(cache || '[]')
        }

        AsyncStorage.setItem(`@app:cache:state:events`, JSON.stringify(events))

        redux.store.dispatch({
            type: 'SET_SCHEDULE_STATE',
            payload: events
        })
    }

    return getConferences
}

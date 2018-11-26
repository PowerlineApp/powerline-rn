import _ from 'lodash'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'

export const fetch = async (id = null) => {
    if (!id) {
        const result = await to(privateAPI.get('/v2/user'), 'profile')
        if (!result.success) return result

        redux.store.dispatch({
            type: 'SET_USER_STATE',
            payload: result.profile
        })

        return result
    }
}

export const fetchRepresentatives = async () => {
    const getReps = await to(privateAPI.get('/v2/representatives'))
    if (!getReps.success) return getReps

    var { data } = getReps
    var reps = Object.values(data)

    reps.forEach(async (section, index, parentArr) => {
        var newSection = { title: section.title, data: [] }
        await section.representatives.forEach(async rep => {
            var newRep = _.merge({}, rep)

            var url = '/representatives/info'
            if (rep.storageId) url += `/0/${rep.id}`
            else url += `/${rep.storageId}`

            const getInfo = await to(privateAPI.get(url))

            if (getInfo.success) {
                newRep.info = getInfo.data
            }

            newSection.data.push(newRep)
        })
        parentArr[index] = newSection
    })

    redux.store.dispatch({
        type: 'SET_REPRESENTATIVELIST_STATE',
        payload: reps
    })

    return getReps
}

export const fetchBlocked = async () => {
    const id = redux.store.getState().user.id
    const result = await to(privateAPI.get('/v2.2/user/blocked-users'))
    if (!result.success) {
        return result
    }

    const users = Object.values(result.data)
    const map = {}
    users.forEach(user => {
        map[user.id] = user
    })

    redux.store.dispatch({
        type: 'BLOCKEDUSERS_STATE',
        payload: map
    })

    return result
}

export const search = async (queryText, page = 1, maxCount = 20) => {
    const result = await to(
        privateAPI.get('/users', {
            unfollowing: 1,
            page,
            q: queryText,
            maxCount
        })
    )

    if (!result.success) return result
    redux.store.dispatch({
        type: 'SET_SEARCH_STATE',
        payload: Object.values(result.data),
        childKey: 'people'
    })

    return result
}

export const fetchPrivacySettings = async () => {
    const result = await to(privateAPI.get('/v2.2/user/privacy_settings'))
    if (!result.success) return result

    redux.store.dispatch({
        type: 'SET_PRIVACYSETTINGS_STATE',
        payload: result.data
    })

    return result
}

export const updatePrivacySettings = async data => {
    const result = await to(privateAPI.put('/v2.2/user/privacy_settings', data))
    if (!result.success) return result

    redux.store.dispatch({
        type: 'PRIVACYSETTINGS_STATE',
        payload: data
    })

    return result
}

export const updateProfileSettings = async data => {
    const result = await to(privateAPI.post('/profile/update', data))
    if (!result.success) return result

    redux.store.dispatch({
        type: 'USER_STATE',
        payload: data
    })

    return result
}

export const fetchCards = async () => {
    const result = await to(privateAPI.get('/v2/cards'))
    if (!result.success) return result

    redux.store.dispatch({
        type: 'SET_CARDS_STATE',
        payload: result.data
    })

    return result
}

export const addCreditCard = async () => {}

export const removeCreditCard = async () => {}

export const block = async user => {
    const result = await to(privateAPI.put('/v2.2/user/blocked-users/' + user.id))
    if (!result.success) return result

    redux.store.dispatch({
        type: 'BLOCKEDUSERS_STATE',
        payload: { [user.id]: user }
    })

    return result
}

export const unblock = async id => {
    const result = await to(privateAPI.delete('/v2.2/user/blocked-users/' + id))
    if (!result.success) return result

    redux.store.dispatch({
        type: 'BLOCKEDUSERS_STATE',
        payload: { [id]: false }
    })

    return result
}

import _ from 'lodash'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'

export const fetch = async (group = 'all', cursor = 0) => {
    var result = await to(privateAPI.get('/v2.2/user/groups'), 'groups')
    if (!result.success) return result

    var useLabelForKey = ['local', 'state', 'country']

    var groups = _.mapKeys(result.groups, (val, key) => {
        if (useLabelForKey.includes(val.groupType)) {
            return val.groupType
        }

        return val.id
    })

    // Manually add the "personal" group for display on user profile.
    groups['personal'] = {}
    groups['all'] = { userRole: 'member' }

    redux.store.dispatch({
        type: 'USERGROUPS_STATE',
        payload: groups
    })

    return { ...result, groups }
}

export const search = async queryText => {
    const result = await to(
        privateAPI.get('/v2/groups', {
            query: queryText
        })
    )

    if (!result.success) return result

    redux.store.dispatch({
        type: 'SET_SEARCH_STATE',
        payload: Object.values(result.data.payload),
        childKey: 'groups'
    })

    return result
}

export const create = async data => {
    const { name, type, description, acronym } = data
    const { user } = redux.store.getState()
    const groupInformation = {
        managerFirstName: user.firstName,
        managerLastName: user.lastName,
        managerEmail: user.email || '',
        managerPhone: user.phone || '',
        officialName: name || '',
        officialType: type || '',
        officialDescription: description || '',
        acronym: acronym || ''
    }

    const result = await to(
        privateAPI.post('/v2/user/groups', {
            ...groupInformation
        })
    )

    if (!result.success) return result

    // TODO: Add group to stuff...

    return result
}

export const join = async id => {
    const result = await to(privateAPI.put('/v2/user/groups/' + id, {}), 'group')
    if (!result.success) return result
    const { group } = result

    redux.store.dispatch({
        type: 'USERGROUPS_STATE',
        payload: { [group.id]: _.merge({}, group, { userRole: 'member' }) }
    })

    return result
}

export const leave = async id => {
    const result = await to(privateAPI.delete('/v2/user/groups/' + id, {}), 'group')
    if (!result.success) return result

    const group = redux.store.getState().userGroups[id]

    redux.store.dispatch({
        type: 'USERGROUPS_STATE',
        payload: { [group.id]: _.merge({}, group, { userRole: '' }) }
    })

    return result
}

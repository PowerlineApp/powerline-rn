import _ from 'lodash'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'

export const fetch = async (group = 'all', alias = null, cursor = 0) => {
    var params = { cursor }
    if (group !== 'all') params.group = group
    if (group === 'personal') {
        delete params.group
        params.user = redux.store.getState().user.id
    }

    var result = await to(privateAPI.get('/v2.2/feed', params), 'posts')
    if (!result.success) return result

    var posts = _.mapKeys(result.posts, (val, key) => val.id)

    var map = Object.keys(posts) || []

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts,
            [alias || group]: map
        }
    })

    return result
}

export const refetch = async (group = 'all', alias = null) => {
    var params = {}
    if (group !== 'all') params.group = group
    if (group === 'personal') {
        delete params.group
        params.user = redux.store.getState().user.id
    }

    var result = await to(privateAPI.get('/v2.2/feed', params), 'posts')
    if (!result.success) return result

    var posts = _.mapKeys(result.posts, (val, key) => val.id)

    var map = Object.keys(posts)

    const prevState = redux.store.getState().newsFeed
    const newState = _.merge({}, prevState, { posts })
    newState[alias || group] = map

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: newState
    })

    return result
}

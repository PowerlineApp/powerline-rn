import _ from 'lodash'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'

export const fetchFollowers = async (page = 1, perPage = 20) => {
    const result = await to(
        privateAPI.get('/v2/user/followers', {
            page,
            perPage
        })
    )

    if (!result.success) return result

    redux.store.dispatch({
        type: 'SET_INFLUENCES_STATE',
        payload: Object.values(result.data.payload),
        childKey: 'followers'
    })

    return result
}

export const fetchFollowings = async (page = 1, perPage = 20) => {
    const result = await to(
        privateAPI.get('/v2/user/followings', {
            page,
            perPage
        })
    )

    if (!result.success) return result

    redux.store.dispatch({
        type: 'SET_INFLUENCES_STATE',
        payload: Object.values(result.data.payload),
        childKey: 'followings'
    })

    return result
}

export const declineFollower = async id => {
    const url = `/v2/user/followers/${id}`
    const result = await to(privateAPI.delete(url))
    if (!result.success) return success

    var followers = redux.store
        .getState()
        .influences.followers.slice(0)
        .filter(f => f.id !== id)

    redux.store.dispatch({
        type: 'SET_INFLUENCES_STATE',
        payload: followers,
        childKey: 'followers'
    })

    return success
}

export const approveFollower = async id => {
    const url = `/v2/user/followers/${id}`
    const result = await to(privateAPI.delete(url))
    if (!result.success) return success

    var followers = redux.store.getState().influences.followers.slice(0)

    for (var i = 0; i < followers.length; i++) {
        var follower = followers[i]
        if (follower.id == id) {
            follower.status = 'active'
            followers[i] = follower
        }
    }

    redux.store.dispatch({
        type: 'SET_INFLUENCES_STATE',
        payload: followers,
        childKey: 'followers'
    })

    return result
}

export const unfollow = async id => {
    const url = `v2/user/followings/${id}`
    const result = await to(privateAPI.delete(url))
    if (!result.success) return success

    var followings = redux.store
        .getState()
        .influences.followings.slice(0)
        .filter(f => f.id !== id)

    redux.store.dispatch({
        type: 'SET_INFLUENCES_STATE',
        payload: followings,
        childKey: 'followings'
    })

    return result
}

export const follow = async id => {
    const url = `/v2/user/followings/${id}`
    const result = await to(privateAPI.delete(url))
    if (!result.success) return success

    var followings = redux.store.getState().influences.followings.slice(0)

    for (var i = 0; i < followings.length; i++) {
        var following = followings[i]
        if (follower.id == id) {
            following.status = 'active'
            followings[i] = following
        }
    }

    redux.store.dispatch({
        type: 'SET_INFLUENCES_STATE',
        payload: followings,
        childKey: 'followings'
    })

    return result
}

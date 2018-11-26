import _ from 'lodash'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'

export const vote = async (post, upvote, replace = false) => {
    let result = await to(
        privateAPI.post(`/v2/posts/${post.id}/vote`, {
            option: upvote ? 'upvote' : 'downvote'
        }),
        'response'
    )

    if (!result.success) return result

    const counter = upvote ? 'upvotesCount' : 'downvotesCount'

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: {
                [post.id]: {
                    [counter]: Number(post[counter]) + (replace ? 0 : 1),
                    vote: { option: upvote ? 'upvote' : 'downvote' }
                }
            }
        }
    })

    return { success: true }
}

export const removeVote = async post => {
    let result = await to(privateAPI.delete(`/v2/posts/${post.id}/vote`), 'response')
    if (!result.success) return result

    const counter = post.vote.option == 'upvote' ? 'upvotesCount' : 'downvotesCount'

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: {
                [post.id]: {
                    [counter]: Number(post[counter]) - 1,
                    vote: { option: null }
                }
            }
        }
    })

    return { success: true }
}

export const applyPetitionSignature = async (petition, erase = false) => {
    let result = await to(
        privateAPI.post(`/v2/user-petitions/${petition.id}/sign`),
        'signature'
    )
    if (!result.success) return result

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: { [petition.id]: { signature: true } }
        }
    })

    return { success: true }
}

export const removePetitionSignature = async petition => {
    let result = await to(
        privateAPI.delete(`/v2/user-petitions/${petition.id}/sign`),
        'petition'
    )
    if (!result.success) return result

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: { [petition.id]: { signature: null } }
        }
    })

    return { success: true }
}

export const fetchAnalytics = async (id, type) => {
    var url = `/v2/posts/${id}/analytics`
    const result = await to(privateAPI.get(url))
    if (!result.success) return result

    redux.store.dispatch({
        type: 'POSTANALYTICS_STATE',
        payload: result.data
    })

    return result
}

export const submitPost = async (id, body, image = false) => {
    // Get the group id for groups stored by label.
    var groupId = redux.store.getState().userGroups[id].id

    var url = `/v2.2/groups/${groupId}/posts`
    const result = await to(
        privateAPI.post(url, {
            body,
            image
        })
    )

    if (!result.success) return result

    const post = result.data
    let x = Object.values(redux.store.getState().newsFeed[id])
    if (!Array.isArray(x)) x = []
    x.push(post.id)

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: {
                [post.id]: post
            },
            [id]: x
        }
    })

    return result
}

export const submitPetition = async (id, title, body, image = null) => {
    // Get the group id for groups stored by label.
    var groupId = redux.store.getState().userGroups[id].id

    var url = `/v2.2/groups/${groupId}/user-petitions`
    const result = await to(
        privateAPI.post(url, {
            body,
            title,
            image
        })
    )

    if (!result.success) return result

    const post = result.data

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: {
                [post.id]: post
            },
            [id]: (redux.store.getState().newsFeed[id] || []).slice(0).push(post)
        }
    })

    return result
}

export const submitPoll = async (id, question, answers) => {
    // Get the group id for groups stored by label.
    var groupId = redux.store.getState().userGroups[id].id

    var url = `/v2.2/groups/${groupId}/polls`
    const result = await to(
        privateAPI.post(url, {
            subject: question,
            type: 'group',
            options: answers
        })
    )

    if (!result.success) return result

    const post = result.data

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: {
                [post.id]: post
            },
            [id]: (redux.store.getState().newsFeed[id] || []).slice(0).push(post)
        }
    })

    return result
}

export const submitDiscussion = async (id, subject) => {
    // Get the group id for groups stored by label.
    var groupId = redux.store.getState().userGroups[id].id

    var url = `/v2.2/groups/${groupId}/polls`
    const result = await to(
        privateAPI.post(url, {
            subject,
            type: 'news'
        })
    )

    if (!result.success) return result

    const post = result.data

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: {
                [post.id]: post
            },
            [id]: (redux.store.getState().newsFeed[id] || []).slice(0).push(post)
        }
    })

    return result
}

export const submitEvent = async (
    id,
    title,
    subject,
    startedAt,
    finishedAt,
    options
) => {
    // Get the group id for groups stored by label.
    var groupId = redux.store.getState().userGroups[id].id

    startedAt = new Date(startedAt).toISOString()
    finishedAt = new Date(finishedAt).toISOString()

    var url = `/v2.2/groups/${groupId}/polls`
    const result = await to(
        privateAPI.post(url, {
            title,
            subject,
            startedAt,
            finishedAt,
            options,
            type: 'event'
        })
    )

    if (!result.success) return result

    const post = result.data

    redux.store.dispatch({
        type: 'NEWSFEED_STATE',
        payload: {
            posts: {
                [post.id]: post
            },
            [id]: (redux.store.getState().newsFeed[id] || []).slice(0).push(post)
        }
    })

    return result
}

export const fetch = async id => {
    const url = `/v2.2/posts/${id}`
    const result = await to(privateAPI.get(url))
    if (!result.success) return result

    return result
}

export const search = async queryText => {
    const result = await to(
        privateAPI.get('/v2/activities', {
            hashTag: queryText
        })
    )

    if (!result.success) return result

    redux.store.dispatch({
        type: 'SET_SEARCH_STATE',
        payload: Object.values(result.data.payload),
        childKey: 'hashTags'
    })

    return result
}

export const fetchComments = async post => {
    var url
    switch (post.type) {
        case 'poll':
            url = `/v2/polls/${post.id}/comments`
            break
        case 'post':
            url = `/v2.2/posts/${post.id}/comments`
            break
        case 'user-petition':
            url = `/v2/user-petitions/${post.id}/comments`
            break
    }

    if (!url) return
    return await to(privateAPI.get(url))
}

export const deleteComment = async post => {
    var url = `/v2.2/${post.type}-comments/${post.id}`

    if (!url) return
    return await to(privateAPI.delete(url))
}

export const editComment = async (post, commentBody) => {
    var url = `/v2.2/${post.type}-comments/${post.id}`

    if (!url) return
    return await to(privateAPI.put(url, { commentBody }))
}

export const createComment = async (post, commentBody, parentComment) => {
    var url
    switch (post.type) {
        case 'poll':
            url = `/v2/polls/${post.id}/comments`
            break
        case 'post':
            url = `/v2.2/posts/${post.id}/comments`
            break
        case 'user-petition':
            url = `/v2/user-petitions/${post.id}/comments`
            break
    }

    if (!url) return
    return await to(privateAPI.post(url, { commentBody, parentComment }))
}

export const markRead = async post => {
    const url = `/v2.2/feed`
    return await to(privateAPI.patch(url, [{ id: post.id, is_read: true }]))
}

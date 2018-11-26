import _ from 'lodash'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'

export const fetch = async (cursor = 1) => {
    // The pagination here could probably be done a little better.
    // REVISIT
    var page = 0
    while (cursor > 0) {
        page++
        cursor -= 20
    }

    var result = await to(
        privateAPI.get('/v2/user/social-activities', { tab: 'you', page }),
        'notifications'
    )
    if (!result.success) return result

    redux.store.dispatch({
        type: 'NOTIFICATIONS_STATE',
        payload: result.notifications.payload
    })

    return { ...result }
}

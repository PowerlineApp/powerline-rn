// GET https://api-dev.powerli.ne/api-doc#get--api-v2.2-user-concierge-services
// PUT https://api-dev.powerli.ne/api-doc#get--api-v2.2-user-concierge-services/{id}

import _ from 'lodash'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'

export const fetch = async () => {
    let result = await to(privateAPI.get('/v2.2/user/concierge-services'))
    console.warn('XXX Services:', result)
    if (!result.success) return result

    redux.store.dispatch({
        type: 'SET_CONCIERGESERVICES_STATE',
        payload: result.data
    })

    return result
}

export const request = async id => {
    return await to(privateAPI.put(`/v2.2/user/concierge-services/${id}`))
}

import _ from 'lodash'
import axios from 'axios'
var { API_URL } = require('../PLEnv');

const instance = axios.create({
    baseURL: API_URL,
    timeout: 60000
})

const genConfig = (type, url, data, authRequired) => {
    const dataParamKey = type == 'get' ? 'params' : 'data'
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }

    if (authRequired) {
        const { redux } = require('powerline/instances')
        headers.authorization = 'Bearer ' + redux.store.getState().api.token
        console.warn('Token:', headers.authorization)
    }

    const config = {
        method: type,
        url,
        headers
    }

    if (data) {
        config[dataParamKey] = _.deep(data, x => {
            return _.mapKeys(x, (val, key) => {
                return _.snakeCase(key)
            })
        })
    }

    return Promise.resolve(config)
}

const handleRequest = config =>
    new Promise((resolve, reject) => {
        instance
            .request(config)
            .then(response => {
                const { data } = response

                const camelCase = _.deep(data, x => {
                    return _.mapKeys(x, (val, key) => {
                        return _.camelCase(key)
                    })
                })

                return resolve(camelCase)
            })
            .catch(error => {
                if (error.request && !error.response && !error.request.status) {
                    console.warn('Error:', JSON.stringify(error, null, 4))
                }

                return reject({ error, config })
            })
    })

export default {
    get: async (url, data, authRequired = true) => {
        let config = await genConfig('get', url, data, authRequired)
        return handleRequest(config)
    },
    post: async (url, data, authRequired = true) => {
        let config = await genConfig('post', url, data, authRequired)
        return handleRequest(config)
    },
    put: async (url, data, authRequired = true) => {
        let config = await genConfig('put', url, data, authRequired)
        return handleRequest(config)
    },
    delete: async (url, data, authRequired = true) => {
        let config = await genConfig('delete', url, data, authRequired)
        return handleRequest(config)
    }
}
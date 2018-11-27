import _ from 'lodash'
import { createReducer } from '../utils'

import { createStore, combineReducers } from 'redux'

const reducers = _.merge({}, {
    api: createReducer('api', { token: null }),
    user: createReducer('user'),
    conferences: createReducer('conferences'),
    userGroups: createReducer('userGroups'),
    conciergeServices: createReducer('conciergeServices')
})

const rootReducer = combineReducers(reducers)

const store = createStore(rootReducer)

export { store }

import _ from 'lodash'
import { createReducer } from 'powerline/utils'
import { reducers as componentReducers } from 'powerline/components'
import { reducers as containerReducers } from 'powerline/containers'
import { createStore, combineReducers } from 'redux'

const reducers = _.merge({}, componentReducers, containerReducers, {
    api: createReducer('api', { token: null }),
    user: createReducer('user'),
    conferences: createReducer('conferences'),
    userGroups: createReducer('userGroups'),
    conciergeServices: createReducer('conciergeServices')
})

const rootReducer = combineReducers(reducers)

const store = createStore(rootReducer)

export { store }

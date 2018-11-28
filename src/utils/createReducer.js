import _ from 'lodash'

export default (name, initialState = {}) => {
    name = name.toUpperCase()

    return (state = initialState, action) => {
        if (action.type == `${name}_STATE`) {
            return _.merge({}, state, action.payload)
        }

        if (action.type == `SET_${name}_STATE`) {
            if (action.childKey) {
                let x = _.merge({}, state)
                x[action.childKey] = action.payload
                return x
            }
            return action.payload
        }

        if (action.type == `RESET_${name}_STATE`) {
            return initialState
        }

        return state
    }
}

export const ActionTypes = {
    CREATE_REPRESENTATIVE: 'CREATE_REPRESENTATIVE',
    CREATE_REPRESENTATIVE_SUCCESS: 'CREATE_REPRESENTATIVE_SUCCESS',
    CREATE_REPRESENTATIVE_ERROR: 'CREATE_REPRESENTATIVE_ERROR',
    CREATE_REPRESENTATIVE_CLEAR: 'CREATE_REPRESENTATIVE_CLEAR'
}

const INITIAL_STATE = {
    representative: null,
    loading: false,
    error: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.CREATE_REPRESENTATIVE:
            return {...state, loading: action.payload}
        case ActionTypes.CREATE_REPRESENTATIVE_SUCCESS:
            return {...state, representative: action.payload, loading: false}
        case ActionTypes.CREATE_REPRESENTATIVE_ERROR:
            return {...state, error: action.payload, loading: false}
        case ActionTypes.CREATE_REPRESENTATIVE_CLEAR:
            return INITIAL_STATE
        default:
            return state
    }
} 
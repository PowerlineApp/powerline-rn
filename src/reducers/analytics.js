export const ActionTypes = {
    FETCH_ANALYTICS: 'FETCH_ANALYTICS',
    FETCH_ANALYTICS_SUCESSS: 'FETCH_ANALYTICS_SUCESSS',
    FETCH_ANALYTICS_LOADING: 'FETCH_ANALYTICS_LOADING',
    FETCH_REPRESENTATIVES_SUCESSS: 'FETCH_REPRESENTATIVES_SUCESSS',
    FETCH_REPRESENTATIVES_LOADING: 'FETCH_REPRESENTATIVES_LOADING',
}

const INITIAL_STATE = {
    analytics: null,
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.FETCH_ANALYTICS_SUCESSS:
            return {...state, analytics: action.payload}
        case ActionTypes.FETCH_ANALYTICS_LOADING:
            return {...state, loading: action.payload}
        default:
            return state
    }
} 
export const ActionTypes = {
    FETCH_ANALYTICS: 'FETCH_ANALYTICS',
    FETCH_ANALYTICS_SUCESSS: 'FETCH_ANALYTICS_SUCESSS',
    FETCH_ANALYTICS_LOADING: 'FETCH_ANALYTICS_LOADING',
    FETCH_REPRESENTATIVES_SUCESSS: 'FETCH_REPRESENTATIVES_SUCESSS',
    FETCH_REPRESENTATIVES_LOADING: 'FETCH_REPRESENTATIVES_LOADING',
    FETCH_ANALYTICS_ERROR: 'FETCH_ANALYTICS_ERROR',
    FETCH_ANALYTICS_CLEAR: 'FETCH_ANALYTICS_CLEAR'
};

const INITIAL_STATE = {
    analytics: null,
    loading: false,
    error: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
    case ActionTypes.FETCH_ANALYTICS_SUCESSS:
        return {...state, analytics: action.payload};
    case ActionTypes.FETCH_ANALYTICS_LOADING:
        return {...state, loading: action.payload};
    case ActionTypes.FETCH_ANALYTICS_ERROR:
        return {...state, error: action.payload};
    case ActionTypes.FETCH_ANALYTICS_CLEAR:
        return INITIAL_STATE;
    default:
        return state;
    }
}; 
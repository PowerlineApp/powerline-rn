const initialState = {
    data: [],
}

const payloadStack: Array<Object> = [];

export default function conciergeServices(state = initialState, action:Action){
    if(action.type === 'LOADED_CONCIERGE_SERVICES') {
        return {
            ...state,
            data: action.data
        }
    }

    return state;
}

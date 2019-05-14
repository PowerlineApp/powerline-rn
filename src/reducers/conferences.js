const initialState = {
    data: null,
    hasConference: false
}

const payloadStack: Array<Object> = [];

export default function conferences(state = initialState, action:Action){
    if(action.type === 'LOADED_CONFERENCES') {
        return {
            ...state,
            data: action.data
        }
    }
    if(action.type === 'SET_HAS_CONFERENCE') {
        console.log('SET_HAS_CONFERENCE >>', action)
        return {
            ...state,
            hasConference: action.payload
        }
    }

    return state;
}

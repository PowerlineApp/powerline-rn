const initialState = {
    data: [],
}

const payloadStack: Array<Object> = [];

export default function conferences(state = initialState, action:Action){
    if(action.type === 'LOADED_CONFERENCES') {
        return {
            ...state,
            data: action.data
        }
    }

    return state;
}

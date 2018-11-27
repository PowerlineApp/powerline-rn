const initialState = {
    page: 0,
    payload: [],
    items: 0,
    totalItems: 0
}

const payloadStack: Array<Object> = [];

export default function conferences(state = initialState, action:Action){
    
    if(action.type === 'LOADED_CONFERENCES') {
        console.log('action------------', action);
        payloadStack = payloadStack.concat(action.data);
        return {
            ...state,
            payload: payloadStack
        }
    }

    return state;
}

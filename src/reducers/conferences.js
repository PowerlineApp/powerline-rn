const initialState = {
    page: 0,
    payload: [],
    items: 0,
    totalItems: 0
}

const payloadStack: Array<Object> = [];

function conferences(state = initialState, action){
    console.log('action------------', action);
    if(action.type == 'LOADED_CONFERENCES'){
        payloadStack = payloadStack.concat(action.data);
        return {
            ...state,
            payload: payloadStack
        }
    }

    return state;
}

module.exports = conferences;
const initialState = {
    page: 0,
    payload: [],
    items: 0,
    totalItems: 0
}

let payloadStack: Array<Object> = [];

function notifications(state = initialState, action){
    if(action.type == 'LOAD_NOTIFICATION'){
        payloadStack = payloadStack.concat(action.data.payload);

        return {
            page: action.data.page,
            items: action.data.items,
            totalItems: action.data.totalItems,
            payload: payloadStack
        }
    }

    if(action.type == 'RESET_NOTIFICATION' || action.type == 'LOGGED_OUT'){
        payloadStack = [];
        return initialState;
    }

    if(action.type == 'CHANGE_NOTIFICATION'){
        payloadStack = payloadStack.concat(action.data);
        return {
            ...state,
            payload: payloadStack
        }
    }

    return state;
}

module.exports = notifications;
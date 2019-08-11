const initialState = {
    page: 0,
    payload: [],
    items: 0,
    totalItems: 0
}

let payloadStack: Array<Object> = [];

function followers(state = initialState, action){
    if(action.type == 'LOAD_FOLLOWERS'){
        payloadStack = payloadStack.concat(action.data.payload);
        return {
            page: action.data.page,
            items: action.data.items,
            totalItems: action.data.totalItems,
            payload: payloadStack
        }
    }

    if(action.type == 'RESET_FOLLOWERS' || action.type == 'LOGGED_OUT'){
        payloadStack = [];
        return initialState;
    }

    if(action.type == 'CHANGE_FOLLOWERS'){
        payloadStack = payloadStack.concat(action.data);
        return {
            ...state,
            payload: payloadStack
        }
    }

    return state;
}

module.exports = followers;
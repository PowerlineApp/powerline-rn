import update from 'immutability-helper';
export const ActionTypes = {
    FETCH_GROUP_MEMBERS_SUCCESS: 'FETCH_GROUP_MEMBERS_SUCCESS',
    FETCH_GROUP_MEMBERS_LOADING: 'FETCH_GROUP_MEMBERS_LOADING',
    FETCH_GROUP_MEMBERS_ERROR: 'FETCH_GROUP_MEMBERS_ERROR',
    GROUP_PROMOTE_USER_LOADING: 'GROUP_PROMOTE_USER_LOADING',
    GROUP_PROMOTE_USER_SUCCESS: 'GROUP_PROMOTE_USER_SUCCESS',
    GROUP_PROMOTE_USER_ERROR: 'GROUP_PROMOTE_USER_ERROR',
    GROUP_UNPROMOTE_USER_LOADING: 'GROUP_UNPROMOTE_USER_LOADING',
    GROUP_UNPROMOTE_USER_SUCCESS: 'GROUP_UNPROMOTE_USER_SUCCESS',
    GROUP_UNPROMOTE_USER_ERROR: 'GROUP_UNPROMOTE_USER_ERROR',
    GROUP_ACCEPT_USER_LOADING: 'GROUP_ACCEPT_USER_LOADING',
    GROUP_ACCEPT_USER_LOADING: 'GROUP_ACCEPT_USER_LOADING',
    GROUP_ACCEPT_USER_SUCCESS: 'GROUP_ACCEPT_USER_SUCCESS',
    GROUP_REMOVE_USER_LOADING: 'GROUP_REMOVE_USER_LOADING',
    GROUP_REMOVE_USER_SUCCESS: 'GROUP_REMOVE_USER_SUCCESS',
    GROUP_REMOVE_USER_ERROR: 'GROUP_REMOVE_USER_ERROR'
}

const INITIAL_STATE = {
    pending: null,
    loading: false,
    joined: null
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.FETCH_GROUP_MEMBERS_SUCCESS:
            return {...state, pending: action.payload.filter(member => member.join_status === 'pending'), joined: action.payload.filter(member => member.join_status === 'active')}

        case ActionTypes.FETCH_GROUP_MEMBERS_LOADING:
            return {...state, loading: action.payload}

        case ActionTypes.GROUP_ACCEPT_USER_SUCCESS:
            const pending = state.pending.filter(item => item.id !== action.payload.userId)
            const item = state.pending.slice().find(item => item.id === action.payload.userId)
            item.join_status = action.payload.data.join_status;
            const joined = state.joined.map(item => item);
            joined.push(item);
            return {...state, joined, pending}

        case ActionTypes.GROUP_REMOVE_USER_SUCCESS:
            return {...state, joined: state.joined.filter(user => user.id !== action.payload)};
        
        case ActionTypes.GROUP_PROMOTE_USER_SUCCESS:
            const list = state.joined.filter(item => item.id !== action.payload)
            const userToUpdate = state.joined.slice().find(item => item.id === action.payload)
            userToUpdate.user_role = 'manager';
            list.push(userToUpdate);
            return { ...state, joined: list}
        case ActionTypes.GROUP_UNPROMOTE_USER_SUCCESS:
            const userList = state.joined.filter(item => item.id !== action.payload)
            const userToRemove = state.joined.slice().find(item => item.id === action.payload)
            userToRemove.user_role = 'member';
            userList.push(userToRemove);
            return { ...state, joined: userList}

        default:
            return state
    }
} 
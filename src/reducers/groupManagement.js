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
    GROUP_REMOVE_USER_ERROR: 'GROUP_REMOVE_USER_ERROR',

    GROUP_GET_ADVANCED_ATTRIBS_LOADING: 'GROUP_GET_ADVANCED_ATTRIBS_LOADING',
    GROUP_GET_ADVANCED_ATTRIBS_SUCCESS: 'GROUP_GET_ADVANCED_ATTRIBS_SUCCESS',
    GROUP_ADVANCED_ATTRIBS_INPUT_CHANGED: 'GROUP_ADVANCED_ATTRIBS_INPUT_CHANGED',
    GROUP_GET_ADVANCED_ATTRIBS_ERROR: 'GROUP_GET_ADVANCED_ATTRIBS_ERROR',

    GROUP_UPDATE_ADVANCED_ATTRIBS_LOADING: 'GROUP_UPDATE_ADVANCED_ATTRIBS_LOADING',
    GROUP_UPDATE_ADVANCED_ATTRIBS_SUCCESS: 'GROUP_UPDATE_ADVANCED_ATTRIBS_SUCCESS',
    GROUP_UPDATE_ADVANCED_ATTRIBS_ERROR: 'GROUP_UPDATE_ADVANCED_ATTRIBS_ERROR',

    GROUP_TAGS_LOADING: 'GROUP_TAGS_LOADING',
    GROUP_TAGS_SUCCESS: 'GROUP_TAGS_SUCCESS',
    GROUP_TAGS_ERROR: 'GROUP_TAGS_ERROR',

    GROUP_OWN_TAGS_LOADING: 'GROUP_OWN_TAGS_LOADING',
    GROUP_OWN_TAGS_SUCCESS: 'GROUP_OWN_TAGS_SUCCESS',
    GROUP_OWN_TAGS_ERROR: 'GROUP_OWN_TAGS_ERROR',
    GROUP_DESELECT_TAG: 'GROUP_DESELECT_TAG',
    GROUP_SELECT_TAG: 'GROUP_SELECT_TAG',

    GROUP_SAVE_TAG_SUCCESS: 'GROUP_SAVE_TAG_SUCCESS',
    GROUP_SAVE_TAG_ERROR: 'GROUP_SAVE_TAG_ERROR',
    GROUP_DELETE_TAG_SUCCESS: 'GROUP_DELETE_TAG_SUCCESS',
    GROUP_DELETE_TAG_ERROR: 'GROUP_DELETE_TAG_ERROR'
    
}

const INITIAL_STATE = {
    pending: null,
    loading: false,
    joined: null,
    advancedAttribs: null,
    groupOwnTags: null,
    groupTags: null
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

        case ActionTypes.GROUP_GET_ADVANCED_ATTRIBS_SUCCESS: {
            return {...state, advancedAttribs: action.payload}
        }
        case ActionTypes.GROUP_ADVANCED_ATTRIBS_INPUT_CHANGED: {
            {
                let obj = {}
                obj[action.payload.key] = action.payload.prop
                return update(state,
                  {advancedAttribs: {$merge: obj}}
                )
            }
        }
        case ActionTypes.GROUP_TAGS_SUCCESS: {
            return {...state, groupTags: action.payload}
        }
        case ActionTypes.GROUP_OWN_TAGS_SUCCESS: {
            return {...state, groupOwnTags: action.payload}
        }

        case ActionTypes.GROUP_SELECT_TAG: {
            return {...state, groupOwnTags: [...state.groupOwnTags, action.payload]}
        }

        case ActionTypes.GROUP_DESELECT_TAG: {
            return {...state, groupOwnTags: state.groupOwnTags.filter(item => item !== action.payload)}
        }
        default:
            return state
    }
} 
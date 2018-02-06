'use strict';

import type { Action } from '../actions/types';

export type State = {
    page: number;
    payload: Array<Object>;
    cursor: String;
    items: number;
    totalItems: number;
    loading: boolean;
    group: string;
    groupName: string;
    groupAvatar: string;
    groupLimit: number;
    selectedGrouo: object;
    savedGroup: object;
    newsfeedUnreadCount: number;
};

const initialState = {
    page: 0,
    payload: [],
    cursor: '',
    items: 0,
    totalItems: 0,
    group: null,
    loading: false,
    groupName: '',
    groupAvatar: '',
    groupLimit: 10,
    selectedGroup: {
        group: '',
        groupName: '',
        groupAvatar: '',
    },
    newsfeedUnreadCount: 0,
};

const payloadStack: Array<Object> = [];

function activities(state: State = initialState, action: Action): State {
    // console.log('action(activities):', action);
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    switch (action.type) {

    case 'SAVE_OFFSET': {
        return {...state, lastOffset: action.payload}
    }

    case 'SET_LOADING': {
        // console.log('=z==zz=z=z=>', action, {...state, loading: action.payload})
        return {...state, loading: action.payload}
    }

    case 'UPDATE_FEED': {
        return {
            ...state,
            payload: [action.payload, ...state.payload],
            items: [action.payload, ...state.payload],
            count: state.count + 1,
            // count: state.count + 1,

        }
    }
    
    case 'LOADED_ACTIVITIES': {
        // console.log('=z==zz=z=z=>', action.data)
        payloadStack = payloadStack.concat(action.data.payload);
        return {
            ...state,
            // page: action.data.page,
            cursor: action.data.cursor,
            loading: false,
            items: action.data.items,
            totalItems: action.data.totalItems,
            payload: payloadStack,
            count: action.data.payload.length,
        };
    }

    case ('RESET_ACTIVITIES'): {
        // console.log('RESET_ACTIVITIES', action);
        payloadStack = [];
        return {
            ...initialState,
            selectedGroup: state.selectedGroup,
            // newsfeedUnreadCount: state.newsfeedUnreadCount,
        };
    }

    case ('SET_NEWSFEED_COUNT'): {
        return {
            ...state,
            newsfeedUnreadCount: action.count,
        }
    }
    case ('DECREASE_NEWSFEED_COUNT'): {
        return {
            ...state,
            newsfeedUnreadCount: (state.newsfeedUnreadCount -1),
        }
    }

    case ('LOGGED_OUT'): {
        payloadStack = [];
        return initialState;
    }

    case ('SET_GROUP'): {
        // return {...state}
        // payloadStack = [];
        return {
            ...state,
            payload: [],
            selectedGroup: action.data
        }
    }

    case ('DELETE_ACTIVITIES'): {
        payloadStack = [];
        return {
            ...state,
            payload: []
        }
    }

    case ('DELETE_ACTIVITY'): {
        payloadStack = state.payload.filter(activity => activity.id !== action.id);
        return {
            ...state,
            payload: payloadStack,
            count: state.payload.count - 1,
        }
    }

    case ('CHANGE_ACTIVITY_DESCRIPTION'): {
        payloadStack = state.payload.map(activity => {
            if (activity.id === action.data.id) {
                return {
                    ...activity,
                    description: action.data.description
                }
            } else {
                return activity;
            }
        });
        return {
            ...state,
            payload: payloadStack,
        }
    }

    case ( 'BOOST_ACTIVITY'): {
        payloadStack = state.payload.map(activity => {
            if (activity.id === action.id) {
                return {
                    ...activity,
                    zone: 'prioritized'
                }
            } else {
                return activity;
            }
        });
        return {
            ...state,
            payload: payloadStack,
        }
    }

    case ('CHANGE_FOLLOW_STATUS'): {
        const { follow_status, id } = action.data;
        payloadStack = state.payload.map(activity => {
            if (activity.id === id) {
                return {
                    ...activity,
                    user: {
                        ...activity.user,
                        follow_status,
                    }
                }
            } else {
                return activity;
            }
        });
        return {
            ...state,
            payload: payloadStack,
        }
    }

    case ('ACTIVITY_NOTIFICATION_SUBSCRIBE'): {
        let { type, id } = action.data;
        if (type === 'user-petition') {
            type = 'user_petition';
        }
        payloadStack = state.payload.map(activity => {
            console.log('=> ', activity.id, id, activity.id === id)
            if (activity.id === id) {
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                return {
                    ...activity,
                    is_subscribed: true
                };
            } else {
                return activity;
            }
        });
        return {
            ...state,
            payload: payloadStack,
        }
    }

    case ('ACTIVITY_NOTIFICATION_UNSUBSCRIBE'): {
        let { type, id } = action.data;
        if (type === 'user-petition') {
            type = 'user_petition';
        }
        payloadStack = state.payload.map(activity => {
            if (activity.id === id) {
                return {
                    ...activity,
                    is_subscribed: false,
                };
            } else {
                return activity;
            }
        });
        return {
            ...state,
            payload: payloadStack,
        }
    }

    case ('UPDATE_ACTIVITY'): {
        // console.log('HEY YALL')
        let { id } = action.payload;
        payloadStack = state.payload.map(activity => {
            if (activity.id === id) {
                return {
                    ...activity, ...action.payload
                };
            } else {
                return activity;
            }
        });
        return {
            ...state,
            payload: payloadStack,
        }
    }

    default: 
    return state;
}
    
}

module.exports = activities;
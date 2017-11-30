'use strict';

import type { Action } from '../actions/types';

export type State = {
    page: number;
    payload: Array<Object>;
    items: number;
    totalItems: number;
    group: string;
    groupName: string;
    groupAvatar: string;
    groupLimit: number;
    savedGroup: object;
    newsfeedUnreadCount: number;
};

const initialState = {
    page: 0,
    payload: [],
    items: 0,
    totalItems: 0,
    group: 'all',
    groupName: '',
    groupAvatar: '',
    groupLimit: 10,
    selectedGroup: {
        group: 'all',
        groupName: '',
        groupAvatar: '',
    },
    newsfeedUnreadCount: 0,
};

const payloadStack: Array<Object> = [];

function activities(state: State = initialState, action: Action): State {
    console.log('action(activities):', action);
    if (action.type === 'LOADED_ACTIVITIES') {
        payloadStack = payloadStack.concat(action.data.payload);
        return {
            ...state,
            page: action.data.page,
            items: action.data.items,
            totalItems: action.data.totalItems,
            payload: payloadStack,
            count: action.data.payload.length,
        };
    }

    if (action.type === 'RESET_ACTIVITIES') {
        console.log('RESET_ACTIVITIES', action);
        payloadStack = [];
        return {
            ...initialState,
            selectedGroup: state.selectedGroup,
            // newsfeedUnreadCount: state.newsfeedUnreadCount,
        };
    }

    if (action.type === 'SET_NEWSFEED_COUNT') {
        return {
            ...state,
            newsfeedUnreadCount: action.count,
        }
    }

    if (action.type === 'LOGGED_OUT') {
        payloadStack = [];
        return initialState;
    }

    if (action.type === 'SET_GROUP') {
        console.log('SET_GROUP', action);
        payloadStack = [];
        return {
            ...state,
            payload: [],
            selectedGroup: {
                group: action.data ? action.data.id : null,
                groupName: action.data ? action.data.name : null,
                groupAvatar: action.data ? action.data.avatar : null,
                conversationView: action.data ? action.data.conversationView : null,
                groupMembers: action.data ? action.data.totalMembers : null,
                groupLimit: action.data ? action.data.limit : null,
                user_role: action.data ? action.data.user_role : null,
                header: action.data ? action.data.header : 'more'
            },
        }
    }

    if (action.type === 'DELETE_ACTIVITIES') {
        payloadStack = [];
        return {
            ...state,
            payload: []
        }
    }

    if (action.type === 'DELETE_ACTIVITY') {
        payloadStack = state.payload.filter(activity => activity.id !== action.id);
        return {
            ...state,
            payload: payloadStack,
            count: state.payload.count - 1,
        }
    }

    if (action.type === 'CHANGE_ACTIVITY_DESCRIPTION') {
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

    if (action.type === 'BOOST_ACTIVITY') {
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

    if (action.type === 'CHANGE_FOLLOW_STATUS') {
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

    if (action.type === 'ACTIVITY_NOTIFICATION_SUBSCRIBE') {
        let { type, id } = action.data;
        if (type === 'user-petition') {
            type = 'user_petition';
        }
        payloadStack = state.payload.map(activity => {
            if (activity.id === id) {
                return {
                    ...activity,
                    [type]: {
                        ...activity[type],
                        is_subscribed: true,
                    }
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

    if (action.type === 'ACTIVITY_NOTIFICATION_UNSUBSCRIBE') {
        let { type, id } = action.data;
        if (type === 'user-petition') {
            type = 'user_petition';
        }
        payloadStack = state.payload.map(activity => {
            if (activity.id === id) {
                return {
                    ...activity,
                    [type]: {
                        ...activity[type],
                        is_subscribed: false,
                    }
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

    return state;
}

module.exports = activities;
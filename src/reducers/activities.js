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
    savedGroup: {
        group: 'all',
        groupName: '',
        groupAvatar: '',
    },
    newsfeedUnreadCount: 0,
};

const payloadStack: Array<Object> = [];

function activities(state: State = initialState, action: Action): State {
    if (action.type === 'LOADED_ACTIVITIES') {
        payloadStack = payloadStack.concat(action.data.payload);
        return {
            ...state,
            page: action.data.page,
            items: action.data.items,
            totalItems: action.data.totalItems,
            payload: payloadStack,
            count: action.data.payload.length,
            newsfeedUnreadCount: action.data.newsfeedUnreadCount,
        };
    }
    
    if (action.type === 'RESET_ACTIVITIES') {
        payloadStack = [];
        return {
            ...initialState,
            savedGroup: state.savedGroup,
            newsfeedUnreadCount: state.newsfeedUnreadCount,
        };
    }

    if (action.type === 'LOGGED_OUT') {
        payloadStack = [];
        return initialState;
    }

    if(action.type === 'SET_GROUP'){
        payloadStack = [];
        return {
            ...state,
            group: action.data.id,
            groupName: action.data.name,
            groupAvatar: action.data.avatar,
            groupLimit: action.data.limit,
            payload: [],
            savedGroup: {
                group: action.data.id,
                groupName: action.data.name,
                groupAvatar: action.data.avatar,
            },
        }
    }

    if(action.type === 'DELETE_ACTIVITIES'){
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

    return state;
}

module.exports = activities;
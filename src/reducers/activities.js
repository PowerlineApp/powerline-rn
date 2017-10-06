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
    }
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
        };
    }
    
    if (action.type === 'RESET_ACTIVITIES') {
        payloadStack = [];
        return {
            ...initialState,
            savedGroup: state.savedGroup,
        };
    }

    if (action.type === 'LOGGED_OUT') {
        payloadStack = [];
        return initialState;
    }

    if(action.type == 'SET_GROUP'){
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

    if(action.type == 'DELETE_ACTIVITIES'){
        payloadStack = [];
        return {
            ...state,
            payload: []
        }
    }

    if (action.type == 'DELETE_ACTIVITY') {
        payloadStack = state.payload.filter(activity => activity.id !== action.id);
        return {
            ...state,
            payload: payloadStack,
            count: state.payload.count - 1,
        }
    }
    return state;
}

module.exports = activities;
'use strict';

import type { Action } from '../actions/types';

const { PER_PAGE } = require('PLEnv');

export type Group = {
    avatar_file_path: ?string;
    joined: ?boolean;
    group_type_label: ?string;
    id: ?number;
    official_name: ?string;
    acronym: ?string;
    picture: ?string;
    created_at: ?string;
    
    //If this is passcode, user must provide passcode to join group; If manual approval, group owner will manually approve user to join group
    membership_control: ?string;
    //If this is true, then the user is required to answer questions when joining the group
    fill_fields_required: ?boolean;
    //This is the number of posts/petitions per month the user is allwoed to create in the group
    petition_per_month: ?number;
};

export type State = {
    page: number;
    items: number;
    payload: Array<Object>;
    town: string;
    state: string;
    country: string;
};

const itemsPerPage = PER_PAGE;

const initialState = {
    page: 0,
    items: itemsPerPage,
    payload: [],
    town: 'Town',
    state: 'State',
    country: 'Country',
};

const payloadStack: Array<Object> = [];

//Ideally this should be loaded in the background so that user experiences no delay when tapping on the More button in the Group Selector
//GH135
function groups(state: State = initialState, action: Action): State {
    if (action.type === 'LOADED_GROUPS') {
        const titles = {};
        payloadStack = payloadStack.concat(action.data.payload);
        action.data.payload.forEach(group => {
            if (group.group_type_label === "local") {
                titles.town = group.official_name;
            } else if (group.group_type_label === "state") {
                titles.state = group.official_name;
            } else if (group.group_type_label === "country") {
                titles.country = group.official_name;
            }
        });

        return {
            page: action.data.page,
            items: action.data.items,
            payload: payloadStack,
            ...titles
        };
    }
    if (action.type === 'CLEAR_CACHED_GROUPS' || action.type === 'LOGGED_OUT') {
        payloadStack = [];
        return initialState;
    }
    return state;
}

module.exports = groups;
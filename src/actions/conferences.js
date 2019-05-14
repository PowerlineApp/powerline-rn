var { Action, ThunkAction } = require('./types');
var { API_URL } = require('../PLEnv');
import { Actions } from "react-native-router-flux";

const fetchConferences = (token: string) => async (dispatch, getState) => {
    // dispatch(updateHomeScreen(false))
    
    const hasConference = getState().conferences.hasConference
    
    console.log('\n\n==================== fetch conferences')
    console.log('hasConferences in current state ? => ', getState().conferences, hasConference)
    try {
        const response = await fetch(`${API_URL}/v2.2/conferences`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const json = await response.json();
        const action = {
            type: 'LOADED_CONFERENCES',
            data: json,
        };
        dispatch(action);
        if (json.length >= 1) {
            if (hasConference) return
            dispatch(updateHomeScreen(true))
        } else {
            if (!hasConference) return
            dispatch(updateHomeScreen(false))
        }
    } catch (error) {
        console.log('error-----------', error);
        return Promise.reject(error);
    }
}

const updateHomeScreen = hasConference => dispatch => {
    dispatch({
        type: 'SET_HAS_CONFERENCE',
        payload: hasConference
    })
    Actions.reset(hasConference ? 'simpleHome' : 'originalHome')

    // navigateTo(hasConference ? 'simpleHome' : 'originalHome')
}

module.exports = {
    fetchConferences,
}

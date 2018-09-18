var { API_URL, PER_PAGE } = require('../PLEnv');
import { ActionTypes } from '../reducers/representativesForm'
const createRepresentative = (data) => (dispatch, getState) => {
    const token = getState().user.token
    dispatch({type: ActionTypes.CREATE_REPRESENTATIVE, payload: true})
    fetch(API_URL + '/v2/user/representatives', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(res => {
        console.log('createRepresentative', res)
        if(!res.code || res.code < 400) {
            dispatch({type: ActionTypes.CREATE_REPRESENTATIVE_SUCCESS, payload: res})
        } else {
            dispatch({type: ActionTypes.CREATE_REPRESENTATIVE_ERROR, payload: res.message})
        }
    })
    .catch(err => {
        dispatch({type: ActionTypes.CREATE_REPRESENTATIVE_ERROR, payload: err.message})
    });
}

export {
    createRepresentative
}
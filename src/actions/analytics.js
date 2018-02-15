import { ActionTypes } from '../reducers/analytics';
var { API_URL, PER_PAGE } = require('../PLEnv');

export const fetchAnalytics = (postID) => (dispatch, getState) => {
    const url = `${API_URL}/v2/posts/${postID}/analytics`;
    console.log(url);
    const token = getState().user.token;
    dispatch({type: ActionTypes.FETCH_ANALYTICS_CLEAR});
    dispatch({type: ActionTypes.FETCH_ANALYTICS_LOADING, payload: true});
    fetch(url, {
        method: 'GET',
        headers: {
             'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(async analytics => {
            const json = await analytics.json();
            console.log(json);
            dispatch({type: ActionTypes.FETCH_ANALYTICS_CLEAR});
            if(json) {
                if(json.code && json.code > 400) {
                    dispatch({type: ActionTypes.FETCH_ANALYTICS_ERROR, payload: true});
                    return;
                }
                dispatch({type: ActionTypes.FETCH_ANALYTICS_SUCESSS, payload: json});
                dispatch({type: ActionTypes.FETCH_ANALYTICS_LOADING, payload: false});
            }
        })
        .catch(error => {
            dispatch({type: ActionTypes.FETCH_ANALYTICS_LOADING, payload: false});
        });
};

export const fetchUserRepresentatives = () => (dispatch, getState) => {
    const url = `${API_URL}/v2/user/representatives`;
    const token = getState().user.token;
    dispatch({type: ActionTypes.FETCH_ANALYTICS_LOADING, payload: true});
    fetch(url, {
        method: 'GET',
        headers: {
             'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(async rep => {
            const json = await rep.json();
            if(json) {
                dispatch({type: ActionTypes.FETCH_REPRESENTATIVES_SUCESSS, payload: json});
                dispatch({type: ActionTypes.FETCH_REPRESENTATIVES_LOADING, payload: false});
            }
        })
        .catch(error => {
            dispatch({type: ActionTypes.FETCH_REPRESENTATIVES_LOADING, payload: false});
        });
};
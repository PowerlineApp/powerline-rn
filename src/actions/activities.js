
import api from '../utils/api';
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
import { showToast } from 'PLToast';


async function getActivities2(token, groupId, user, followed, cursor, type, id) {
    let params = `?&user=${user || ''}&group=${groupId || ''}&followed=${followed || ''}`
    let url = cursor || `${API_URL}/v2.2/feed` + params;
    console.log(url, token)
    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json',
        }
    });
    let headers = res.headers;
    if (!res.ok){
        return Promise.reject('Invalid response');
    }
    let nextCursor = headers.get('X-Cursor-Next');
    let json = await res.json();
    console.log('\nresponse => ', res, '\njson => ', json,'\nheaders => ', headers)
    let action = {
        type: 'LOADED_ACTIVITIES',
        data: {
            totalItems: json.length,
            cursor: nextCursor !== cursor && nextCursor,
            items: json,
            payload: json
        }

    }
    // console.log('actionxx', action.data.items[0].group)
    return Promise.resolve(action)
}


//Newsfeed activities can be loaded by All, by Group (town/state/country/group), by Friends, by Specific user, or by Favorites
async function loadActivities(token: string, page: ?number = 0, perPage: ?number = PER_PAGE, group: ?string = 'all', user: ?string = 'all', followed = 'all'): Promise<Action> {
    return getActivities2(token, group, user, followed, null);

    
    console.log(`${API_URL}/v2/activities?_format=json&user=${user}&group=${group}&page=${page + 1}&per_page=${perPage}&followed=${followed}`);
    try {
        var response = await fetch(`${API_URL}/v2/activities?_format=json&user=${user}&group=${group}&followed=${followed}&page=${page + 1}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();

        if (json.totalItems) {
            const action = {
                type: 'LOADED_ACTIVITIES',
                data: {
                    page: json.page,
                    totalItems: json.totalItems,
                    items: json.items,
                    payload: json.payload,
                    // newsfeedUnreadCount: priority_item_count,
                },
            };
            console.log('load activities', json)
            return Promise.resolve(action);
        }
        else {
            return Promise.reject(json);
        }
    } catch (error) {
        // TEST PURPOSE:
        console.error(error);
        return Promise.reject(error);
    }
}

const markAsRead = (token, id) => (dispatch, state) => {
    console.log('---------------\n----------\n------------------\nmarking as read', `${API_URL}/v2/activities`,[{id: id, read: true}] )
        fetch(`${API_URL}/v2/activities`,
        {
          method: 'PATCH',
          headers: {
              'token': token,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({activities: [{id: id, read: true}]})
        }).then(r => {
            // console.log('response', r)
            dispatch({type: 'DECREASE_NEWSFEED_COUNT'})
        }).catch(e => {
            console.log('error', e)
        })
}


async function loadFriendsActivities(token, cursor): Promise<Action> {
    return getActivities2(token, null, null, true, cursor, null, null);
        try {
        var response = await fetch(`${API_URL}/v2/activities?_format=json&followed=1&page=${page + 1}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        if (json.totalItems) {
            // console.log('${API_URL}/v2/activities?_format=json&followed=true&page=${page + 1}&per_page=${perPage} --- load friends activities return: ', json.payload.map(item => item.title + item.body))
            const action = {
                type: 'LOADED_ACTIVITIES',
                data: {
                    page: json.page,
                    totalItems: json.totalItems,
                    items: json.items,
                    payload: json.payload,
                },
            };
            return Promise.resolve(action);
        }
        else {
            return Promise.reject(json);
        }
    } catch (error) {
        // TEST PURPOSE:
        console.error(error);
        return Promise.reject(error);
    }
}



function resetActivities(): ThunkAction {
    return (dispatch) => {
        // console.warn('RESETING ACTIVITIES -----------')
        return dispatch({
            type: 'RESET_ACTIVITIES',
        });
    };
}

const updateFeedFirstItem = (item) => (dispatch, getState) => {
    if (!item.id) return;
    console.log(item.group, getState().activities.selectedGroup)
    if (item.group.id !== getState().activities.selectedGroup.id && getState().activities.selectedGroup.id !== 'all') return;
    // console.log('===>', pos)
    dispatch({type: 'UPDATE_FEED', payload: item})
}

function loadActivitiesByUserId(token, page = 0, per_page = 20, group = 'all', user) {
    return getActivities2(token, null, user, null)
    // console.log(token, page, per_page, group, user)
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/activities?_format=json&user=' + user + '&group=' + group + '&page=' + page + '&per_page=' + per_page, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
            .then((res) => res.json())
            .then(data => {
                // console.log("Load Activities by User Id API success", data);
                resolve(data);
            })
            .catch(err => {
                console.log("Load Activities by User Id API error", err);
                reject(err);
            })
    });
}

//Should be for loading public groups (Town/state/country) or by public groups (e.g. Save the Whales)
function loadActivityByEntityId(token, entityType, entityId) {
    console.log('about to fetch => ' + `/v2.2/${entityType + 's'}/${entityId}?_format=json&&page=1&per_page=1`);
    // /api/v2/activities?petition_id=349&page=1&per_page=20
    return new Promise((resolve, reject) => {
        fetch(API_URL + `/v2.2/${entityType + 's'}/${entityId}?_format=json&&page=1&per_page=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
            .then((res) => {console.log('res', res); return res.json()})
            .then(data => {
                console.log("Load Activity by Entity Id API success", data);
                resolve(data);
            })
            .catch(err => {
                console.log("Load Activity by Entity Id API error", err);
                reject(err);
            })
    });
}

//This relates to the Notifications tab
function putSocialActivity(token, id, ignore){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/v2/social-activities/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                ignore: ignore
            })
        })
        .then((res) => res.json())
        .then(data => {
            // console.log("Put Social Activity API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Put Social Activity API Error", err);
            reject(err);
        });
    });
}

async function subscribeNotification(token: string, id: number, activityId: number, type: string): Promise<Action> {
    LOG('Subscribe to notification API', id, type);
    const response = await api.put(token, `/v2/user/${type}s/${id}`);
    LOG(response)
    if (response.status === 204) {
        showToast('Notifications on');
        return {
            type: 'ACTIVITY_NOTIFICATION_SUBSCRIBE',
            data: { id: activityId, type }
        }
    } else {
        showToast('Subscribe to post failed');
        console.warn('FAILED TO UNSUBSCRIBE, DISPATCHING EMPTY ACTION')
        return {type: ''}
    }
}

async function unsubscribeNotification(token: string, id: number, activityId: number, type: string): Promise<Action> {
    LOG('Unsubscribe to notification API', id, type);
    const response = await api.delete(token, `/v2/user/${type}s/${id}`);
    if (response.status === 204) {
        showToast('Notifications Muted');
        return {
            type: 'ACTIVITY_NOTIFICATION_UNSUBSCRIBE',
            data: { id: activityId, type }
        }
    } else {
        console.warn('FAILED TO UNSUBSCRIBE, DISPATCHING EMPTY ACTION')
        return {type: ''}
    }
}

async function markAsSpam(token: string, id: number, type: string): Promise<Action> {
    LOG('Mark as spam API', id);
    const response = await api.post(token, `/v2/${type}s/${id}/spam`);
}

const saveOffSet = (pos) => (dispatch) => {
    console.log('===>', pos)
    dispatch({type: 'SAVE_OFFSET', payload: pos})
}

const setGroup = (data, token, id) => (dispatch) => {
    // console.log('setgroup', data, token, id)
    // alert('ola')
    dispatch({ type: 'RESET_ACTIVITIES' });
    dispatch({type: 'SET_LOADING', payload: true})
    dispatch({type: 'SET_GROUP', data});
    dispatch(loadActivities(token, 0, 20, id));
    dispatch({type: 'SAVE_OFFSET', payload: 0})
    setTimeout(() => {
        dispatch({type: 'SET_LOADING', payload: false})
    }, 15000)
}

module.exports = {
    getActivities2,
    loadActivities,
    resetActivities,
    loadActivitiesByUserId,
    loadActivityByEntityId,
    putSocialActivity,
    loadFriendsActivities,
    subscribeNotification,
    unsubscribeNotification,
    markAsSpam,
    saveOffSet,
    setGroup,
    markAsRead,
    updateFeedFirstItem
}
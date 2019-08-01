
import api from '../utils/api';
var { API_URL, PER_PAGE } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');
// import { showToast } from '../utils/toast';
import { showToast } from '../utils/toast';



async function getActivities2(token, groupId, user, followed, cursor, type, id) {
    let params = `?&user=${user || ''}&group=${groupId || ''}&followed=${followed || ''}`
    let url = cursor || `${API_URL}/v2.2/feed` + params;
    /*console.log(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })*/
    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    let headers = res.headers;
    if (!res.ok){
        return Promise.reject('Invalid response');
    }
    let nextCursor = headers.get('X-Cursor-Next');
    let json = await res.json();
    //console.log('\nresponse => ', res, '\njson => ', json,'\nheaders => ', headers)
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

    
    //console.log(`${API_URL}/v2/activities?_format=json&user=${user}&group=${group}&page=${page + 1}&per_page=${perPage}&followed=${followed}`);
    try {
        var response = await fetch(`${API_URL}/v2/activities?_format=json&user=${user}&group=${group}&followed=${followed}&page=${page + 1}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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
            //console.log('load activities', json)
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

const markAsRead = (token, id, type) => (dispatch, state) => {
    // console.log('marking as read', `${API_URL}/v2.2/feed`,
    // {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify([{id: id, type, is_read: "true"}])
    // });
        fetch(`${API_URL}/v2.2/feed`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{id: id, type, is_read: "true"}])
        }).then(r => {
            console.log('marking as read response', r)
            dispatch({type: 'DECREASE_NEWSFEED_COUNT'})
        }).catch(e => {
            console.log('marking as read error', e)
        })
}
const updateActivity = (payload) => (dispatch, state) => {
    dispatch({type: 'UPDATE_ACTIVITY', payload})
}


async function loadFriendsActivities(token, cursor): Promise<Action> {
    return getActivities2(token, null, null, '1', cursor, null, null);
        try {
        var response = await fetch(`${API_URL}/v2/activities?_format=json&followed=1&page=${page + 1}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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
                'Authorization': `Bearer ${token}`,
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
    //console.log('about to fetch => ' + `/v2.2/${entityType + 's'}/${entityId}?_format=json&&page=1&per_page=1`);
    // /api/v2/activities?petition_id=349&page=1&per_page=20
    return new Promise((resolve, reject) => {
        fetch(API_URL + `/v2.2/${entityType + 's'}/${entityId}?_format=json&&page=1&per_page=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
                'Authorization': `Bearer ${token}`,
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

function boostPost(type: string, postId: number, groupId: number, activityId: number): ThunkAction {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const members = await api.get(token, `/v2/groups/${groupId}`);
            const { total_members } = await members.json();
            
            if (typeof total_members !== 'number') {
                return;
            }
            
            showAlertYesNo(`All ${total_members} group members will get a notification about this item immediately. Are you sure? Use sparingly!`, async () => {
                const boost = await api.patch(token, `/v2/${type}s/${postId}`);
                if (boost.ok && boost.status === 200) {
                    // showToast('Boosted.');
                    console.log("boost Post/Petition API Success");
                    dispatch({ type: 'BOOST_ACTIVITY', id: activityId });
                } else {
                    // showToast('Boosting item failed.');
                    handleError(response);
                }
            });
        } catch (error) {
            console.log("boost Post/Petition API Error", error);
            handleError(error);
        }
    };
}



 const subscribeNotification = (token: string, id: number, activityId: number, type: string) => async (dispatch) => {
        LOG('Subscribe to notification API', id, type);
        const response = await api.put(token, `/v2/user/${type}s/${id}`);
        LOG(response)
        if (response.status === 204) {
            showToast('Notifications on');
            dispatch({
                type: 'ACTIVITY_NOTIFICATION_SUBSCRIBE',
                data: { id: activityId, type }
            })
        } else {
            showToast('Subscribe to post failed');
            console.warn('FAILED TO UNSUBSCRIBE, DISPATCHING EMPTY ACTION')
        }
}

const unsubscribeNotification = (token: string, id: number, activityId: number, type: string) => async (dispatch) => {
    LOG('Unsubscribe to notification API', id, type, token);
    const response = await api.delete(token, `/v2/user/${type}s/${id}`);
    //console.log('response', response)
    if (response.status === 204) {
        showToast('Notifications Muted');
        dispatch({
            type: 'ACTIVITY_NOTIFICATION_UNSUBSCRIBE',
            data: { id: activityId, type }
        })
    } else {
        showToast('Unsubscribing failed')
        console.warn('FAILED TO UNSUBSCRIBE, DISPATCHING EMPTY ACTION')
    }
}

async function markAsSpam(token: string, id: number, type: string): Promise<Action> {
    LOG('Mark as spam API', id);
    const response = await api.post(token, `/v2/${type}s/${id}/spam`);
    //console.log(response);
    if (response.ok){
        showToast(`The ${type} was reported.`)
    } else {
        showToast('Failed to report.')
    }
}

const saveOffSet = (pos) => (dispatch) => {
    //console.log('===>', pos)
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
    updateFeedFirstItem,
    updateActivity
}
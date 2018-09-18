
var { API_URL } = require('../PLEnv');
var { Action, ThunkAction } = require('./types');

async function loadBookmarks(token: string, page: ?number = 0, type: ?string = 'all'): Promise<Action> {
    try {
        var response = await fetch(`${API_URL}/bookmarks/list/${type}/${page + 1}?_format=json`, {
            method: 'GET',
            headers: {
                 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        if (json.total_items) {
            const action = {
                type: 'LOADED_BOOKMARKS',
                data: {
                    page: json.page,
                    totalPages: json.total_pages,
                    totalItems: json.total_items,
                    items: json.items,
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

function resetBookmarks(): ThunkAction {
    return (dispatch) => {
        return dispatch({
            type: 'RESET_BOOKMARKS',
        });
    };
}

module.exports = {
    loadBookmarks,
    resetBookmarks,
}
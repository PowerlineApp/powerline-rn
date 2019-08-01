/**
 * @providesModule PLApi
 * @flow
 */
import { API_URL } from '../PLEnv';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

const api = {
    _request: (method: Method, token: string, endpoint: string, data: ?object): Promise<any> => {
        let body = null;
        console.log('request: ', API_URL + endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body
        })
        if (data) {
            body = JSON.stringify(data);
        }
        return new Promise((resolve, reject) => {
            fetch(API_URL + endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body
            })
            .then(data => resolve(data))
            .catch(err => reject(err));
        });
    },
    get: (token: string, url: string): Promise<any> => {
        return api._request('GET', token, url);
    },
    post: (token: string, url: string, data: object): Promise<any> => {
        return api._request('POST', token, url, data);
    },
    delete: (token: string, url: string): Promise<any> => {
        return api._request('DELETE', token, url);
    },
    put: (token: string, url: string, data: object): Promise<any> => {
        return api._request('PUT', token, url, data);
    },
    patch: (token: string, url: string): Promise<any> => {
        return api._request('PATCH', token, url);
    },
};

export default api;
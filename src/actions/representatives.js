import { API_URL } from '../PLEnv';
import axios from 'axios';

function getRepresentatives(token, page, per_page){
    console.log(API_URL + '/representatives?_format=json&page='+page +'&per_page=' + per_page, token);
    console.log({
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json"
        }
    });
    return new Promise((resolve, reject) => {
        // axios.get(API_URL + '/representatives?_format=json&page='+page +'&per_page=' + per_page, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json'
        //     }   
        // }).then(r => {
        //     console.log(r);
        // }).catch(e => {
        //     console.log(e );
        // });

        let url = `${API_URL}` + '/representatives?_format=json&page='+page +'&per_page=' + per_page;
        console.log(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }).then(r => r.json())
        .then(data => console.log('test', data))
        .catch(e => console.log('test error', e));




        fetch(API_URL + '/representatives?_format=json&page='+page +'&per_page=' + per_page, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                "Accept": "application/json"
            }
        })
        .then((res) => res.ok && res.json())
        .then(data => {
            console.log('loading representatives on staging response', data);
            if (data){
                console.log("Representatives API call Success:", data);
                resolve(data);
            } else {
                reject(new Error('Invalid response' + JSON.stringify(data)));
            }
        })
        .catch(err => {
            console.log("Representatives API call Error", err);
            reject(err);
        });
    });
}

function loadRepresentatyInfo(token, representativeId, storageId){
    console.log('to the api: ', token, representativeId, storageId, ' \n', API_URL + '/representatives/info/' + representativeId + '/' + storageId);
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/representatives/info/' + representativeId + '/' + storageId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Load Info API call Success:", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Load Info API call Error", err);
            reject(err);
        });
    });
}

function loadCommittees(token, storageId){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/representatives/info/committee/' + storageId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Representative Commmit API Success:", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Representative Commit API Error", err);
            reject(err);
        });
    });
}

function loadSponsoredBills(token, storageId){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/representatives/info/sponsored-bills/' + storageId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Represenatative Sponsored API Success", data);
            resolve(data);
        })
        .catch(err => {
            console.log("Representative SponsoredBill API Error", err);
            reject(err);
        });
    });
}

module.exports = {
    getRepresentatives,
    loadRepresentatyInfo,
    loadCommittees,
    loadSponsoredBills
};
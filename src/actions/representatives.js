var { API_URL } =  require('../PLEnv');

function getRepresentatives(token, page, per_page){
    console.log(API_URL + '/representatives?_format=json&page='+page +'&per_page=' + per_page, token)
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/representatives?_format=json&page='+page +'&per_page=' + per_page, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            console.log("Representatives API call Success:", data);
            resolve(data);
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
                'token': token,
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
                'token': token,
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
        })
    });
}

function loadSponsoredBills(token, storageId){
    return new Promise((resolve, reject) => {
        fetch(API_URL + '/representatives/info/sponsored-bills/' + storageId, {
            method: 'GET',
            headers: {
                'token': token,
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
        })
    });
}

module.exports = {
    getRepresentatives,
    loadRepresentatyInfo,
    loadCommittees,
    loadSponsoredBills
};
var { API_URL, PER_PAGE } = require("../PLEnv");
var { Action, ThunkAction } = require("./types");
var FacebookSDK = require("FacebookSDK");
import api from "../utils/api";

const getAgency = token => {
  return new Promise((resolve, reject) => {
    console.log("Agency Token:", token);
    console.log("Agency Link:", `${API_URL}/v2.2/user/agency`);

    fetch(`${API_URL}/v2.2/user/agency`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.error("Res:", res);
        res.json();
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
};

const loadUserCards = token => {
  return new Promise((resolve, reject) => {
    console.warn("Load cards:");
    fetch(`${API_URL}/v2/cards`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => {
        console.error("Reject cards:", err);
        reject(err);
      });
  });
};

async function userAddCard(token, data) {
  console.log(API_URL + "/v2/cards", token, data);
  try {
    let res = await fetch(API_URL + "/v2/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    console.log("res on adding card", res);
    return res.json();
  } catch (error) {
    console.warn(error);
  }
}

const userRemoveCard = (token, id) => {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/v2/cards/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

async function loadUserProfile(token: string): Promise<Action> {
  try {
    var response = await fetch(`${API_URL}/v2/user?_format=json`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    var json = await response.json();
    if (json.full_name) {
      const action = {
        type: "LOADED_USER_PROFILE",
        data: json
      };
      return Promise.resolve(action);
    } else {
      return Promise.reject(json);
    }
  } catch (error) {
    // TEST PURPOSE:
    console.error(error);
    return Promise.reject(error);
  }
}

function loadUserData(token) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/v2/user?_format=json", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Load User Profile Success 2", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Load User Profile Error", err);
        reject(err);
      });
  });
}

function loadUserProfileById(token, id) {
  console.log(API_URL + "/v2/users/" + id);
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/v2/users/" + id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Load User Profile Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Load User Profile Error", err);
        reject(err);
      });
  });
}

function getInvites(token) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/v2/user/invites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get Invites API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Invites API Error", err);
        reject(err);
      });
  });
}

//for registering for push notifications with Powerline backend. NOT for OneSignal
function registerDevice(token, params) {
  // console.log('/this REGISTERING : ', token, params)
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/v2/devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(params)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Register Device API Success", JSON.stringify(data));
        resolve(data);
      })
      .catch(err => {
        console.log("Register Device API Error", JSON.stringify(err));
        reject(err);
      });
  });
}

function search(token, query) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/search?query=" + query, {
      method: "GET",
      headers: {
        "Content-Type": "application",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Search Results API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Search Results Error Error", err);
        reject(err);
      });
  });
}

async function getFriendsSuggestions(token: string) {
  const friendsIds = await FacebookSDK.getFriendsIds();
  const friends = await api.post(
    token,
    "/profile/facebook-friends",
    friendsIds
  );
  if (friends.status === 200) {
    return await friends.json();
  }
}

function getUserDiscountCode(token) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/v2/user/discount-code", {
      method: "GET",
      headers: {
        "Content-Type": "application",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("discount code API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("discount code Error", err);
        reject(err);
      });
  });
}

function updateUserProfile(token, data) {
  console.log("about to update user profile", API_URL + "/profile/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: data
  });
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        console.log("update User Profile API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("update User Profile Error", err);
        reject(err);
      });
  });
}
function blockUser(token, id) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + `/v2.2/user/blocked-users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {
        console.log("Block user success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Block user Error", err);
        reject(err);
      });
  });
}
function unblockUser(token, id) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + `/v2.2/user/blocked-users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(data => {
        console.log("Unblock user success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Unblock user Error", err);
        reject(err);
      });
  });
}

function getBlockedUsers(token) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + `/v2.2/user/blocked-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get blocked users success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("get blocked users Error", err);
        reject(err);
      });
  });
}

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

function getPrivacySettings(token) {
  return new Promise((resolve, reject) => {
    timeout(
      5000,
      fetch(API_URL + "/v2.2/user/privacy_settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
    )
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

function updatePrivacySettings(token, data) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/v2.2/user/privacy_settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

const setProfileSettings = (token, data) => {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/profile/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  getAgency,
  loadUserProfile,
  loadUserCards,
  userAddCard,
  userRemoveCard,
  loadUserProfileById,
  loadUserData,
  getInvites,
  registerDevice,
  search,
  getFriendsSuggestions,
  getUserDiscountCode,
  updateUserProfile,
  updatePrivacySettings,
  getPrivacySettings,
  blockUser,
  unblockUser,
  getBlockedUsers,
  setProfileSettings
};

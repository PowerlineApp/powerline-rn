import { Toast } from "native-base";
import { updateIsAvailable } from "../../services/driversocket";
export const PROFILE_UPDATED = "PROFILE_UPDATED";
export const SET_HOME_ADDRESS = "SET_HOME_ADDRESS";
export const PROFILE_PROGRESS = "PROFILE_PROGRESS";
import { Actions } from "react-native-router-flux";

var { API_URL } = require('../PLEnv');

export function profileUpdated(data) {
  return {
    type: PROFILE_UPDATED,
    payload: data
  };
}

export function profileProgress() {
  return {
    type: PROFILE_PROGRESS
  };
}

export function setHomeAddress(address) {
  return {
    type: SET_HOME_ADDRESS,
    payload: address
  };
}

export function updateAvailable(userDetails) {
  return (dispatch, getState) => {
    updateIsAvailable(userDetails);
  };
}

export function updateUserProfileAsync(userDetails, type, isPopNeeded = true) {
  return (dispatch, getState) => {
    userDetails.jwtAccessToken = getState().driver.appState.jwtAccessToken;
    fetch(`${API_URL}/api/users`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: userDetails.jwtAccessToken
      },
      body: JSON.stringify(userDetails)
    })
      .then(resp => resp.json())
      .then(data => {
        dispatch(profileUpdated(data));
        if (isPopNeeded) {
          Actions.pop();
          Toast.show({
            text: "Profile Updated",
            position: "bottom",
            duration: 1500
          });
        }
      })
      .catch(e => {
        console.log(e);
        Toast.show({
          text: "Error while updating profile",
          position: "bottom",
          duration: 1500
        });
      });
  };
}

export function updateUserFormsDetails(userDetails) {
  return (dispatch, getState) => {
    userDetails.jwtAccessToken = getState().driver.appState.jwtAccessToken;
    fetch(`${API_URL}/api/users`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: userDetails.jwtAccessToken
      },
      body: JSON.stringify(userDetails)
    })
      .then(resp => resp.json())
      .then(data => {
        dispatch(profileUpdated(data));
        Toast.show({
          text: "Updated",
          position: "bottom",
          duration: 1500
        });
      })
      .catch(e => {
        console.log(e, 'error heree');
        Toast.show({
          text: "Error while updating values",
          position: "bottom",
          duration: 1500
        });
      });
  };
}

export function updateUserProfilePicAsync(userDetails, type) {
  return (dispatch, getState) => {
    dispatch(profileProgress());
    userDetails.jwtAccessToken = getState().driver.appState.jwtAccessToken;
    const imageData = new FormData();
    imageData.append("image", {
      uri: userDetails.localUrl,
      name: `${userDetails.fname}.jpg`,
      type: "image/jpg"
    });
    imageData.append(userDetails);
    imageData.append("updateType", type);
    fetch(`${API_URL}/api/users/upload`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: userDetails.jwtAccessToken,
        updateType: type
      },
      body: imageData
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.success) {
          dispatch(profileUpdated(data));
          Toast.show({
            text: "Updated",
            position: "bottom",
            duration: 1500
          });
          type === "profile" ? null : Actions.pop();
        } else {
          Toast.show({
            text: "Error while updating profile",
            position: "bottom",
            duration: 1500
          });
        }
      })
      .catch(e => e);
  };
}

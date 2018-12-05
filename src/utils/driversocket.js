import { Toast } from "native-base";
import { storeObj } from "../setup";
import config from "../../config.js";
import {
  newRideRequest,
  socketDisconnected,
  syncDataAsync
} from "../actions/driver/home";
import { tripRequestUpdated } from "../actions/driver/pickRider";
import { tripStarted } from "../actions/driver/startRide";
import { newTripUpdate } from "../actions/driver/rateRider";
import { profileUpdated } from "../actions/driver/settings";
import { responseTimedOut } from "../actions/driver/rideRequest";
import "../UserAgent";

const io = require("socket.io-client");

let socket = null;
export function socketDriverInit() {
  const { dispatch, getState } = storeObj.store;
  socket = io(`${config.serverSideUrl}:${config.port}`, {
    jsonp: false,
    transports: ["websocket"],
    query: `token=${storeObj.store.getState().driver.appState.jwtAccessToken}`
  });
  socket.heartbeatTimeout = 10000; // reconnect if not received heartbeat for 17 seconds
  socket.on("connect", () => {
    if (getState().driver.appState.socketDisconnected) {
      dispatch(syncDataAsync(getState().driver.appState.jwtAccessToken));
    }
    dispatch(socketDisconnected(false));
  });
  socket.on("disconnect", () => {
    dispatch(socketDisconnected(true));
    socket.connect();
  });
  socket.on("requestDriver", tripRequest => {
    dispatch(newRideRequest(tripRequest));
  });
  socket.on("tripRequestUpdated", tripRequest => {
    dispatch(tripRequestUpdated(tripRequest));
  });
  socket.on("tripUpdated", trip => {
    dispatch(newTripUpdate(trip));
  });
  socket.on("responseTimedOut", () => {
    dispatch(responseTimedOut());
  });
  socket.on("updateAvailable", user => {
    const updateUser = Object.assign(
      {},
      {
        data: user
      }
    );
    dispatch(profileUpdated(updateUser));
    Toast.show({
      text: "Status Updated",
      position: "bottom",
      duration: 1500
    });
  });
}

export function updateIsAvailable(user) {
  socket.emit("updateAvailable", user);
}

export function updateLocation(user) {
  socket.emit("updateLocation", user);
}
export function requestDriverResponse(tripRequest) {
  socket.emit("requestDriverResponse", tripRequest);
}
export function tripRequestUpdate(tripRequest) {
  socket.emit("tripRequestUpdate", tripRequest);
}
export function startTrip(tripRequest, trip) {
  socket.emit("startTrip", tripRequest, trip => {
    storeObj.store.dispatch(tripStarted(trip));
  });
}
export function tripUpdate(trip) {
  socket.emit("tripUpdate", trip);
}

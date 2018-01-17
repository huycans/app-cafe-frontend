import { call, put, take } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  HAS_CHECK_NETWORK_STATUS,
  NETWORK_STATUS_CHANGE
} from "../actions/auth";

import { NetInfo } from "react-native";

//create a channel to listen to network changes and emit a signal when there is a change
const createNetInfoChannel = function createNetInfoChannel() {
  return eventChannel(emitter => {
    NetInfo.addEventListener("connectionChange", connectionInfo => {
      console.log("Network status is " + connectionInfo.type);
      if (connectionInfo.type === "none") {
        emitter({ isOnline: false });
      } else {
        emitter({ isOnline: true });
      }
      // yield put({type: HAS_CHECK_NETWORK_STATUS, status: ? connectionInfo.type === "none": })
    });
    const unsubscribe = () => {
      NetInfo.removeEventListener("connectionChange", () => {
        console.log("NetInfo unsub");
      });
    };
    return unsubscribe;
  });
};

//check for the device's network status
const checkNetworkStatus = function* checkNetworkStatus() {
  let isConnected = yield NetInfo.isConnected.fetch();
  console.log("Network status is " + (isConnected ? "online" : "offline"));
  yield put({
    type: HAS_CHECK_NETWORK_STATUS,
    status: isConnected
  });
};

// create a watcher for network status change
const watchOnNetworkStatusChange = function* watchOnNetworkStatusChange() {
  const NetInfoChan = yield call(createNetInfoChannel);
  try {
    while (true) {
      const newStatus = yield take(NetInfoChan); //is an object of type { isOnline: boolean }
      console.log("Caught netw change");
      yield put({ type: NETWORK_STATUS_CHANGE, status: newStatus.isOnline });
    }
  } finally {
    //if saga is terminated, close the channel
    NetInfoChan.close();
  }
};

export { createNetInfoChannel, checkNetworkStatus, watchOnNetworkStatusChange };

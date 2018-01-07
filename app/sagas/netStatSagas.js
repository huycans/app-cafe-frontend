import { call, put, take } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  HAD_CHECK_NETWORK_STATUS,
  NETWORK_STATUS_CHANGE
} from "../actions/auth";

import { NetInfo } from "react-native";

const createNetInfoChannel = function createNetInfoChannel() {
  return eventChannel(emitter => {
    NetInfo.addEventListener("connectionChange", connectionInfo => {
      console.log("Network status is " + connectionInfo.type);
      if (connectionInfo.type === "none") {
        emitter({ isOnline: false });
      } else {
        emitter({ isOnline: true });
      }
      // yield put({type: HAD_CHECK_NETWORK_STATUS, status: ? connectionInfo.type === "none": })
    });
    const unsubscribe = () => {
      NetInfo.removeEventListener("connectionChange", () => {});
    };
    return unsubscribe;
  });
};

const checkNetworkStatus = function* checkNetworkStatus() {
  let isConnected = yield NetInfo.isConnected.fetch();
  console.log("Network status is " + (isConnected ? "online" : "offline"));
  yield put({
    type: HAD_CHECK_NETWORK_STATUS,
    status: isConnected
  });
};
const watchOnNetworkStatusChange = function* watchOnNetworkStatusChange() {
  const NetInfoChan = yield call(createNetInfoChannel);
  while (true) {
    const newStatus = yield take(NetInfoChan); //is an object of type { isOnline: boolean }
    yield put({ type: NETWORK_STATUS_CHANGE, newStatus });
  }
};

export { createNetInfoChannel, checkNetworkStatus, watchOnNetworkStatusChange };

import {
  takeEvery,
  select,
  call,
  put,
  take,
  fork,
  all
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  CHECK_NETWORK_STATUS,
  CHECK_LOCAL_CACHE,
  CHECK_SIGNIN_REQUEST,
  HAD_CHECK_NETWORK_STATUS,
  CHECK_SIGNIN_RESULT,
  NETWORK_STATUS_CHANGE
} from "../actions/auth";

import { NetInfo } from "react-native";

function createNetInfoChannel() {
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
  });
}

function* checkNetworkStatus() {
  let isConnected = yield NetInfo.isConnected.fetch();
  console.log("Network status is " + (isConnected ? "online" : "offline"));
  yield put({ type: HAD_CHECK_NETWORK_STATUS, status: isConnected });
}

function* watchOnNetworkStatusChange() {
  const NetInfoChan = yield call(createNetInfoChannel);
  while (true) {
    const newStatus = yield take(NetInfoChan); //is an object { isOnline: boolean }
    yield put({ type: NETWORK_STATUS_CHANGE, newStatus });
  }
}

function* rootSaga() {
  yield all([
    takeEvery("CHECK_NETWORK_STATUS", checkNetworkStatus),
    fork(watchOnNetworkStatusChange)
  ]);
}

export default rootSaga;

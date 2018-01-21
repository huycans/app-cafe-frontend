import {
  takeEvery,
  select,
  call,
  put,
  take,
  fork,
  all,
  takeLatest
} from "redux-saga/effects";
import {
  CHECK_NETWORK_STATUS,
  SIGNIN_REQUEST,
  SIGNOUT_REQUEST,
  SIGNUP_REQUEST,
  FETCH_QR_CODE_REQUEST,
  FETCH_FB_FEED_REQUEST
} from "../actions/auth";
import { checkNetworkStatus, watchOnNetworkStatusChange } from "./netStatSagas";
import { startupSigninFlow, unsubscribe } from "./authSagas";
import { signin } from "./signinSagas";
import { signupSaga } from "./signupSaga";
import { signoutSaga } from "./signoutSaga";
import { fetchQRCode } from "./qrcodeSaga";
import { fbfeed } from "./newfeedSaga";

const rootSaga = function* rootSaga() {
  yield all([
    takeEvery(CHECK_NETWORK_STATUS, checkNetworkStatus),
    takeLatest(SIGNIN_REQUEST, signin),
    takeLatest(SIGNOUT_REQUEST, signoutSaga),
    takeLatest(SIGNUP_REQUEST, signupSaga),
    takeLatest(FETCH_QR_CODE_REQUEST, fetchQRCode),
    takeLatest(FETCH_FB_FEED_REQUEST, fbfeed),
    fork(watchOnNetworkStatusChange),
    fork(startupSigninFlow),
    fork(unsubscribe)
  ]);
};

export default rootSaga;

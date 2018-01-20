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
  FETCH_QR_CODE
} from "../actions/auth";
import { checkNetworkStatus, watchOnNetworkStatusChange } from "./netStatSagas";
import { startupSigninFlow, unsubscribe } from "./authSagas";
import { signin } from "./signinSagas";
import { signupSaga } from "./signupSaga";
import { signoutSaga } from "./signoutSaga";
import { fetchQRCode } from "./qrcodeSaga";
const rootSaga = function* rootSaga() {
  yield all([
    takeEvery(CHECK_NETWORK_STATUS, checkNetworkStatus),
    takeLatest(SIGNIN_REQUEST, signin),
    takeLatest(SIGNOUT_REQUEST, signoutSaga),
    takeLatest(SIGNUP_REQUEST, signupSaga),
    takeLatest(FETCH_QR_CODE, fetchQRCode),
    fork(watchOnNetworkStatusChange),
    fork(startupSigninFlow),
    fork(unsubscribe)
  ]);
};

export default rootSaga;

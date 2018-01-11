import {
  takeEvery,
  select,
  call,
  put,
  take,
  fork,
  all
} from "redux-saga/effects";
import {
  STARTUP_SIGNIN_REQUEST,
  CHECK_NETWORK_STATUS,
  SIGNING_IN,
  FIREBASE_UNSUBSCRIBE_FUNCTION_RECIEVED,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE
} from "../actions/auth";
import firebase from "../components/FirebaseInit/FirebaseInit";
import { checkNetworkStatus, watchOnNetworkStatusChange } from "./netStatSagas";

import { serverAuth } from "../components/FirebaseAuth/AuthFunctions";

// export function createUserStatChannel() {
//   return eventChannel(emitter => {
//     const unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
//       emitter({currentUser: currentUser});
//     });
//   });
// }

// export function* onUserStatusChange(){
//   let UserStatusChan = yield call(createUserStatChannel);
//   while (true){
//     const currentUser = yield take(UserStatusChan);
//     //logic to deal with when user status change
//     if (currentUser){
//       //user is signed in
//       yield put
//     }else {
//       //no one is signed in
//     }
//   }
// }

//the flow run when the app is started
const startupSigninFlow = function* startupSigninFlow() {
  while (true) {
    yield take(STARTUP_SIGNIN_REQUEST);
    console.log("Signing in");
    yield put({ type: SIGNING_IN });
    yield put({ type: CHECK_NETWORK_STATUS });
    try {
      let netStat = yield select(state => state.isOnline);
      console.log(netStat);
      if (netStat) {
        let user;
        //set up a listener channel for firebase.auth.onAuthStateChangedyie
        const unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
          user = currentUser;
        });
        if (user) {
          //if user is signed in
          yield serverAuth(user);
          yield put({ type: SIGNIN_SUCCESS, user, unsubscribe });
        } else {
          //no user is signed in
          yield put({ type: SIGNIN_FAILURE, message: "NOT_SIGNIN" });
        }
      } else {
        //checkLocalCache
      }
    } catch (error) {
      yield put({ type: SIGNIN_FAILURE, message: error.message });
    }
  }
};

const rootSaga = function* rootSaga() {
  yield all([
    takeEvery("CHECK_NETWORK_STATUS", checkNetworkStatus),
    fork(watchOnNetworkStatusChange),
    fork(startupSigninFlow)
  ]);
};
export default rootSaga;

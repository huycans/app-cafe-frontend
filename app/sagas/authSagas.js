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
  SIGNIN_SUCCESS,
  CACHE_CHECKED,
  UNSUBSCRIBE,
  HAS_CHECK_NETWORK_STATUS,
  signinFailure,
  signinSuccess
} from "../actions/auth";
import firebase from "../components/FirebaseInit/FirebaseInit";
import { savedName } from "../constants/constants";
import { serverAuth } from "../components/FirebaseAuth/AuthFunctions";
import { loadData } from "../components/Storage/Storage";
import { NavigationActions } from "react-navigation";

const checkLocalCache = function* checkLocalCache() {
  //check local cache
  try {
    let loadUserId = yield loadData(savedName.userIdFromServer);
    let loadSessionToken = yield loadData(savedName.sessionToken);
    //if loadUserId and loadSessionToken exist
    if (
      typeof loadUserId === "string" &&
      typeof loadSessionToken === "string"
    ) {
      //send them to cache
      yield put({
        type: CACHE_CHECKED,
        hasLocalCache: true,
        userId: loadUserId,
        sessionToken: loadSessionToken
      });
    } else {
      yield put({ type: CACHE_CHECKED, hasLocalCache: false });
    }
  } catch (error) {
    if (error.name === "NotFoundError") {
      yield put({ type: CACHE_CHECKED, hasLocalCache: false });
    }
  }
};

//used to unsubscribe firebase when unmounting
//only need to unsub with firebase because netinfo listener is automatically ended when close app -> end saga -> close channel
const unsubscribe = function* unsubscribe() {
  yield take(UNSUBSCRIBE);
  console.log("Unsubscribing");
  let firbaseUnsub = select(state => state.reducer.firebaseUnsubscribe);
  if (firbaseUnsub) firbaseUnsub();
};

//the flow run when the app is started
const startupSigninFlow = function* startupSigninFlow() {
  while (true) {
    yield take(STARTUP_SIGNIN_REQUEST);
    console.log("Signing in");
    yield put({ type: SIGNING_IN });
    yield put({ type: CHECK_NETWORK_STATUS });
    yield take(HAS_CHECK_NETWORK_STATUS);
    try {
      let netStat = yield select(state => state.reducer.isOnline);
      if (netStat) {
        let userFirebaseObj;
        //set up a listener channel for firebase.auth.onAuthStateChangedyie
        const unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
          userFirebaseObj = currentUser;
        });
        if (userFirebaseObj) {
          //if user is signed in
          //authenticate with server
          let userServerObj = yield call(serverAuth, userFirebaseObj);

          //load qr code from local storage
          let qrCode = yield loadData(savedName.qrCode);

          //add qr code to userServerObj
          userServerObj.qrCode = qrCode;

          //create user obj to send to store
          const user = { userFirebaseObj, userServerObj };
          //send user object and unsub func to store
          yield put(signinSuccess(user, unsubscribe));
          //navigate to MainDrawerStack
          yield put(
            NavigationActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({ routeName: "MainDrawerStack" })
              ]
            })
          );
        } else {
          console.log("No one is signed in");
          //no user is signed in
          yield put(signinFailure());
          yield put(
            NavigationActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({ routeName: "SigninAndSignup" })
              ]
            })
          );
        }
      } else {
        //there is no internet, check for local cache instead
        yield call(checkLocalCache);
        yield take(CACHE_CHECKED);

        let hasLocalCache = select(state => state.reducer.hasLocalCache);
        yield put(signinFailure("No Internet connection"));
        if (hasLocalCache) {
          //if local cache exist, navigate to MainDrawerStack
          yield put(
            NavigationActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({ routeName: "MainDrawerStack" })
              ]
            })
          );
        } else {
          //navigate to SigninAndSignup
          yield put(
            NavigationActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({ routeName: "SigninAndSignup" })
              ]
            })
          );
        }
      }
    } catch (error) {
      yield put(signinFailure(error.message));
    }
  }
};

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
export { startupSigninFlow, unsubscribe };

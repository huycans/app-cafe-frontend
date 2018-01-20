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
  SIGNIN_SUCCESS,
  signinFailure,
  signinSuccess,
  FETCH_QR_CODE,
  FETCH_QR_CODE_SUCCESS
} from "../actions/auth";

import {
  signinEmail,
  signinFb,
  signinGoogle
} from "../components/FirebaseAuth/AuthFunctions";

import { NavigationActions } from "react-navigation";

export const signin = function* signin(action) {
  const signinAction = NavigationActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({ routeName: "MainDrawerStack" })]
  });
  try {
    let user;
    switch (action.method) {
      case "EMAIL":
        user = yield call(signinEmail, action.data.email, action.data.password);
        yield put(signinSuccess(user));
        yield put({ type: FETCH_QR_CODE, userId: user.userServerObj.id });
        yield take(FETCH_QR_CODE_SUCCESS);
        yield put(NavigationActions.reset(signinAction));
        break;
      case "FACEBOOK":
        user = yield call(signinFb);
        yield put(signinSuccess(user));
        yield put({ type: FETCH_QR_CODE, userId: user.userServerObj.id });
        yield take(FETCH_QR_CODE_SUCCESS);
        yield put(NavigationActions.reset(signinAction));
        break;
      case "GOOGLE":
        user = yield call(signinGoogle);
        yield put(signinSuccess(user));
        yield put({ type: FETCH_QR_CODE, userId: user.userServerObj.id });
        yield take(FETCH_QR_CODE_SUCCESS);
        yield put(NavigationActions.reset(signinAction));
        break;
      default:
        throw Error("Invalid method");
    }
  } catch (errorMessage) {
    yield put(signinFailure(errorMessage));
  }
};

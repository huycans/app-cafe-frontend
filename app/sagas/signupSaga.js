import { call, put, take } from "redux-saga/effects";
import {
  signinFailure,
  signinSuccess,
  SIGNING_IN,
  FETCH_QR_CODE_REQUEST,
  FETCH_QR_CODE_SUCCESS
} from "../actions/auth";
import { signupEmail } from "../components/FirebaseAuth/AuthFunctions";
import { NavigationActions } from "react-navigation";

export const signupSaga = function* signupSaga(action) {
  try {
    yield put({ type: SIGNING_IN });
    let user = yield call(signupEmail, action.data.email, action.data.password);
    console.log("user", user);
    if (user === "none") {
      yield put(signinFailure("No user is signed in"));
      return;
    } else {
      yield put(signinSuccess(user));
      yield put({ type: FETCH_QR_CODE_REQUEST, userId: user.userServerObj.id });
      yield take(FETCH_QR_CODE_SUCCESS);
    }

    yield put(
      NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "MainDrawerStack" })]
      })
    );
  } catch (errorMessage) {
    yield put(signinFailure(errorMessage));
  }
};

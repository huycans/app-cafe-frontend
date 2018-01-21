import { put } from "redux-saga/effects";
import { signout } from "../components/FirebaseAuth/AuthFunctions";
import { NavigationActions } from "react-navigation";

export const signoutSaga = function* signoutSaga() {
  try {
    yield signout();
    yield put(
      NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: "SigninAndSignup" })]
      })
    );
  } catch (error) {
    console.log(error);
  }
};

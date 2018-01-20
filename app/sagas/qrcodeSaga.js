/**
 * @flow
 */

import { call, put } from "redux-saga/effects";
import { FETCH_QR_CODE_SUCCESS, FETCH_QR_CODE_FAILURE } from "../actions/auth";
import { URL, SERVER_API, savedName } from "../constants/constants";
import { storeData } from "../components/Storage/Storage";
/**
 * how qr code is fetch:
 * when user signing in for the first time, a FETCH_QR_CODE action is sent
 * when qr code arrives, it will be appended to userServerObj in store and saved in local storage
 * next time user automatic signin, qr code will be loaded from local storage
 */
async function fetchQR(userId: string): Promise<string> {
  try {
    let link = URL + SERVER_API.userinfo + "/" + userId + "/qr";
    let response = await fetch(link, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    let responseJSON = await response.json();

    if (responseJSON.status.httpStatus === 200) {
      //make sure there is content inside the response before return it to signin function
      return responseJSON.content;
    } else {
      console.log(responseJSON.message);
      throw responseJSON;
    }
  } catch (error) {
    console.log("Fetch qr failed", error);
    throw error.message;
  }
}

const fetchQRCode = function* fetchQRCode(action: Object): void {
  try {
    let qrString = yield call(fetchQR, action.userId);
    yield put({ type: FETCH_QR_CODE_SUCCESS, qrString });
    //store locally, for future uses
    storeData(savedName.qrCode, qrString);
  } catch (errorMessage) {
    yield put({ type: FETCH_QR_CODE_FAILURE, errorMessage });
  }
};

export { fetchQRCode };

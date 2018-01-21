import { SERVER_API } from "../constants/constants";
import { call, put } from "redux-saga/effects";
import { FETCH_FB_FEED_SUCCESS, FETCH_FB_FEED_FAILURE } from "../actions/auth";
import { URL } from "../constants/constants";

async function fetchFBFeed() {
  try {
    let link = URL + SERVER_API.feedfb;
    let newsfeed = await fetch(link, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    let newsfeedJSON = await newsfeed.json();
    return newsfeedJSON.content.data;
  } catch (error) {
    console.log("Retrieving newsfeed error: ", error);
    throw error;
  }
}

export const fbfeed = function* fbfeed() {
  try {
    let fbFeed = yield call(fetchFBFeed);
    yield put({ type: FETCH_FB_FEED_SUCCESS, fbFeed });
  } catch (error) {
    yield put({ type: FETCH_FB_FEED_FAILURE, errorMessage: error.message });
  }
};

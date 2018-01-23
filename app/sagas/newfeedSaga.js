import { SERVER_API } from "../constants/constants";
import { call, put } from "redux-saga/effects";
import {
  FETCH_FB_FEED_SUCCESS,
  FETCH_FB_FEED_FAILURE,
  FETCH_ADMIN_FEED_SUCCESS,
  FETCH_ADMIN_FEED_FAILURE
} from "../actions/auth";
import { URL } from "../constants/constants";

async function fetchFBFeed() {
  try {
    let link = URL + SERVER_API.feedfb;
    let fbfeed = await fetch(link, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    let fbfeedJSON = await fbfeed.json();
    return fbfeedJSON.content.data;
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

async function fetchAdminPost() {
  try {
    let link = URL + SERVER_API.feed;
    let adminfeed = await fetch(link, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    let adminfeedJSON = await adminfeed.json();
    return adminfeedJSON.content;
  } catch (error) {
    console.log("Retrieving newsfeed error: ", error);
  }
  console.log("getting");
}

export const adminfeed = function* adminfeed() {
  try {
    let adminFeed = yield call(fetchAdminPost);
    yield put({ type: FETCH_ADMIN_FEED_SUCCESS, adminFeed });
  } catch (error) {
    yield put({ type: FETCH_ADMIN_FEED_FAILURE, errorMessage: error.message });
  }
};

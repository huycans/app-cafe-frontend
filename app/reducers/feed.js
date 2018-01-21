import { FETCH_FB_FEED_SUCCESS } from "../actions/auth";

const initialState = {
  fbFeed: [],
  adminFeed: []
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FB_FEED_SUCCESS:
      return {
        ...state,
        fbFeed: action.fbFeed
      };
    case FETCH_FB_FEED_FAILURE:
      return {
        ...state
      };
  }
};

import {
  CHECK_NETWORK_STATUS,
  CHECK_LOCAL_CACHE,
  CHECK_SIGNIN_REQUEST,
  HAD_CHECK_NETWORK_STATUS,
  CHECK_SIGNIN_RESULT,
  FIREBASE_UNSUBSCRIBE
} from "../actions/auth";

const initialState = {
  isSignedIn: null,
  hasLocalCache: false,
  isOnline: false,
  hasCheckNetworkStatus: false,
  userInfo: {}
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_LOCAL_CACHE:
    case CHECK_SIGNIN_REQUEST:
    case HAD_CHECK_NETWORK_STATUS:
      return {
        ...state,
        status: action.status
      };
    case CHECK_SIGNIN_RESULT:
    case CHECK_NETWORK_STATUS:
    default:
      return state;
  }
};

export default reducers;

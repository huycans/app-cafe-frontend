import {
  CHECK_NETWORK_STATUS,
  CHECK_LOCAL_CACHE,
  CHECK_SIGNIN_REQUEST,
  HAS_CHECK_NETWORK_STATUS,
  CHECK_SIGNIN_RESULT,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  FIREBASE_UNSUBSCRIBE_FUNCTION_RECIEVED,
  NETWORK_STATUS_CHANGE
} from "../actions/auth";

const initialState = {
  isSignedIn: null,
  signingIn: true,
  hasLocalCache: false,
  isOnline: false,
  hasCheckNetworkStatus: false,
  userInfo: {},
  firebaseUnsubscribe: null,
  errorMessage: ""
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_LOCAL_CACHE:
    case CHECK_SIGNIN_REQUEST:
    case NETWORK_STATUS_CHANGE:
    case HAS_CHECK_NETWORK_STATUS:
      return {
        ...state,
        hasCheckNetworkStatus: true,
        isOnline: action.status
      };
    case SIGNIN_SUCCESS:
      return {
        ...state,
        userInfo: action.user,
        isSignedIn: true,
        hasLocalCache: true,
        signingIn: false,
        firebaseUnsubscribe: action.unsubscribe
      };
    case SIGNIN_FAILURE:
      return {
        ...state,
        userInfo: {},
        isSignedIn: false,
        hasLocalCache: false,
        signingIn: false,
        errorMessage: action.message
      };
    default:
      return state;
  }
};

export default reducers;

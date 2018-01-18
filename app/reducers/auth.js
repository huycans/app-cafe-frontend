import {
  CHECK_NETWORK_STATUS,
  CHECK_LOCAL_CACHE,
  CHECK_SIGNIN_REQUEST,
  HAS_CHECK_NETWORK_STATUS,
  CHECK_SIGNIN_RESULT,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  FIREBASE_UNSUBSCRIBE_FUNCTION_RECIEVED,
  NETWORK_STATUS_CHANGE,
  CACHE_CHECKED,
  SIGNIN_REQUEST
} from "../actions/auth";

const initialState = {
  isSignedIn: null,
  signingIn: true,
  hasLocalCache: false,
  isOnline: false,
  hasCheckNetworkStatus: false,
  firebaseUnsubscribe: null,
  errorMessage: "",
  userFirebaseObj: {}, //the user object recieved from firebase
  userServerObj: {} //the user object received from server
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case NETWORK_STATUS_CHANGE:
    case HAS_CHECK_NETWORK_STATUS:
      return {
        ...state,
        hasCheckNetworkStatus: true,
        isOnline: action.status
      };
    case SIGNIN_REQUEST:
      return {
        ...state,
        signingIn: true
      };
    case SIGNIN_SUCCESS:
      return {
        ...state,
        userFirebaseObj: action.user.userFirebaseObj,
        userServerObj: action.user.userServerObj,
        isSignedIn: true,
        hasLocalCache: true,
        signingIn: false,
        firebaseUnsubscribe: action.unsubscribe || null
      };
    case SIGNIN_FAILURE:
      return {
        ...state,
        userFirebaseObj: {},
        userServerObj: {},
        isSignedIn: false,
        hasLocalCache: false,
        signingIn: false,
        errorMessage: action.message
      };
    case CACHE_CHECKED:
      if (action.hasLocalCache === true)
        return {
          ...state,
          hasLocalCache: true,
          userFirebaseObj: {
            ...state.userFirebaseObj,
            userId: action.userId,
            sessionToken: action.sessionToken
          }
        };
      else
        return {
          ...state,
          hasLocalCache: false
        };
    case CHECK_LOCAL_CACHE:
    case CHECK_SIGNIN_REQUEST:
    default:
      return state;
  }
};

export default auth;

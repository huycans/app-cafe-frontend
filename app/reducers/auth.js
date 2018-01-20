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
  SIGNIN_REQUEST,
  FETCH_QR_CODE_SUCCESS,
  FETCH_QR_CODE_FAILURE,
  FETCH_QR_CODE
} from "../actions/auth";
import { fetchQRCode } from "../sagas/qrcodeSaga";

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
    case FETCH_QR_CODE:
      return {
        ...state,
        signingIn: true
      };
    case FETCH_QR_CODE_SUCCESS:
      return {
        ...state,
        signingIn: false,
        userServerObj: {
          ...state.userServerObj,
          qrCode: action.qrString
        }
      };
    case FETCH_QR_CODE_FAILURE:
      return {
        ...state,
        signingIn: false,
        errorMessage: "Failed to load QR code, please reload the app"
      };
    default:
      return state;
  }
};

export default auth;

/** */
export const CHECK_NETWORK_STATUS = "CHECK_NETWORK_STATUS"; //check for current netw status
export const HAS_CHECK_NETWORK_STATUS = "HAS_CHECK_NETWORK_STATUS"; //had the app check for netw status or not
export const NETWORK_STATUS_CHANGE = "NETWORK_STATUS_CHANGE"; // an event listener will emit this action when netw status change
export const checkNetworkStatus = () => ({
  type: CHECK_NETWORK_STATUS
});

export const hasCheckNetworkStatus = status => ({
  type: HAS_CHECK_NETWORK_STATUS,
  status
});

export const networkStatusChange = status => ({
  type: NETWORK_STATUS_CHANGE,
  status
});

/** */
export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const signupRequest = data => ({
  type: SIGNUP_REQUEST,
  data
});

export const SIGNIN_REQUEST = "SIGNIN_REQUEST"; //request for signing in
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNIN_FAILURE = "SIGNIN_FAILURE";
export const signinRequest = (method, data = null) => ({
  //prototype, maybe will change
  type: SIGNIN_REQUEST,
  method,
  data
});

export const signinSuccess = (user, unsubscribe = null) => ({
  type: SIGNIN_SUCCESS,
  user,
  ...unsubscribe //this property may or maynot exist, depends on whether unsubscribe is null or not
});

export const signinFailure = (message = "") => ({
  type: SIGNIN_FAILURE,
  message
});

export const SIGNING_IN = "SIGNING_IN"; //the app is signing the user in
export const STARTUP_SIGNIN_REQUEST = "STARTUP_SIGNIN_REQUEST"; //start the process to check if user is signed in or not at startup

export const startupSigninRequest = () => ({
  type: STARTUP_SIGNIN_REQUEST
});

export const CHECK_LOCAL_CACHE = "CHECK_LOCAL_CACHE";
export const CACHE_CHECKED = "CACHE_CHECKED";
export const cacheChecked = hasLocalCache => ({
  type: CACHE_CHECKED,
  hasLocalCache
});
export const SAVE_CACHE = "SAVE_CACHE";
export const saveCache = (key, data) => ({
  type: SAVE_CACHE,
  key,
  data
});

export const FETCH_QR_CODE_REQUEST = "FETCH_QR_CODE_REQUEST";
export const FETCH_QR_CODE_SUCCESS = "FETCH_QR_CODE_SUCCESS";
export const FETCH_QR_CODE_FAILURE = "FETCH_QR_CODE_FAILURE";

export const FETCH_FB_FEED_REQUEST = "FETCH_FB_FEED_REQUEST";
export const FETCH_FB_FEED_SUCCESS = "FETCH_FB_FEED_SUCCESS";
export const FETCH_FB_FEED_FAILURE = "FETCH_FB_FEED_FAILURE";

export const FETCH_ADMIN_FEED_REQUEST = "FETCH_ADMIN_FEED_REQUEST";
export const FETCH_ADMIN_FEED_SUCCESS = "FETCH_ADMIN_FEED_SUCCESS";
export const FETCH_ADMIN_FEED_FAILURE = "FETCH_ADMIN_FEED_FAILURE";

export const SIGNOUT_REQUEST = "SIGNOUT_REQUEST";
export const signoutRequest = () => ({
  type: SIGNOUT_REQUEST
});
export const UNSUBSCRIBE = "UNSUBSCRIBE"; // unsubscribe from firbase and netinfo
export const unsubscribe = () => ({
  type: UNSUBSCRIBE
});

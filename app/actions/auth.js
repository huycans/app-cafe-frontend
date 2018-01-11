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

export const SIGNIN_REQUEST = "SIGNIN_REQUEST"; //request for signing in
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNIN_FAILURE = "SIGNIN_FAILURE";
export const signinRequest = data => ({
  //prototype, maybe will change
  type: SIGNIN_REQUEST,
  data
});

export const SIGNING_IN = "SIGNING_IN"; //the app is signing the user in
export const STARTUP_SIGNIN_REQUEST = "STARTUP_SIGNIN_REQUEST"; //start the process to check if user is signed in or not at startup

export const signingIn = () => ({
  type: SIGNING_IN
});
export const startupSigninRequest = () => ({
  type: STARTUP_SIGNIN_REQUEST
});

export const CHECK_LOCAL_CACHE = "CHECK_LOCAL_CACHE";
export const CACHE_LOADED = "CACHE_LOADED";

export const UNMOUNTING = "UNMOUNTING"; // unsubscribe from firbase and netinfo

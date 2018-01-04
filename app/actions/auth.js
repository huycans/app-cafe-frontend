export const CHECK_NETWORK_STATUS = "CHECK_NETWORK_STATUS";
export const HAD_CHECK_NETWORK_STATUS = "HAD_CHECK_NETWORK_STATUS";
export const NETWORK_STATUS_CHANGE = "NETWORK_STATUS_CHANGE";
//user data should be saved locally when CHECK_SIGNIN_REQUEST is done
// export const FETCH_USER_INFO_REQUEST = "FETCH_USER_INFO_REQUEST";
// export const FETCH_USER_INFO_FAILURE = "FETCH_USER_INFO_FAILURE";
// export const FETCH_USER_INFO_SUCCESS = "FETCH_USER_INFO_SUCCESS";

export const CHECK_SIGNIN_REQUEST = "CHECK_SIGNIN_REQUEST";
export const CHECK_SIGNIN_RESULT = "CHECK_SIGNIN_RESULT";

export const CHECK_LOCAL_CACHE = "CHECK_LOCAL_CACHE";
export const CACHE_LOADED = "CACHE_LOADED";

export const FIREBASE_UNSUBSCRIBE = "FIREBASE_UNSUBSCRIBE";

export const checkNetworkStatus = () => ({
  type: CHECK_NETWORK_STATUS
});

export const hadCheckNetworkStatus = status => ({
  type: HAD_CHECK_NETWORK_STATUS,
  status
});

export const checkIfSignin = () => ({
  type: CHECK_SIGNIN_REQUEST
});

export const hadCheckSignin = user => ({
  type: CHECK_SIGNIN_RESULT,
  user
});

export const checkLocalCache = () => ({
  type: CHECK_LOCAL_CACHE
});

export const cacheLoad = cache => ({
  type: CACHE_LOADED,
  cache
});

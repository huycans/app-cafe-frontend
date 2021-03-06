//constants for api access
const PROTOCOL = "http://";
// const PROTOCOL = "http://";
// const SERVER_IP = "192.168.137.1:8080";
const SERVER_IP = "35.229.49.111:5003";
// const SERVER_IP = "morning-headland-89461.herokuapp.com";
const SERVER_LINK = "/ebolo-app-cafe/rest-api";
const SERVER_API = {
  auth: "/auth",
  feedfb: "/feed/fb",
  feed: "/feed",
  userinfo: "/user/info"
};
let URL = PROTOCOL + SERVER_IP + SERVER_LINK;

const timePeriod = {
  oneMonth: 1000 * 3600 * 24 * 30,
  oneDay: 1000 * 3600 * 24,
  oneWeek: 1000 * 3600 * 24 * 7
};

const savedName = {
  userIdFromServer: "userIdFromServer",
  userKeyFromServer: "userKeyFromServer",
  sessionToken: "sessionToken",
  FCMkey: "FCMkey",
  newsfeed: "newsfeed",
  qrCode: "qrCode"
};

export { URL, SERVER_API, timePeriod, savedName };

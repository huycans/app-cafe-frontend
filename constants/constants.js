//constants for api access
const PROTOCOL = 'https://';
//const SERVER_IP = '10.0.0.1:8080';
const SERVER_IP = 'morning-headland-89461.herokuapp.com';
const SERVER_LINK = '/ebolo-app-cafe/rest-api';
const SERVER_API = '/auth';
let URL = PROTOCOL + SERVER_IP + SERVER_LINK + SERVER_API;

const timePeriod = {
    oneMonth: 1000*3600*24*30,
    oneDay: 1000*3600*24,
    oneWeek: 1000*3600*24*7
};

const savedName = {
    userIdFromServer : 'userIdFromServer',
    sessionToken: "sessionToken"
};

const baseFontSize = 16;
export {URL, timePeriod, savedName, baseFontSize};
//constants for api access
const PROTOCOL = 'http://';
const SERVER_IP = '10.0.0.1:8080';
//const SERVER_IP = 'ebolocafeapp.azurewebsites.net';
const SERVER_LINK = '/ebolo-app-cafe/rest-api';
const SERVER_API = '/auth';
let URL = PROTOCOL + SERVER_IP + SERVER_LINK + SERVER_API;
export default URL;
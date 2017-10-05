import RNFirebase from 'react-native-firebase';
var config = {
  
    apiKey: "AIzaSyCHZyeWflrZJkJVbR_xiwSBYuwqdF3PBK0",
    authDomain: "app-cafe.firebaseapp.com",
    databaseURL: "https://app-cafe.firebaseio.com",
    projectId: "app-cafe",
    storageBucket: "app-cafe.appspot.com",
    messagingSenderId: "301035346897"
  };
  
const configurationOptions = {
  debug: true,
  errorOnMissingPlayServices: true,
  promptOnMissingPlayServices: true
};
const  firebase = RNFirebase.initializeApp(configurationOptions);
//firebase.auth().useDeviceLanguage(); 
export default firebase;
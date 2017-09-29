import RNFirebase from 'react-native-firebase';
const configurationOptions = {
  debug: true,
  errorOnMissingPlayServices: true,
  promptOnMissingPlayServices: true
};
const  firebase = RNFirebase.initializeApp(configurationOptions);
//firebase.auth().useDeviceLanguage(); 
export default firebase;

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TextInput,
    Button
} from 'react-native';
import { StackNavigator } from 'react-navigation'
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
/**Firebase initilization is done in firebase.js level */
//import * as firebase from "firebase";
import firebase from '../firebase/firebase.js';

//constants for api access
const serverIp = '172.16.4.209:8080';
const serverLink = '/ebolo-app-cafe/rest-api';
const api = '/auth';
let uri = 'http://' + serverIp + serverLink + api;

async function verifyToken(token) {
    try {
        let response = await fetch(uri, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({
                "clientIdToken": tokenEmail,
                "fcmKey": "string"
            })
        });
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
}

//the first screen that welcome the user when they are not signed in
class SigninAndSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        }

        this.signinFb = this.signinFb.bind(this);
        this.signinGoogle = this.signinGoogle.bind(this);
        this.signupEmail = this.signupEmail.bind(this);
        this.handleInputEmail = this.handleInputEmail.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
    }

    componentDidMount() {
        this.setupGoogleSignin();
    }

    handleInputEmail(text) {
        this.setState({ email: text });
    }

    handleInputPassword(text) {
        this.setState({ password: text });
    }

    async signinFb() {
        //navigation function, passed down by StackNavigator, used to navigate to other screens
        const { navigate } = this.props.navigation;

        LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                console.log('Trying to log in');
                if (result.isCancelled) {
                    return Promise.resolve('cancelled');
                }
                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                if (data === 'cancelled') return Promise.resolve(data);
                // create a new firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

                // login with credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                if (currentUser === 'cancelled') {
                    console.log('Login cancelled');
                } else {
                    // now signed in
                    //console.warn(JSON.stringify(currentUser.toJSON()));
                    console.log(currentUser);
                    //send currentUser to server
                    //...

                    navigate('SignedIn');
                }
            })
            .catch((error) => {
                console.log(`Login fail with error: ${error}`);
                var errorCode = error.code;
                var errorMessage = error.message;
                this.setState({ errorMessage: errorMessage });
            });
    }
    //google signin must be configure before login
    async setupGoogleSignin() {
        try {
            await GoogleSignin.hasPlayServices({ autoResolve: true });
            //this method is mandatory
            await GoogleSignin.configure({
                webClientId: '301035346897-gbeg8ouav7fbpb28c3q3lk34qoskvrno.apps.googleusercontent.com',
                offlineAccess: false
            });
        }
        catch (err) {
            console.log("Play services error", err.code, err.message);
        }
    }

    async signinGoogle() {
        const { navigate } = this.props.navigation;

        try {
            //This method give you the current user if already login or null if not yet signin.
            const user = await GoogleSignin.currentUserAsync();
            if (user == null) {
                user = await GoogleSignin.signIn();
            }
            console.log('Successful signin with user: ${user}');

            //link to google firebase
            const credential = firebase.auth.GoogleAuthProvider.credential(user.idToken);
            let data = await firebase.auth().signInWithCredential(credential);
            if (data) navigate('SignedIn');
            //send to server
            //verifyToken(token);
        }
        catch (err) {
            console.log('error when signing in', err);
        }
    }

    async signupEmail() {
        const { navigate } = this.props.navigation;
        const email = this.state.email;
        const pass = this.state.password;
        try {
            await firebase.auth()
                .createUserWithEmailAndPassword(email, pass);
            navigate('EmailSignin');
        } catch (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            // [END_EXCLUDE]
        }
    }


    render() {
        const { navigate } = this.props.navigation;
        const errorDisplay = this.state.errorMessage !== ''
            ? <Text style={styles.error}>{this.state.errorMessage}</Text>
            : null;
        return (
            <View style={styles.container}>

                <TouchableHighlight style={styles.button} onPress={this.signinFb} underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.instructions}>Sign in with Facebook</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.button} onPress={this.signinGoogle} underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.instructions}>Sign in with Google</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.button} onPress={() => navigate('EmailSignin')} underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.instructions}>Sign in with Email</Text>
                </TouchableHighlight>

                <Text style={styles.bold}> OR </Text>
                <Text style={styles.bold}>Sign up with Email</Text>
                <TextInput autoCorrect={false} placeholder="Email" style={styles.input} keyboardType={'email-address'}
                    onChangeText={(text) => this.handleInputEmail(text)}
                    value={this.state.email} />

                <TextInput autoCorrect={false} placeholder="Password" style={styles.input}
                    onChangeText={(text) => this.handleInputPassword(text)}
                    value={this.state.password}
                    secureTextEntry={true} />

                <TouchableHighlight style={styles.button} onPress={this.signupEmail} underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.instructions}>Sign up</Text>
                </TouchableHighlight>

                <Text>email is {this.state.email}</Text>
                <Text>password is {this.state.password}</Text>
                {errorDisplay}

            </View>
        );
    }
}

//screen used for signing in
class EmailSignin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        }
        this.signInEmail = this.signInEmail.bind(this);
        this.handleInputEmail = this.handleInputEmail.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
    }

    handleInputEmail(text) {
        this.setState({ email: text });
    }

    handleInputPassword(text) {
        this.setState({ password: text });
    }

    async signInEmail(email, pass) {
        const { navigate } = this.props.navigation;
        const authResult = null;
        try {
            const authResult = await firebase.auth()
                .signInWithEmailAndPassword(email, pass);
            const tokenEmail = await authResult.getIdToken();
            console.log(tokenEmail);
            verifyToken(tokenEmail);
            //go to the signed in screen
            navigate('SignedIn');
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            this.setState({ errorMessage: errorMessage });
            console.log(this.state.errorMessage);
        }
    }


    render() {
        const { navigate } = this.props.navigation;
        const errorDisplay = this.state.errorMessage !== ''
            ? <Text style={styles.error}>{this.state.errorMessage}</Text>
            : null;
        console.log('error' + errorDisplay);
        return (
            <View style={styles.container} >
                <TextInput autoCorrect={false} placeholder="Email" style={styles.input} keyboardType={'email-address'}
                    onChangeText={(text) => this.handleInputEmail(text)}
                    value={this.state.email} />

                <TextInput autoCorrect={false} placeholder="Password" style={styles.input}
                    onChangeText={(text) => this.handleInputPassword(text)}
                    value={this.state.password}
                    secureTextEntry={true} />

                <TouchableHighlight style={styles.button}
                    onPress={() => this.signInEmail(this.state.email, this.state.password)}
                    underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.instructions}>Sign in</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.button}
                    onPress={() => navigate('SigninAndSignup')}
                    underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.instructions}>Go back</Text>
                </TouchableHighlight>
                {errorDisplay}
            </View>
        );
    }
}

class SignedIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
        }
        this.signout = this.signout.bind(this);
    }

    async signout() {
        const { navigate } = this.props.navigation;
        try {
            await firebase.auth().signOut();
            console.log('User has signed out');
            // Navigate to welcome screen
            navigate('SigninAndSignup');
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            this.setState({ errorMessage: errorMessage });
            console.log(this.state.errorMessage);
        }
    }

    render() {
        return (
            <View>
                <Text>You are Signed in</Text>
                <Button title="Sign out" onPress={this.signout} />
            </View>
        );
    }
}

const createNavigationalScreens = (signedIn = false) => {
    return StackNavigator({
        SigninAndSignup: {
            screen: SigninAndSignup,
            navigationOptions: {
                title: "Welcome",
                headerLeft: null
            }
        },
        EmailSignin: {
            screen: EmailSignin,
            navigationOptions: {
                title: "Sign In",
                headerLeft: null
            }
        },
        SignedIn: {
            screen: SignedIn,
            navigationOptions: {
                title: 'You are Signed in',
                headerLeft: null
            }
        }
    },
        { initialRouteName: signedIn ? 'SignedIn' : 'SigninAndSignup' }
    );
};

const baseFontSize = 16;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    bold: {
        fontSize: baseFontSize + 5,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
        fontSize: baseFontSize
    },
    button: {
        backgroundColor: "#42f4eb",
        borderRadius: 10,
        margin: 5,
        padding: 5
    },
    input: {
        width: 200
    },
    error: {
        marginBottom: 5,
        textAlign: 'center',
        color: 'red',
        fontSize: baseFontSize + 10,
    }
});

export default createNavigationalScreens;
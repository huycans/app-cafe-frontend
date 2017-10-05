import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TextInput,
    Button,
    Image,
    KeyboardAvoidingView,

} from 'react-native';
import { StackNavigator } from 'react-navigation';
import authFunctions from '../FirebaseAuth/FirebaseAuth.js';

//the first screen that welcome the user when they are not signed in
class SigninAndSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.handleInputEmail = this.handleInputEmail.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
    }

    componentDidMount() {
        authFunctions.setupGoogleSignin();
    }

    handleInputEmail(text) {
        this.setState({ email: text });
    }

    handleInputPassword(text) {
        this.setState({ password: text });
    }

    render() {
        const { navigate } = this.props.navigation;
        const email = this.state.email;
        const password = this.state.password;

        return (

            <Image source={require('../../img/vertical-background.png')}
                style={styles.container} >
                <View style={{
                    flex: 1, marginTop: 250, backgroundColor: 'white',
                    borderRadius: 6, padding: 10, 
                }}>
                    <TextInput autoCorrect={false} placeholder="Email" style={styles.input} keyboardType={'email-address'}
                        onChangeText={(text) => this.handleInputEmail(text)}
                        value={this.state.email} />
                    <TextInput autoCorrect={false} placeholder="Password" style={styles.input}
                        onChangeText={(text) => this.handleInputPassword(text)}
                        value={this.state.password}
                        secureTextEntry={true} />
                    <TouchableHighlight
                        style={[styles.button,
                        { backgroundColor: "#cccc00", minWidth: 100, marginTop: 15 }]}
                        onPress={(email, password, navigate) => authFunctions.signinEmail()} underlayColor="transparent" activeOpacity={0.5}>
                        <Text style={styles.baseText}>Sign in</Text>
                    </TouchableHighlight>

                </View>

                <View style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                    <TouchableHighlight style={styles.button} onPress={(navigate) => authFunctions.signinFb()} underlayColor="transparent" activeOpacity={0.5}>
                        <Image source={require('../../img/facebookLogo.png')} style={{ width: 60, height: 60 }} />
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={(navigate) => authFunctions.signinGoogle()} underlayColor="transparent" activeOpacity={0.5}>
                        <Image source={require('../../img/googleLogo.png')} style={{ width: 60, height: 60 }} />
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between' }} >
                    <TouchableHighlight style={[styles.button, { flex: 1 }]} onPress={() => navigate("EmailSignup")} underlayColor="transparent" activeOpacity={0.5}>
                        <Text style={styles.smallText}>Don't have an account?</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.button, { flex: 1 }]} onPress={() => alert('nothing yet')} underlayColor="transparent" activeOpacity={0.5}>
                        <Text style={styles.smallText}>Forgot password?</Text>
                    </TouchableHighlight>
                </View>
            </Image >
        );
    }
}

//screen used for signing in
class EmailSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.handleInputEmail = this.handleInputEmail.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
    }

    handleInputEmail(text) {
        this.setState({ email: text });
    }

    handleInputPassword(text) {
        this.setState({ password: text });
    }

    render() {
        const { navigate } = this.props.navigation;
        const { email, password } = this.state;
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
                    onPress={() => authFunctions.signupEmail(email, password)}
                    underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.baseText}>Sign up</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.button}
                    onPress={() => navigate('SigninAndSignup')}
                    underlayColor="white" activeOpacity={0.5}>
                    <Text style={styles.baseText}>Go back</Text>
                </TouchableHighlight>

            </View>
        );
    }
}

class SignedIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
        };
        this.signout = this.signout.bind(this);
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
                headerLeft: null,
                header: null
            }
        },
        EmailSignup: {
            screen: EmailSignup,
            navigationOptions: {
                title: "Sign In",
                header: null
            }
        },
        SignedIn: {
            screen: SignedIn,
            navigationOptions: {
                title: 'You are Signed in',
                header: null
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
        flexDirection: 'column',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    baseText: {
        textAlign: 'center',
        color: 'white',
        fontSize: baseFontSize
    },
    smallText: {
        textAlign: 'center',
        color: 'white',
        fontSize: baseFontSize - 4
    },
    button: {
        borderRadius: 6,
        margin: 5,
        padding: 5
    },
    input: {
        backgroundColor: 'white',
        width: 250,
        alignItems: 'center',
        borderRadius: 4
    },
    error: {
        marginBottom: 5,
        textAlign: 'center',
        color: 'red',
        fontSize: baseFontSize + 10,
    }
});

export default createNavigationalScreens;
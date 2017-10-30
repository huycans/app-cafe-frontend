//@flow
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TextInput,
    Button,
    Image,
} from 'react-native';
import { StackNavigator, NavigationActions  } from 'react-navigation';
import { signinFb, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout } from '../FirebaseAuth/AuthFunctions.js';
import styles from './Styles';
import {baseFontSize} from '../../constants/constants';
import SignedInDrawer from './SignedInDrawer';
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
        setupGoogleSignin();
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
                    flex: 0.5, marginTop: 250, backgroundColor: 'white',
                    borderRadius: 6, padding: 10,
                }}>
                    <TextInput autoCorrect={false} placeholder="Email" style={[styles.input, { backgroundColor: "white" }]} keyboardType={'email-address'}
                        onChangeText={(text) => this.handleInputEmail(text)}
                        value={this.state.email} />
                    <TextInput autoCorrect={false} placeholder="Password" style={[styles.input, { backgroundColor: "white" }]}
                        onChangeText={(text) => this.handleInputPassword(text)}
                        value={this.state.password}
                        secureTextEntry={true} />
                    <TouchableHighlight
                        style={[styles.button,
                        { backgroundColor: "#cccc00", minWidth: 100, marginTop: 15 }]}
                        onPress={() => signinEmail(email, password, navigate)} underlayColor="transparent" activeOpacity={0.5}>
                        <Text style={styles.baseText}>Sign in</Text>
                    </TouchableHighlight>

                </View>

                <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                    <TouchableHighlight style={styles.button} onPress={() => signinFb(navigate)} underlayColor="transparent" activeOpacity={0.5}>
                        <Image source={require('../../img/facebookLogo.png')} style={{ width: 60, height: 60 }} />
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={() => signinGoogle(navigate)} underlayColor="transparent" activeOpacity={0.5}>
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
            validationError:''
        };
        this.handleInputEmail = this.handleInputEmail.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    handleInputEmail(text) {
        this.setState({ email: text });
    }

    handleInputPassword(text) {
        this.setState({ password: text });
    }

    validateInput(){
        const { navigate } = this.props.navigation;
        const { email, password } = this.state;
        //use regex to test email input
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(this.state.email) ) {
            if (this.state.password.length > 5){
                this.setState({validationError: ''});
                signupEmail(email, password, navigate);
            }
            else{
                this.setState({validationError: 'Password must be at least 6 characters'});
            }
        }
        else {
            this.setState({validationError: 'Invalid email address'});
        }
        
    }
    render() {
        const { navigate } = this.props.navigation;
        const validationError = <Text style={{textAlign: 'center', color: 'red'}} >{this.state.validationError} </Text>;
        return (
            <Image source={require('../../img/signup_bg_vertical.png')}
                style={styles.container} >
                <View style={{
                    flex: 0.6, marginTop: 250,
                    borderRadius: 6, padding: 10,
                }}>
                    <TextInput autoCorrect={false} placeholder="email@email.com" style={[styles.input, styles.signupInput]} keyboardType={'email-address'}
                        onChangeText={(text) => this.handleInputEmail(text)}
                        value={this.state.email} placeholderTextColor='white' />

                    <TextInput autoCorrect={false} placeholder="your password" style={[styles.input, styles.signupInput]}
                        onChangeText={(text) => this.handleInputPassword(text)}
                        value={this.state.password}
                        secureTextEntry={true} placeholderTextColor='white' />

                    <View style={{ marginTop: 20 }} >
                        <TouchableHighlight
                            style={[styles.button, { backgroundColor: '#DCCC32', borderRadius: 20, }]}
                            onPress={() => this.validateInput()}
                            underlayColor="transparent" activeOpacity={0.5}>
                            <Text style={[styles.baseText, { fontSize: baseFontSize + 8 }]}>Sign up</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={[styles.button, { borderRadius: 20, backgroundColor: 'transparent' ,borderWidth: 2 ,borderColor: 'white', borderStyle: 'solid' }]}
                            onPress={() => this.props.navigation.goBack()}
                            underlayColor="transparent" activeOpacity={0.5}>
                            <Text style={[styles.baseText, { fontSize: baseFontSize + 8, }]}>Go back</Text>
                        </TouchableHighlight>
                        
                    </View>
                    {validationError}
                </View>
            </Image>
        );
    }
}


const createNavigationalScreens = (hasLocalCache) => {
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
        SignedInDrawer: {
            screen: SignedInDrawer,
            navigationOptions: {
                title: 'You are Signed in',
                header: null
            }
        }
    },
        { initialRouteName: (hasLocalCache) ? 'SignedInDrawer' : 'SigninAndSignup' }
    );
};

export default createNavigationalScreens;
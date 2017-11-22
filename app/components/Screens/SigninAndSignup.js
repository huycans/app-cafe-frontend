//@flow
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    TextInput,
    Image
} from 'react-native';
import { signinFb, setupGoogleSignin, signinGoogle, signinEmail } from '../FirebaseAuth/AuthFunctions.js';
import styles from './Styles.js';

type PropType = {
    navigation: () => {}
};
type StateType = {
    email: string,
    password: string
};

//the first screen that welcome the user when they are not signed in
export default class SigninAndSignup extends Component<PropType, StateType> {
    constructor(props: PropType) {
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

    handleInputEmail(text: string) {
        this.setState({ email: text });
    }

    handleInputPassword(text: string) {
        this.setState({ password: text });
    }


    render(): void {
        const { navigation } = this.props;

        const {email, password} = this.state;
        return (
            <Image source={require('../../img/vertical-background.png')}
                style={styles.container} >
                <View style={{
                    flex: 0.5, marginTop: 250, backgroundColor: 'white',
                    borderRadius: 6, padding: 10,
                }}>
                    <TextInput autoCorrect={false} placeholder="Email" style={[styles.input, { backgroundColor: "white" }]} keyboardType={'email-address'}
                        onChangeText={(text: string): void => this.handleInputEmail(text)}
                        value={this.state.email} />
                    <TextInput autoCorrect={false} placeholder="Password" style={[styles.input, { backgroundColor: "white" }]}
                        onChangeText={(text: string): void => this.handleInputPassword(text)}
                        value={this.state.password}
                        secureTextEntry={true} />
                    <TouchableHighlight
                        style={[styles.button,
                        { backgroundColor: "#cccc00", minWidth: 100, marginTop: 15 }]}
                        onPress={(): void => signinEmail(email, password, navigation)} underlayColor="transparent" activeOpacity={0.5}>
                        <Text style={styles.baseText}>Sign in</Text>
                    </TouchableHighlight>

                </View>

                <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                    <TouchableHighlight style={styles.button} onPress={(): void => signinFb(navigation)} underlayColor="transparent" activeOpacity={0.5}>
                        <Image source={require('../../img/facebookLogo.png')} style={{ width: 60, height: 60 }} />
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={(): void => signinGoogle(navigation)} underlayColor="transparent" activeOpacity={0.5}>
                        <Image source={require('../../img/googleLogo.png')} style={{ width: 60, height: 60 }} />
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between' }} >
                    <TouchableHighlight style={[styles.button, { flex: 1 }]} onPress={(): void => navigation.navigate("EmailSignup")} underlayColor="transparent" activeOpacity={0.5}>
                        <Text style={styles.smallText}>Don't have an account?</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.button, { flex: 1 }]} onPress={(): void => alert('nothing yet')} underlayColor="transparent" activeOpacity={0.5}>
                        <Text style={styles.smallText}>Forgot password?</Text>
                    </TouchableHighlight>

                </View>
            </Image >
        );
    }
}
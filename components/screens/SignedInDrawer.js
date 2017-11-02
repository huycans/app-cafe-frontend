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
import { DrawerNavigator, NavigationActions } from 'react-navigation';
import { signinFb, verifyToken, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout } from '../FirebaseAuth/AuthFunctions.js';

class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //use signoutAction var to reset(delete) the stack and navigate to SigninAndSignup screen
        const signoutAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'SigninAndSignup' })
            ]
        });
        //if the user has outdated local cache and authorization with firebase failed than return to signinandup screen
        if (this.props.screenProps.signedIn === false) {
            this.props.navigation.dispatch(signoutAction);
        }
        return (
            <View>
                <Text>You are Signed in</Text>
                <Button title="Sign out" onPress={() => signout(this.props, signoutAction)} />
            </View>
        );
    }
}

class Newsfeed extends Component {
    render() {
        return (
            <Text> Newsfeed </Text>
        );
    }
}
class Points extends Component {
    render() {
        return (
            <Text> Points </Text>
        );
    }
}
class Promotion extends Component {
    render() {
        return (
            <Text> Promotion </Text>
        );
    }
}

class Settings extends Component {
    render() {
        return (
            <Text> Settings </Text>
        );
    }
}

const SignedInDrawer =
    DrawerNavigator({
        Profile: {
            screen: Profile,
        },
        Newsfeed: {
            screen: Newsfeed,
        },
        Points: {
            screen: Points,
        },
        Promotion: {
            screen: Promotion,
        },
        Settings: {
            screen: Settings,
        }
    },
        { initialRouteName: 'Profile' }
    );

export default SignedInDrawer;
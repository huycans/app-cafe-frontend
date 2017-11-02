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
import { DrawerNavigator, NavigationActions, StackNavigator } from 'react-navigation';
import { signinFb, verifyToken, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout } from '../FirebaseAuth/AuthFunctions.js';
import { removeData } from '../Storage/Storage';
import { savedName } from '../../constants/constants';
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
            removeData(savedName.userIdFromServer);
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
            navigationOptions: {
                gesturesEnabled: false,
                drawerLabel: 'Profile',
                drawerIcon: () => (
                    <Image
                        source={{ uri: `https://png.icons8.com/?id=20321&size=280` }}
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                )
            }
        },
        Newsfeed: {
            screen: Newsfeed,
            navigationOptions: {
                gesturesEnabled: false,
                drawerLabel: 'Newsfeed',
                drawerIcon: () => (
                    <Image
                        source={{ uri: `https://png.icons8.com/?id=20321&size=280` }}
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                )
            }
        },
        Points: {
            screen: Points,
            navigationOptions: {
                gesturesEnabled: false,
                drawerLabel: 'Points',
                drawerIcon: () => (
                    <Image
                        source={{ uri: `https://png.icons8.com/?id=20321&size=280` }}
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                )
            }
        },
        Promotion: {
            screen: Promotion,
            navigationOptions: {
                gesturesEnabled: false,
                drawerLabel: 'Promotion',
                drawerIcon: () => (
                    <Image
                        source={{ uri: `https://png.icons8.com/?id=20321&size=280` }}
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                )
            }
        },
        Settings: {
            screen: Settings,
            navigationOptions: {
                gesturesEnabled: false,
                drawerLabel: 'Settings',
                drawerIcon: () => (
                    <Image
                        source={{ uri: `https://png.icons8.com/?id=20321&size=280` }}
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                )
            }
        }
    },
        { initialRouteName: 'Profile' }
    );
//DrawerNavigation
//the drawers are inside of another stack
const MainDrawerStack = StackNavigator({
    SignedInDrawer: { screen: SignedInDrawer }
}, {
        headerMode: 'float',
        navigationOptions: ({ navigation }) => ({
            headerStyle: { backgroundColor: '#4C3E54' },
            title: 'Welcome!',
            gesturesEnabled: false,
            headerTintColor: 'white',
            headerLeft:
            <Text style={{ color: "white" }}
                onPress={() => {
                    if (navigation.state.index === 0) {
                        navigation.navigate('DrawerOpen');
                    } else {
                        navigation.navigate('DrawerClose');
                    }
                }
                }
            >Menu</Text>
        })
    });
export default MainDrawerStack;
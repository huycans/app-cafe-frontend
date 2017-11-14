import React, { Component } from 'react';
import { Image } from 'react-native';
import { DrawerNavigator, NavigationActions, StackNavigator, TabNavigator } from 'react-navigation';
import { signinFb, verifyToken, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout } from '../FirebaseAuth/AuthFunctions.js';
import { removeData } from '../Storage/Storage';
import { savedName } from '../../constants/constants';
import styles from "./Styles";
import * as Progress from 'react-native-progress';
import { Container, Header, Content, Card, CardItem, Body, Text, Button, Footer, Left, Right, Thumbnail } from 'native-base';

class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //use signoutAction var to reset(delete) the stack and navigate to SigninAndSignup screen
        const signoutAction = NavigationActions.reset({
            index: 0,
            key: null,
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
            <Container>
                <Content>
                    <Card >
                        <CardItem cardBody>
                            <Image source={require('../../img/background.png')}
                                style={{ height: 200, width: null, flex: 1, alignItems: "center" }} >
                                <Thumbnail style={{marginTop: "5%"}} source={require("../../img/background.png")} large/>
                                <Text style={{ fontSize: 20, marginTop: "auto", textAlign: 'center', color: "white" }} >Adam Smith</Text>
                                <Text note style={[{ color: "white" }]}>Thành viên mới</Text>
                                <Text note style={[{ color: "yellow" }]}>30 điểm</Text>
                            </Image>
                        </CardItem>
                        <CardItem style={{ flex: 1 }}>
                            <Progress.Bar style={{flex: 1}} width={null} height={6} progress={40 / 100} color="#FCD836" useNativeDriver={true} />
                        </CardItem>
                        <CardItem style={{ flex: 1 }} >
                            <Body style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }} >
                                <Text style={[{ fontSize: 10, textAlign: 'left', color: "black" }]}>Thành viên mới</Text>
                                <Text style={[{ fontSize: 10, textAlign: 'center', color: "black" }]}>Buddy</Text>
                                <Text style={[{ fontSize: 10, textAlign: 'right', color: "black" }]}>You're my angel</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ marginTop: 10 }} >Mã tích điểm</Text>
                        <Image style={{ width: 200, height: 80, margin: 20 }} source={require("../../img/barcode.png")} />
                    </Card>
                </Content>
                <Footer>
                    <Button light transparent onPress={() => signout(this.props, signoutAction)} >
                        <Text>Sign out</Text>
                    </Button>
                </Footer>
            </Container>
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

const SignedInDrawer = DrawerNavigator({
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

// const SignedInDrawer = DrawerNavigator({
//     Profile: {
//         screen: Profile,
//         navigationOptions: {
//             gesturesEnabled: false,
//             drawerLabel: 'Profile',
//             drawerIcon: () => (
//                 <Image
//                     source={{ uri: `https://png.icons8.com/?id=20321&size=280` }}
//                     style={{ width: 30, height: 30, borderRadius: 15 }}
//                 />
//             )
//         }
//     },
//     Newsfeed: {
//         screen: Newsfeed
//     },
//     Points: {
//         screen: Points
//     },
//     Promotion: {
//         screen: Promotion
//     },
//     Settings: {
//         screen: Settings
//     }
// },
//     { initialRouteName: 'Profile' }
// );
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
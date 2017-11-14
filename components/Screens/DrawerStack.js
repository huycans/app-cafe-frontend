import React, { Component } from 'react';
import { Image } from 'react-native';
import { DrawerNavigator, NavigationActions, StackNavigator } from 'react-navigation';
import { signinFb, verifyToken, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout } from '../FirebaseAuth/AuthFunctions.js';
import { removeData } from '../Storage/Storage';
import { savedName } from '../../constants/constants';
import * as Progress from 'react-native-progress';
import { Container, Header, Content, Card, CardItem, Body, Text, Button, Footer, Left, Right, Thumbnail, FooterTab } from 'native-base';
import * as MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import * as MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import * as Ionicons from 'react-native-vector-icons/Ionicons';
const userInfo = {
    name: "Adam smith",
    memberClass: "Thành viên mới",
    points: 60,
    barcode: {}
};
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
                                <Thumbnail style={{ marginTop: "5%" }} source={require("../../img/background.png")} large />
                                <Text style={{ fontSize: 20, marginTop: "auto", textAlign: 'center', color: "white" }} >{userInfo.name}</Text>
                                <Text note style={[{ color: "white" }]}>{userInfo.memberClass}</Text>
                                <Text note style={[{ color: "yellow" }]}>{userInfo.points + " điểm"}</Text>
                            </Image>
                        </CardItem>
                        <CardItem style={{ flex: 1 }}>
                            <Progress.Bar style={{ flex: 1 }} width={null} height={6} progress={userInfo.points / 100} color="#FCD836" useNativeDriver={true} />
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
                <Footer >
                    <FooterTab>
                        <Button block onPress={() => signout(this.props, signoutAction)} >
                            <Ionicons.default name="md-log-out" size={iconSize} color="black"/>
                            <Text>Sign out</Text>
                        </Button>
                    </FooterTab>
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
class PointsExchange extends Component {
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
const iconSize = 22;
const SignedInDrawer = DrawerNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: {
            gesturesEnabled: false,
            drawerLabel: 'Profile',
            drawerIcon: () => (
                <FontAwesomeIcons.default name="user-circle-o" size={iconSize} />
            )
        }
    },
    Newsfeed: {
        screen: Newsfeed,
        navigationOptions: {
            gesturesEnabled: false,
            drawerLabel: 'TIN TỨC',
            drawerIcon: () => (
                <FontAwesomeIcons.default name="newspaper-o" size={iconSize} />
            )
        }
    },
    PointsExchange: {
        screen: PointsExchange,
        navigationOptions: {
            gesturesEnabled: false,
            drawerLabel: 'ĐỔI ĐIỂM',
            drawerIcon: () => (
                <FontAwesomeIcons.default name="exchange" size={iconSize} />
            )
        }
    },
    Promotion: {
        screen: Promotion,
        navigationOptions: {
            gesturesEnabled: false,
            drawerLabel: 'KHUYẾN MÃI',
            drawerIcon: () => (
                <SimpleLineIcons.default name="present" size={iconSize} />
            )
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            gesturesEnabled: false,
            drawerLabel: 'CÀI ĐẶT',
            drawerIcon: () => (
                <SimpleLineIcons.default name="settings" size={iconSize} />
            )
        }
    }
},
    { initialRouteName: 'Profile' }
);


//the drawers are inside of another stack
const MainDrawerStack = StackNavigator({
    SignedInDrawer: { screen: SignedInDrawer }
}, {
        headerMode: 'float',
        navigationOptions: ({ navigation }) => ({
            headerStyle: { backgroundColor: '#FCD836' },
            title: null,
            gesturesEnabled: false,
            headerTintColor: 'white',
            headerLeft:
                <MaterialIcons.Button name="menu" backgroundColor="transparent" underlayColor="transparent" onPress={() => {
                    if (navigation.state.index === 0) {
                        navigation.navigate('DrawerOpen');
                    } else {
                        navigation.navigate('DrawerClose');
                    }
                }
                }
                />
        })
    });
export default MainDrawerStack;
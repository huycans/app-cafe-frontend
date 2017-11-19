import React, { Component } from 'react';
import { Image, Modal, View, ScrollView, StyleSheet, Linking } from 'react-native';
import { DrawerNavigator, NavigationActions, StackNavigator } from 'react-navigation';
import { signinFb, verifyToken, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout } from '../FirebaseAuth/AuthFunctions.js';
import * as Progress from 'react-native-progress';
import {
    Container, Header, Content, Card, CardItem, Body, Text,
    Button, Footer, Left, Right, Thumbnail, FooterTab, List, ListItem
} from 'native-base';
import { URL, SERVER_API, savedName } from "../../constants/constants";
import Loading from "../Loading/Loading";
import { storeData } from "../Storage/Storage";
import * as MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
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
            signout(this.props, signoutAction);
        }
        return (
            <Container>
                <Content>
                    <Card >
                        <CardItem cardBody>
                            <Image source={require('../../img/avatar.jpg')}
                                style={{ height: 200, width: null, flex: 1, alignItems: "center" }} >
                                <Thumbnail style={{ marginTop: "10%" }} source={require("../../img/avatar.jpg")} large />
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
                            <Ionicons.default name="md-log-out" size={iconSize} color="black" />
                            <Text>Sign out</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

class Newsfeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasNewsfeed: false,
            newsfeedData: null,
            modalVisible: false,
            selectedPost: null
        };
        this.getNewsfeed = this.getNewsfeed.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
    }
    async getNewsfeed() {
        try {
            console.log("getting newsfeed");
            let link = URL + SERVER_API.feed;
            let newsfeed = await fetch(link, {
                method: 'GET',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });
            let newsfeedJSON = await newsfeed.json();
            return newsfeedJSON.content.data;
        }
        catch (error) {
            console.log("Retrieving newsfeed error: ", error);
        }
    }

    componentDidMount() {
        var self = this;//do this so that setstate i callback below can see "this"
        this.getNewsfeed().then(function (newsfeed) {
            console.log(newsfeed);
            //storeData(savedName.newsfeed, newsfeed);
            self.setState({ newsfeedData: newsfeed });
            self.setState({ hasNewsfeed: true });
        },
            function (error) {
                console.log(error);
            }
        );

    }

    setModalVisible(visible, post) {
        this.setState({
            modalVisible: visible,
            selectedPost: post
        });
    }

    render() {
        console.log("Newsfeed rendering");
        let { hasNewsfeed, newsfeedData, selectedPost } = this.state;
        let Display = null;
        if (!hasNewsfeed) {
            Display = Loading;
        }
        else {
            // let { created_time, full_picture, id, link, message, source } = newsfeedData[0];
            Display =
                <List dataArray={newsfeedData.slice(0, 5)}
                    renderRow={(rowData) => {
                        // let postDate = new Date(rowData.created_time);
                        // console.log(postDate);
                        let messageDigest = rowData.message.slice(0, 100) + " ... ";
                        return (
                            <ListItem >
                                <Card>
                                    <CardItem>
                                        <Thumbnail style={{ flex: 1, height: 200 }} source={{ uri: rowData.full_picture }} square large />
                                    </CardItem>
                                    <CardItem cardBody button onPress={() => this.setModalVisible(true, rowData)}  >
                                        <Text style={{ textAlign: "center" }}>
                                            {messageDigest}
                                        </Text>
                                    </CardItem>
                                    <CardItem footer>
                                        <Right>
                                            <Text note style={{ width: 100 }}>
                                                {rowData.created_time}
                                            </Text>
                                        </Right>
                                    </CardItem>
                                </Card>
                            </ListItem>);
                    }} />;
        }
        const ModalCard = (!selectedPost) ? <View /> :
            //replace card with scrollview
            <ScrollView contentContainerStyle={modalStyles.contentContainer} >
                <MaterialIcons.Button name="arrow-back" borderRadius={5}
                    backgroundColor="transparent" color="black" size={40}
                    onPress={() => this.setModalVisible(!this.state.modalVisible, this.state.selectedItem)}>
                    <Text>Go Back</Text>
                </MaterialIcons.Button>

                <Image style={{ marginTop: 10, height: 200, width: 400, alignSelf: "center" }} source={{ uri: selectedPost.full_picture }} />
                
                {/* <Button transparent onPress={() => Linking.openURL(selectedPost.link).catch(err => console.error('An error occurred while open link', err)) }>
                    <Text style={{fontSize: 12, color: "#4B4B4B"}}>{selectedPost.link}</Text>
                </Button> */}

                <Text style={{ textAlign: "auto", marginBottom: 15, marginTop: 15 }}>
                    {selectedPost.message}
                </Text>
            </ScrollView>;
        return (
            <Container>
                <Content>
                    {Display}
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => alert("Modal has been closed.")}
                    >
                        {ModalCard}
                    </Modal>
                </Content>
            </Container>

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
const modalStyles = StyleSheet.create({
    contentContainer: {
        paddingLeft: 10,
        paddingRight: 10
    }
});
export default MainDrawerStack;
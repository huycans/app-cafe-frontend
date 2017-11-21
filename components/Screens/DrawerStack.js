import React, { Component } from "react";
import {
  Image,
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Dimensions
} from "react-native";
import {
  DrawerNavigator,
  NavigationActions,
  StackNavigator
} from "react-navigation";
import {
  signinFb,
  verifyToken,
  setupGoogleSignin,
  signinGoogle,
  signupEmail,
  signinEmail,
  signout
} from "../FirebaseAuth/AuthFunctions.js";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Button,
  Footer,
  Left,
  Right,
  Thumbnail,
  FooterTab,
  List,
  ListItem
} from "native-base";
import { URL, SERVER_API, savedName } from "../../constants/constants";
import Loading from "../Loading/Loading";
import { storeData } from "../Storage/Storage";
import * as MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import * as SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Profile from "./SignedInDrawer/Profile";

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
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      let newsfeedJSON = await newsfeed.json();
      return newsfeedJSON.content.data;
    } catch (error) {
      console.log("Retrieving newsfeed error: ", error);
    }
  }

  componentDidMount() {
    var self = this; //do this so that setstate in callback below can see "this"
    this.getNewsfeed().then(
      function(newsfeed) {
        console.log(newsfeed);
        //storeData(savedName.newsfeed, newsfeed);
        self.setState({ newsfeedData: newsfeed });
        self.setState({ hasNewsfeed: true });
      },
      function(error) {
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
    } else {
      // let { created_time, full_picture, id, link, message, source } = newsfeedData[0];
      Display = (
        <List
          dataArray={newsfeedData}
          renderRow={rowData => {
            // let postDate = new Date(rowData.created_time);
            // console.log(postDate);
            let messageDigest = rowData.message.slice(0, 100) + " ... ";
            return (
              <ListItem
                button
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  margin: -10
                }}
              >
                <Card
                  style={{
                    padding: 0
                  }}
                >
                  <CardItem>
                    <Thumbnail
                      style={{ flex: 1, height: 200 }}
                      source={{ uri: rowData.full_picture }}
                      square
                      large
                    />
                  </CardItem>
                  <CardItem
                    cardBody
                    button
                    onPress={() => this.setModalVisible(true, rowData)}
                  >
                    <Text style={{ textAlign: "left", margin: 10 }}>
                      {messageDigest}
                    </Text>
                  </CardItem>
                  <CardItem
                    footer
                    style={{
                      justifyContent: "flex-end"
                    }}
                  >
                    <Right>
                      <Text
                        note
                        style={{
                          fontSize: 10
                        }}
                      >
                        {rowData.created_time}
                      </Text>
                    </Right>
                  </CardItem>
                </Card>
              </ListItem>
            );
          }}
        />
      );
    }
    const ModalCard = !selectedPost ? (
      <View />
    ) : (
      //replace card with scrollview
      <ScrollView contentContainerStyle={modalStyles.contentContainer}>
        <MaterialIcons.Button
          name="arrow-back"
          borderRadius={5}
          backgroundColor="transparent"
          color="black"
          size={30}
          onPress={() =>
            this.setModalVisible(
              !this.state.modalVisible,
              this.state.selectedItem
            )
          }
        >
          <Text>Go Back</Text>
        </MaterialIcons.Button>

        <Image
          style={{
            marginTop: 10,
            height: 200,
            width: 400,
            alignSelf: "center"
          }}
          source={{ uri: selectedPost.full_picture }}
        />

        {/* <Button transparent onPress={() => Linking.openURL(selectedPost.link).catch(err => console.error('An error occurred while open link', err)) }>
                    <Text style={{fontSize: 12, color: "#4B4B4B"}}>{selectedPost.link}</Text>
                </Button> */}

        <Text style={{ textAlign: "auto", marginBottom: 15, marginTop: 15 }}>
          {selectedPost.message}
        </Text>
      </ScrollView>
    );
    return (
      <Container>
        <Content>
          {Display}
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() =>
              this.setModalVisible(
                !this.state.modalVisible,
                this.state.selectedItem
              )
            }
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
    return <Text> Points </Text>;
  }
}
class Promotion extends Component {
  render() {
    return <Text> Promotion </Text>;
  }
}

class Settings extends Component {
  render() {
    return <Text> Settings </Text>;
  }
}
const iconSize = 22;
const SignedInDrawer = DrawerNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "Profile",
        drawerIcon: () => (
          <FontAwesomeIcons.default name="user-circle-o" size={iconSize} />
        )
      }
    },
    Newsfeed: {
      screen: Newsfeed,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "TIN TỨC",
        drawerIcon: () => (
          <FontAwesomeIcons.default name="newspaper-o" size={iconSize} />
        )
      }
    },
    PointsExchange: {
      screen: PointsExchange,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "ĐỔI ĐIỂM",
        drawerIcon: () => (
          <FontAwesomeIcons.default name="exchange" size={iconSize} />
        )
      }
    },
    Promotion: {
      screen: Promotion,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "KHUYẾN MÃI",
        drawerIcon: () => (
          <SimpleLineIcons.default name="present" size={iconSize} />
        )
      }
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "CÀI ĐẶT",
        drawerIcon: () => (
          <SimpleLineIcons.default name="settings" size={iconSize} />
        )
      }
    }
  },
  { initialRouteName: "Profile" }
);

//the drawers are inside of another stack
const MainDrawerStack = StackNavigator(
  {
    SignedInDrawer: { screen: SignedInDrawer }
  },
  {
    headerMode: "float",
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: "#FCD836" },
      title: null,
      gesturesEnabled: false,
      headerTintColor: "white",
      headerLeft: (
        <MaterialIcons.Button
          name="menu"
          backgroundColor="transparent"
          underlayColor="transparent"
          onPress={() => {
            if (navigation.state.index === 0) {
              navigation.navigate("DrawerOpen");
            } else {
              navigation.navigate("DrawerClose");
            }
          }}
        />
      )
    })
  }
);
const modalStyles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 10,
    paddingRight: 10
  }
});

export default MainDrawerStack;

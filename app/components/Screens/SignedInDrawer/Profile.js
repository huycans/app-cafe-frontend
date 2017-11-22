import React, { Component } from "react";
import {
  DrawerNavigator,
  NavigationActions,
  StackNavigator
} from "react-navigation";
import {
  Image,
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Linking
} from "react-native";
import {
  signinFb,
  verifyToken,
  setupGoogleSignin,
  signinGoogle,
  signupEmail,
  signinEmail,
  signout
} from "../../FirebaseAuth/AuthFunctions";
import * as Progress from "react-native-progress";
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
import * as Ionicons from "react-native-vector-icons/Ionicons";

const iconSize = 22;
const userInfo = {
  name: "Adam smith",
  memberClass: "Thành viên mới",
  points: 60,
  barcode: {}
};
export default class Profile extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    //use signoutAction var to reset(delete) the stack and navigate to SigninAndSignup screen
    const signoutAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: "SigninAndSignup" })]
    });
    //if the user has outdated local cache and authorization with firebase failed than return to signinandup screen
    if (this.props.screenProps.signedIn === false) {
      signout(this.props, signoutAction);
    }
    return (
      <Container>
        <Content>
          <Card>
            <CardItem cardBody>
              <Image
                source={require("../../../img/avatar.jpg")}
                style={{
                  height: 200,
                  width: null,
                  flex: 1,
                  alignItems: "center"
                }}
              >
                <Thumbnail
                  style={{ marginTop: "10%" }}
                  source={require("../../../img/avatar.jpg")}
                  large
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: "auto",
                    textAlign: "center",
                    color: "white"
                  }}
                >
                  {userInfo.name}
                </Text>
                <Text note style={[{ color: "white" }]}>
                  {userInfo.memberClass}
                </Text>
                <Text note style={[{ color: "yellow" }]}>
                  {userInfo.points + " điểm"}
                </Text>
              </Image>
            </CardItem>
            <CardItem style={{ flex: 1 }}>
              <Progress.Bar
                style={{ flex: 1 }}
                width={null}
                height={6}
                progress={userInfo.points / 100}
                color="#FCD836"
                useNativeDriver={true}
              />
            </CardItem>
            <CardItem style={{ flex: 1 }}>
              <Body
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={[{ fontSize: 10, textAlign: "left", color: "black" }]}
                >
                  Thành viên mới
                </Text>
                <Text
                  style={[
                    { fontSize: 10, textAlign: "center", color: "black" }
                  ]}
                >
                  Buddy
                </Text>
                <Text
                  style={[{ fontSize: 10, textAlign: "right", color: "black" }]}
                >
                  You're my angel
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Card
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ marginTop: 10 }}>Mã tích điểm</Text>
            <Image
              style={{ width: 200, height: 80, margin: 20 }}
              source={require("../../../img/barcode.png")}
            />
          </Card>
        </Content>
        <Footer>
          <FooterTab>
            <Button block onPress={() => signout(this.props, signoutAction)}>
              <Ionicons.default
                name="md-log-out"
                size={iconSize}
                color="black"
              />
              <Text>Sign out</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

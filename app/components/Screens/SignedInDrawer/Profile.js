//@flow
import * as React from "react";
import { View } from "react-native";
import { NavigationActions } from "react-navigation";
import { Image } from "react-native";
import { savedName, SERVER_API } from "../../../constants/constants";
import * as Progress from "react-native-progress";
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Button,
  Footer,
  Thumbnail,
  FooterTab
} from "native-base";
import * as Ionicons from "react-native-vector-icons/Ionicons";
import { loadData } from "../../Storage/Storage";
import Loading from "../../Loading/Loading";
import { connect } from "react-redux";
import { signoutRequest } from "../../../actions/auth";
const iconSize = 22;

type PropType = {
  isSignedIn: boolean,
  userServerObj: Object,
  dispatch: Function
};

type StateType = {
  userInfo: ?Object
};

class Profile extends React.Component<PropType, StateType> {
  getUserData: Function;
  constructor(props: PropType) {
    super(props);
    this.state = {
      userInfo: null
    };
  }

  componentDidMount() {
    setTimeout(() => {
      //if the user has outdated local cache and authorization with firebase failed then return to signinandup screen
      if (this.props.isSignedIn === false) {
        this.props.dispatch(signoutRequest());
      } else {
        // var self = this;
        // loadData(savedName.userInfoData).then(
        //   function(userInfo: Object) {
        //     console.log("userInfo: ", userInfo);
        //     self.forceUpdate(self.setState({ userInfo: userInfo }));
        //   },
        //   function(error: Error) {
        //     console.log(error);
        //   }
        // );

        //if everything is okay
        this.forceUpdate(this.setState({ userInfo: this.props.userServerObj }));
      }
    }, 500);
  }

  render(): React.Node {
    const { userInfo } = this.state;
    let ScreenContent = (): React.Node => <Loading />;
    if (userInfo) {
      //default avatar
      let userAvatar = require("../../../img/ic_launcher.png");
      //if user's avatar exist, assign it to userAvatar
      if (userInfo.avatarUrl) userAvatar = { uri: userInfo.avatarUrl };

      ScreenContent = (): React.Node => (
        <Container>
          <Content>
            <Card>
              <CardItem cardBody>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#000"
                    }}
                  >
                    <Image
                      source={userAvatar}
                      style={{
                        height: 200,
                        width: null,
                        flex: 1,
                        opacity: 0.5
                      }}
                    />
                  </View>
                  <Thumbnail
                    style={{ marginTop: "10%" }}
                    source={userAvatar}
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
                    {userInfo.username}
                  </Text>
                  <Text note style={[{ color: "white" }]}>
                    chưa có mức thành viên
                  </Text>
                  <Text note style={[{ color: "yellow" }]}>
                    {userInfo.point + " điểm"}
                  </Text>
                </View>
              </CardItem>
              <CardItem style={{ flex: 1 }}>
                <Progress.Bar
                  style={{ flex: 1 }}
                  width={null}
                  height={6}
                  progress={userInfo.point / 100}
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
                    style={[
                      { fontSize: 10, textAlign: "left", color: "black" }
                    ]}
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
                    style={[
                      { fontSize: 10, textAlign: "right", color: "black" }
                    ]}
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
                source={{ uri: userInfo.barcodeUrl }}
              />
            </Card>
          </Content>
          <Footer>
            <FooterTab>
              <Button
                block
                onPress={(): Promise<void> =>
                  this.props.dispatch(signoutRequest())
                }
              >
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
    return <ScreenContent />;
  }
}

const mapStateToProps = (state: Object): Object => {
  return {
    isSignedIn: state.auth.isSignedIn,
    userServerObj: state.auth.userServerObj
  };
};

export default connect(mapStateToProps)(Profile);

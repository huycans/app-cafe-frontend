//@flow
import * as React from "react";
import { View } from "react-native";
import { Image } from "react-native";
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
import Loading from "../../Loading/Loading";
import { connect } from "react-redux";
import { signoutRequest } from "../../../actions/auth";
import { URL } from "../../../constants/constants";
import EStyleSheet from "react-native-extended-stylesheet";

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
  }

  componentDidMount() {
    setTimeout(() => {
      //if the user has outdated local cache and authorization with firebase failed then return to signinandup screen
      if (this.props.isSignedIn === false) {
        this.props.dispatch(signoutRequest());
      }
    }, 500);
  }

  render(): React.Node {
    const userInfo = this.props.userServerObj;

    //set default screen content to the loading component first
    let ScreenContent = (): React.Node => <Loading />;

    if (userInfo.qrCode != undefined) {
      //if qrCode link had been retrieved
      //default avatar
      let userAvatar = require("../../../img/ic_launcher.png");
      //if user's avatar exist, assign it to userAvatar
      if (userInfo.avatarUrl) userAvatar = { uri: userInfo.avatarUrl };
      //link to QR code
      let qrCodeLink = URL + userInfo.qrCode;

      ScreenContent = (): React.Node => (
        <Container>
          <Content>
            <Card>
              <CardItem cardBody>
                <View style={styles.profileContainer}>
                  <View style={styles.backgroundImgContainer}>
                    <Image source={userAvatar} style={styles.backgroundImg} />
                  </View>

                  <Thumbnail
                    style={styles.backgroundImgThumbnail}
                    source={userAvatar}
                    large
                  />
                  <Text style={styles.usernameText}>{userInfo.username}</Text>
                  <Text note style={styles.currentMembershipLevelText}>
                    chưa có mức thành viên
                  </Text>
                  <Text note style={styles.pointText}>
                    {userInfo.point + " điểm"}
                  </Text>
                </View>
              </CardItem>

              <CardItem style={styles.container}>
                <Progress.Bar
                  style={{ flex: 1 }}
                  width={null}
                  height={6}
                  progress={userInfo.point / 100}
                  color={styles.$progBarColor}
                  useNativeDriver={true}
                />
              </CardItem>

              <CardItem style={styles.container}>
                <Body style={styles.membershipLevelContainer}>
                  <Text style={styles.membershipLevelText}>Thành viên</Text>
                  <Text style={styles.membershipLevelText}>Bạc</Text>
                  <Text style={styles.membershipLevelText}>Vàng</Text>
                  <Text style={styles.membershipLevelText}>Bạch kim</Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={styles.qrContainer}>
              <Text style={{ marginTop: 10 }}>Mã tích điểm</Text>
              <Image style={styles.qrCode} source={{ uri: qrCodeLink }} />
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
    isSignedIn: state.reducer.isSignedIn,
    userServerObj: state.reducer.userServerObj
  };
};

const styles = EStyleSheet.create({
  $progBarColor: "#FCD836",
  container: { flex: 1 },
  profileContainer: { flex: 1, alignItems: "center" },
  backgroundImgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#000"
  },
  backgroundImg: {
    height: 200,
    width: null,
    flex: 1,
    opacity: 0.5
  },
  backgroundImgThumbnail: { marginTop: "10%" },
  usernameText: {
    fontSize: 20,
    marginTop: "auto",
    textAlign: "center",
    color: "white"
  },
  currentMembershipLevelText: { color: "white" },
  pointText: { color: "yellow" },
  membershipLevelContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  membershipLevelText: { fontSize: 12, color: "black" },
  qrContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  qrCode: { width: 200, height: 200, margin: 10 }
});
export default connect(mapStateToProps)(Profile);

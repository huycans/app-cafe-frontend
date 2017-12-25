//@flow
import * as React from "react";
import { Image, Modal, View, ScrollView, StyleSheet } from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Right,
  Thumbnail,
  List,
  ListItem
} from "native-base";
import { URL, SERVER_API } from "../../../constants/constants";
import { TabNavigator } from "react-navigation";

import Loading from "../../Loading/Loading";
import * as MaterialIcons from "react-native-vector-icons/MaterialIcons";

const today = new Date();
const formatTime = (time: Object): string => {
  if (time.toDateString() === today.toDateString()) return "Hôm nay";
  return `${time.getDate()}/${time.getMonth() +
    1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
};

type PropType = any;

type StateType = {
  hasFBFeed: boolean,
  feedData: ?Array<FBFeedDataType>,
  modalVisible: boolean,
  selectedPost: ?FBFeedDataType
};
type FBFeedDataType = {
  created_time: string,
  full_picture: string,
  id: string,
  link: string,
  message: string,
  source: string
};

//feeds taken from facebook
class FBFeed extends React.Component<PropType, StateType> {
  getFBFeed: Function;
  setModalVisible: Function;
  constructor(props: any) {
    super(props);
    this.state = {
      hasFBFeed: false,
      feedData: null,
      modalVisible: false,
      selectedPost: null
    };
    this.getFBFeed = this.getFBFeed.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }
  async getFBFeed(): Promise<any> {
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
    this.getFBFeed().then(
      function(newsfeed: Array<FBFeedDataType>) {
        console.log(newsfeed);
        //storeData(savedName.newsfeed, newsfeed);
        self.setState({ feedData: newsfeed, hasFBFeed: true });
      },
      function(error: Error) {
        console.log(error);
      }
    );
  }

  setModalVisible(visible: boolean, post: Object) {
    this.setState({
      modalVisible: visible,
      selectedPost: post
    });
  }

  render(): React.Node {
    let { hasFBFeed, feedData, selectedPost } = this.state;
    let Display = null;
    if (!hasFBFeed) {
      Display = Loading;
    } else {
      // let { created_time, full_picture, id, link, message, source } = feedData[0];
      Display = (): React.Node => (
        <List
          dataArray={feedData}
          renderRow={(rowData: Object): React.Node => {
            let messageDigest = rowData.message.slice(0, 100) + " ... ";
            let d = new Date(rowData.created_time);
            let formattedDate = formatTime(d);
            return (
              <ListItem
                button
                style={{
                  width: "100%",
                  marginLeft: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginRight: 0
                  //backgroundColor: "transparent"
                }}
              >
                <Card>
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
                    onPress={(): void => this.setModalVisible(true, rowData)}
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
                        {formattedDate}
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
    const ModalCard = (props: { selectedPost: FBFeedDataType }): React.Node =>
      !props.selectedPost ? (
        <View />
      ) : (
        //replace card with scrollview
        <ScrollView style={modalStyles.contentContainer}>
          <MaterialIcons.Button
            name="arrow-back"
            borderRadius={5}
            backgroundColor="transparent"
            color="black"
            size={30}
            onPress={(): void =>
              this.setModalVisible(
                !this.state.modalVisible,
                this.state.selectedPost
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

          <Text style={{ textAlign: "auto", marginBottom: 15, marginTop: 15 }}>
            {selectedPost.message}
          </Text>
        </ScrollView>
      );
    return (
      <Container>
        <Content>
          <Display />
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={(): void =>
              this.setModalVisible(
                !this.state.modalVisible,
                this.state.selectedPost
              )
            }
          >
            <ModalCard selectedPost={selectedPost} />
          </Modal>
        </Content>
      </Container>
    );
  }
}

type PostStateType = {
  hasAdminFeed: boolean,
  feedData: ?Array<Object>,
  modalVisible: boolean,
  selectedPost: ?Object
};
const data = [
  {
    created_time: "1/1/2011",
    full_picture:
      "https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png",
    id: "232rfrgf4r4ggrg",
    link: "23rgefgrhrhwwbbbb",
    message:
      "This is message This is message This is message This is message This is message This is message This is message This is message This is message This is message This is message This is message ",
    source: "source"
  },
  {
    created_time: "1/1/2011",
    full_picture:
      "https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png",
    id: "232rfrgf4r4ggrg",
    link: "23rgefgrhrhwwbbbb",
    message:
      "This is message This is message This is message This is message This is message This is message This is message This is message This is message This is message This is message This is message ",
    source: "source"
  }
];
//feed taken from admin app's post
class AdminPost extends React.Component<PropType, PostStateType> {
  getPost: Function;
  setModalVisible: Function;
  constructor(props: any) {
    super(props);
    this.state = {
      hasAdminFeed: true,
      feedData: data,
      modalVisible: false,
      selectedPost: null
    };
    this.getPost = this.getPost.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }
  async getPost(): Promise<any> {
    // try {
    //   console.log("getting newsfeed");
    //   let link = URL + SERVER_API.feed;
    //   let newsfeed = await fetch(link, {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json"
    //     }
    //   });
    //   let newsfeedJSON = await newsfeed.json();
    //   return newsfeedJSON.content.data;
    // } catch (error) {
    //   console.log("Retrieving newsfeed error: ", error);
    // }
    console.log("getting");
  }

  componentDidMount() {
    // var self = this; //do this so that setstate in callback below can see "this"
    // this.getPost().then(
    //   function(newsfeed: Array<FBFeedDataType>) {
    //     console.log(newsfeed);
    //     //storeData(savedName.newsfeed, newsfeed);
    //     self.setState({ feedData: newsfeed, hasAdminFeed: true });
    //   },
    //   function(error: Error) {
    //     console.log(error);
    //   }
    // );
    console.log("mounted");
  }

  setModalVisible(visible: boolean, post: Object) {
    this.setState({
      modalVisible: visible,
      selectedPost: post
    });
  }

  render(): React.Node {
    let { hasAdminFeed, feedData, selectedPost } = this.state;
    let Display = null;
    if (!hasAdminFeed) {
      Display = Loading;
    } else {
      Display = (): React.Node => (
        <List
          dataArray={feedData}
          renderRow={(rowData: Object): React.Node => {
            // let postDate = new Date(rowData.created_time);
            // console.log(postDate);
            let messageDigest = rowData.message.slice(0, 100) + " ... ";
            let d = new Date(rowData.created_time);
            let formattedDate = formatTime(d);
            return (
              <ListItem
                button
                style={{
                  width: "100%",
                  marginLeft: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginRight: 0
                  //backgroundColor: "transparent"
                }}
              >
                <Card>
                  <CardItem>
                    <Thumbnail
                      style={{ flex: 1, height: 200 }}
                      source={require("../../../img/yama.png")}
                      square
                      large
                    />
                  </CardItem>
                  <CardItem
                    cardBody
                    button
                    onPress={(): void => this.setModalVisible(true, rowData)}
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
                        {formattedDate}
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
    //TODO: change FBFeedDataType
    const ModalCard = (props: { selectedPost: FBFeedDataType }): React.Node =>
      !props.selectedPost ? (
        <View />
      ) : (
        //replace card with scrollview
        <ScrollView style={modalStyles.contentContainer}>
          <MaterialIcons.Button
            name="arrow-back"
            borderRadius={5}
            backgroundColor="transparent"
            color="black"
            size={30}
            onPress={(): void =>
              this.setModalVisible(
                !this.state.modalVisible,
                this.state.selectedPost
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

          <Text style={{ textAlign: "auto", marginBottom: 15, marginTop: 15 }}>
            {selectedPost.message}
          </Text>
        </ScrollView>
      );
    return (
      <Container>
        <Content>
          <Display />
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={(): void =>
              this.setModalVisible(
                !this.state.modalVisible,
                this.state.selectedPost
              )
            }
          >
            <ModalCard selectedPost={selectedPost} />
          </Modal>
        </Content>
      </Container>
    );
  }
}

const Newsfeed = TabNavigator(
  {
    FBFeed: {
      screen: FBFeed,
      navigationOptions: {
        tabBarLabel: "Bài đăng"
      }
    },
    AdminPost: {
      screen: AdminPost,
      navigationOptions: {
        tabBarLabel: "Tin tức"
      }
    }
  },
  {
    initialRouteName: "FBFeed",
    swipeEnabled: false,
    animationEnabled: true,
    lazy: true,
    tabBarOptions: {
      style: {
        backgroundColor: "#FCD836"
      },
      indicatorStyle: {
        borderBottomColor: "#4B4B4B",
        borderBottomWidth: 2
      },
      activeTintColor: "#CEb02B"
      // inactiveTintColor: "#FCD836"
    }
  }
);

export default Newsfeed;

const modalStyles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 10,
    paddingRight: 10
  }
});

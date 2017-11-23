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

import Loading from "../../Loading/Loading";
import * as MaterialIcons from "react-native-vector-icons/MaterialIcons";

type PropType = any;

type StateType = {
  hasNewsfeed: boolean,
  newsfeedData: ?Array<NewsfeedDataType>,
  modalVisible: boolean,
  selectedPost: ?NewsfeedDataType
};
type NewsfeedDataType = {
  created_time: "string",
  full_picture: "string",
  id: "string",
  link: "string",
  message: "string",
  source: "string"
};
export default class Newsfeed extends React.Component<PropType, StateType> {
  getNewsfeed: Function;
  setModalVisible: Function;
  constructor(props: any) {
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
  async getNewsfeed(): Promise<any> {
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
      function(newsfeed: Array<NewsfeedDataType>) {
        console.log(newsfeed);
        //storeData(savedName.newsfeed, newsfeed);
        self.setState({ newsfeedData: newsfeed, hasNewsfeed: true });
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
    console.log("Newsfeed rendering");
    let { hasNewsfeed, newsfeedData, selectedPost } = this.state;
    let Display = null;
    if (!hasNewsfeed) {
      Display = Loading;
    } else {
      // let { created_time, full_picture, id, link, message, source } = newsfeedData[0];
      Display = (): React.Node => (
        <List
          dataArray={newsfeedData}
          renderRow={(rowData: Object): React.Node => {
            // let postDate = new Date(rowData.created_time);
            // console.log(postDate);
            let messageDigest = rowData.message.slice(0, 100) + " ... ";
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
    const ModalCard = (props: { selectedPost: NewsfeedDataType }): React.Node =>
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

const modalStyles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 10,
    paddingRight: 10
  }
});

//@flow
import * as React from "react";
import { Image, Modal, View, ScrollView } from "react-native";
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
import { URL, SERVER_API } from "../../../../constants/constants";
import { connect } from "react-redux";
import Loading from "../../../Loading/Loading";
import * as MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { modalStyles } from "./styles";
import { FETCH_FB_FEED_REQUEST } from "../../../../actions/auth";

const TODAY = new Date();
const formatTime = (time: Object): string => {
  if (time.toDateString() === TODAY.toDateString()) return "Hôm nay";
  return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
};

type PropType = {
  dispatch: Function,
  fbFeed: Array<FbfeedType>
};

type StateType = {
  hasFBFeed: boolean,
  feedData: ?Array<FbfeedType>,
  modalVisible: boolean,
  selectedPost: ?FbfeedType
};

type FbfeedType = {
  created_time: string,
  full_picture: string,
  id: string,
  link: string,
  message: string,
  source: string
};

//feeds taken from facebook
class FBFeed extends React.Component<PropType, StateType> {
  setModalVisible: Function;
  constructor(props: any) {
    super(props);
    this.state = {
      hasFBFeed: false,
      feedData: null,
      modalVisible: false,
      selectedPost: null
    };
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  //   componentDidMount() {
  //     var self = this; //do this so that setstate in callback below can see "this"
  //     this.getFBFeed().then(
  //       function(newsfeed: Array<FbfeedType>) {
  //         self.setState({ feedData: newsfeed, hasFBFeed: true });
  //       },
  //       function(error: Error) {
  //         console.log(error);
  //       }
  //     );
  //   }

  componentDidMount() {
    if (this.props.fbFeed.length === 0)
      this.props.dispatch({ type: FETCH_FB_FEED_REQUEST });
    else this.setState({ feedData: this.props.fbFeed, hasFBFeed: true });
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.fbFeed !== this.props.fbFeed && nextProps.fbFeed !== []) {
      this.setState({ feedData: nextProps.fbFeed, hasFBFeed: true });
    }
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
    const ModalCard = (props: { selectedPost: FbfeedType }): React.Node =>
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
            underlayColor="#EBEBEB"
            activeOpacity={0.3}
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

const mapStateToProps = (state: Object): Object => {
  const { fbFeed } = state.reducer;
  return { fbFeed };
};

export default connect(mapStateToProps)(FBFeed);

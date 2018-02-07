//@flow
import * as React from "react";
import { Modal, View, WebView } from "react-native";
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

import Loading from "../../../Loading/Loading";
import * as MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FETCH_ADMIN_FEED_REQUEST } from "../../../../actions/auth";
import { connect } from "react-redux";
import { styles } from "./styles";
import { formatTime } from "./formatTime";

type PropType = {
  dispatch: Function,
  adminFeed: Array<AdminFeedType>
};

type PostStateType = {
  hasAdminFeed: boolean,
  feedData: ?Array<Object>,
  modalVisible: boolean,
  selectedPost: ?Object
};

type AdminFeedType = {
  id: string,
  createdTime: string,
  lastModifiedTime: string,
  content: string,
  banner: string,
  title: string
};

//feed taken from admin app's post
class AdminPost extends React.Component<PropType, PostStateType> {
  setModalVisible: Function;
  constructor(props: any) {
    super(props);
    this.state = {
      hasAdminFeed: true,
      feedData: [],
      modalVisible: false,
      selectedPost: null
    };
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentDidMount() {
    if (this.props.adminFeed.length === 0)
      //if the adminFeed array from the store is currently empty, send a request to fetch it
      this.props.dispatch({ type: FETCH_ADMIN_FEED_REQUEST });
    else
      //else put the array in this component state, this help avoid re-fetching the array
      this.setState({ feedData: this.props.adminFeed, hasAdminFeed: true });
  }

  componentWillReceiveProps(nextProps: Object) {
    if (
      nextProps.fbFeed !== this.props.adminFeed &&
      nextProps.adminFeed !== []
    ) {
      this.setState({ feedData: nextProps.adminFeed, hasAdminFeed: true });
    }
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
    let screenWidth = styles.$screenWidth;
    let screenHeight = styles.screenHeight;
    if (!hasAdminFeed) {
      Display = Loading;
    } else {
      console.log(feedData);
      Display = (): React.Node => (
        <List
          dataArray={feedData}
          renderRow={(rowData: Object): React.Node => {
            // let messageDigest = rowData.message.slice(0, 100) + " ... ";
            let d = new Date(rowData.createdTime);
            let formattedDate = formatTime(d);
            return (
              <ListItem button style={styles.listContainer}>
                <Card>
                  <CardItem>
                    <Thumbnail
                      style={styles.thumbnailImg}
                      source={{ uri: rowData.banner }}
                      square
                      large
                    />
                  </CardItem>
                  <CardItem
                    cardBody
                    button
                    onPress={(): void => this.setModalVisible(true, rowData)}
                  >
                    <Text style={styles.previewText}>{rowData.title}</Text>
                  </CardItem>
                  <CardItem footer style={styles.footerStyle}>
                    <Right>
                      <Text note style={styles.dateText}>
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
    const ModalCard = (props: { selectedPost: AdminFeedType }): React.Node =>
      !props.selectedPost ? (
        <View />
      ) : (
        <View style={styles.modalContainer}>
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

          <WebView
            style={styles.WebView}
            source={{
              html: `<img alt="Banner" src="${
                selectedPost.banner
              }" style="width:${screenWidth - 60}px;height:${screenHeight *
                0.25}px;">
              ${selectedPost.content}`
            }}
          />
        </View>
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
  const { adminFeed } = state.reducer;
  return { adminFeed };
};

export default connect(mapStateToProps)(AdminPost);

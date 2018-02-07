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
import { connect } from "react-redux";
import Loading from "../../../Loading/Loading";
import * as MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { modalStyles } from "./styles";
import { FETCH_FB_FEED_REQUEST } from "../../../../actions/auth";
import { styles } from "./styles";
import { formatTime } from "./formatTime";

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
              <ListItem button style={styles.listContainer}>
                <Card>
                  <CardItem>
                    <Thumbnail
                      style={styles.thumbnailImg}
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
                    <Text style={styles.previewText}>{messageDigest}</Text>
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
    const ModalCard = (props: { selectedPost: FbfeedType }): React.Node =>
      !props.selectedPost ? (
        <View />
      ) : (
        <ScrollView style={styles.modalScrollview}>
          <MaterialIcons.Button
            name="arrow-back"
            borderRadius={5}
            backgroundColor="transparent"
            color="black"
            size={30}
            underlayColor={styles.$buttonUnderlayColor}
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
            style={styles.modalImg}
            source={{ uri: selectedPost.full_picture }}
          />

          <Text style={styles.messageText}>{selectedPost.message}</Text>
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
